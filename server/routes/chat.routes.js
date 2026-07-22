import express from "express";

import { getDocuments }
from "../services/documentStore.js";

import { askGemini }
from "../services/gemini.service.js";

import { summarizeDocuments }
from "../services/summary.service.js";

import { retrieveChunks }
from "../services/retrieval.service.js";

import {
  searchSimilarChunks
} from "../services/vectorStore.service.js";

import {
  addMessage,
  getChatMemory
} from "../services/chatMemory.js";

import {
  expandQuery
} from "../services/queryExpansion.service.js";
const router = express.Router();

import AnswerCache
from "../models/AnswerCache.js";

import {
  extractWithRegex
} from "../services/regexExtractor.service.js";

router.post("/", async (req, res) => {

  try {

    const question =
      req.body.question?.trim();

    const chatId =
      req.body.chatId
        ? String(req.body.chatId)
        : "";

    console.log(
      "REQUEST BODY:",
      req.body
    );

    console.log(
      "CHAT ID RECEIVED:",
      chatId
    );
    if (!chatId) {

      console.log(
        "NO CHAT ID RECEIVED"
      );

      return res.status(400).json({
        answer: "Chat ID is missing"
      });

    }

    if (!question) {

      return res.status(400).json({
        answer: "Question is missing"
      });

    }
    console.log(
      "BEFORE USER MESSAGE:",
      {
        chatId,
        type: typeof chatId
      }
    );

    await addMessage(
      chatId,
      "user",
      question
    );

    console.log(
      "QUESTION:",
      question
    );

    console.log(
      "CHAT ID:",
      chatId
    );
    const documents =
      await getDocuments(chatId);

    const memory =
      await getChatMemory(chatId);

    const conversationHistory =
      memory
        .map(
          msg =>
            `${msg.role}: ${msg.content}`
        )
        .join("\n");

    if (
      !documents ||
      documents.length === 0
    ) {

      return res.json({
        answer:
          "Please upload a document first."
      });

    }

    const lowerQuestion =
      question.toLowerCase();

    const isSummaryRequest =
      lowerQuestion.includes("summarize")
      ||
      lowerQuestion.includes("summarise")
      ||
      lowerQuestion.includes("summary");

    if (isSummaryRequest) {

      console.log(
        "Generating Summary..."
      );

      const answer =
        await summarizeDocuments(
          documents
        );
      console.log(
        "BEFORE ASSISTANT MESSAGE:",
        {
          chatId,
          type: typeof chatId
        }
      );
      await addMessage(
        chatId,
        "assistant",
        answer
      );

      return res.json({
        answer,
      });

    }

    const lastMessages =
      memory
        .slice(-4)
        .map(
          msg => msg.content
        )
        .join(" ");

    // Expand user query
    const expandedQuery =
      await expandQuery(
        question
      );

    console.log(
      "ORIGINAL QUESTION:",
      question
    );

    console.log(
      "EXPANDED QUERY:",
      expandedQuery
    );

    let retrievalQuestion =
      `
    ${question}

    ${expandedQuery}
    `;

    if (
      question
        .toLowerCase()
        .includes("it")
      ||
      question
        .toLowerCase()
        .includes("this")
      ||
      question
        .toLowerCase()
        .includes("that")
    ) {

      retrievalQuestion =
        `
    ${lastMessages}

    ${question}

    ${expandedQuery}
    `;

    }
    let relevantChunks =
      await searchSimilarChunks(
        chatId,
        retrievalQuestion
      );

    if (
      relevantChunks.length === 0
    ) {

      relevantChunks =
        await retrieveChunks(
          retrievalQuestion,
          chatId
        );

    }

    console.log(
      "Relevant Chunks:",
      relevantChunks.length
    );

    if (
      relevantChunks.length === 0
    ) {

      return res.json({
        answer:
          "I could not find that information in the uploaded documents."
      });

    }

    const context =
      relevantChunks.join("\n");

    const regexResult =
      extractWithRegex(
        question,
        context
      );

    if (
      regexResult.found
    ) {

      console.log(
        "REGEX MATCH FOUND"
      );

      return res.json({
        answer:
          regexResult.answer
      });

    }

    const prompt = `
You are an AI document assistant.

Answer ONLY from the provided context.

Conversation History:

${conversationHistory}

Context:

${relevantChunks.join("\n\n")}

Current Question:

${question}

Rules:

1. Use only the context provided.
2. Use conversation history when the user refers to previous answers.
3. Always mention the source document name.
4. Format answers as:

Source: <document name>

Answer: <answer>

5. Do not make up information.

6. If the exact field requested is not present:
   - Clearly state that the requested field was not found.
   - Look for closely related identifiers, labels, codes, numbers, dates, or references in the same context.
   - Present those related values to help the user.
   - Never invent values.

Examples:
- If "Invoice Number" is missing but "Receipt No" exists, mention the Receipt No.
- If "Employee ID" is missing but "User ID" exists, mention the User ID.
- If "Reference Number" is missing but "Transaction ID" exists, mention the Transaction ID.

7. If neither the requested field nor any related information exists, say:
"I could not find that information in the uploaded documents."

8. Keep answers concise.
`;

    console.log(
      "RETRIEVED CHUNKS:"
    );

    console.log(
      relevantChunks
    );
    console.log(
      "Calling Gemini..."
    );
    const cachedAnswer =
      await AnswerCache.findOne({
        chatId,
        question:
          question.toLowerCase().trim()
      });

    if (cachedAnswer) {

      console.log(
        "CACHE HIT"
      );

      return res.json({
        answer:
          cachedAnswer.answer
      });

}

    const answer =
      await askGemini(
        prompt
      );
    await AnswerCache.create({

      chatId,

      question:
        question.toLowerCase().trim(),

      answer

    });
    console.log(
      "BEFORE ASSISTANT MESSAGE:",
      {
        chatId,
        type: typeof chatId
      }
    );

    await addMessage(
      chatId,
      "assistant",
      answer
    );

    console.log(
      "Gemini Response:",
      answer
    );

    return res.json({
      answer,
    });

  } catch (error) {

    console.error(
      "FULL ERROR:"
    );

    console.error(error);
    console.error(error.stack);

    if (
      error.message &&
      error.message.includes("503")
    ) {

      return res.json({
        answer:
          "Gemini is currently busy. Please try again in a few seconds."
      });

    }

    if (
      error.message &&
      error.message.includes("429")
    ) {

      return res.json({
        answer:
          "Gemini free-tier limit reached. Please wait a few minutes and try again."
      });

    }

    return res.status(500).json({
      answer:
        "Something went wrong while processing the request."
    });

  }

});

export default router;
