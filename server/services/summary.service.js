import { askGemini }
from "./gemini.service.js";

const SUMMARY_BATCH_CHAR_LIMIT = 12000;

const buildDocumentBatches = (
  documents
) => {

  const batches = [];

  documents.forEach((doc) => {

    let currentBatch = "";

    doc.chunks.forEach((chunk, index) => {

      const entry =
        `
SOURCE DOCUMENT: ${doc.name}
CHUNK: ${index + 1}

${chunk}
`;

      if (
        currentBatch.length + entry.length >
        SUMMARY_BATCH_CHAR_LIMIT
      ) {

        if (currentBatch.trim()) {
          batches.push(currentBatch);
        }

        currentBatch = entry;

        return;

      }

      currentBatch += entry;

    });

    if (currentBatch.trim()) {
      batches.push(currentBatch);
    }

  });

  return batches;

};

export const summarizeDocuments =
  async (
    documents
  ) => {

    const batches =
      buildDocumentBatches(
        documents
      );

    if (batches.length === 0) {
      return "I could not find readable content in the uploaded documents.";
    }

    const batchSummaries = [];

    for (
      let index = 0;
      index < batches.length;
      index++
    ) {

      const prompt =
        `
You are an AI document assistant.

Summarize this part of the uploaded document content.
Keep important names, form titles, dates, claim requirements, identifiers, amounts, instructions, and source document names.

Document Content Part ${index + 1} of ${batches.length}:

${batches[index]}
`;

      const partialSummary =
        await askGemini(
          prompt,
          {
            maxOutputTokens: 1024,
            temperature: 0.1
          }
        );

      batchSummaries.push(
        `
PART ${index + 1} SUMMARY:
${partialSummary}
`
      );

    }

    const finalPrompt =
      `
You are an AI document assistant.

Create a clear final summary of the uploaded document(s) using only the part summaries below.

Format the answer exactly with these sections:

1. Executive Summary
2. Key Topics
3. Important Information
4. Required Forms / Actions
5. Conclusion

Mention source document names where useful. Do not stop after the heading.

Part Summaries:

${batchSummaries.join("\n\n")}
`;

    return await askGemini(
      finalPrompt,
      {
        maxOutputTokens: 2048,
        temperature: 0.1
      }
    );

  };
