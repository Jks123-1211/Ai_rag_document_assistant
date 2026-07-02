import { getDocuments }
from "./documentStore.js";

import {
  searchSimilarChunks
}
from "./vectorStore.service.js";

export const retrieveChunks = async (
  question,
  chatId
) => {

  const documents =
    await getDocuments(chatId);
  
  console.log(
    "DOCUMENTS:",
    documents.length
  );

  const stopWords = [
    "what",
    "where",
    "when",
    "who",
    "why",
    "how",
    "is",
    "are",
    "was",
    "were",
    "the",
    "a",
    "an",
    "of",
    "in",
    "to",
    "for",
    "on",
    "at",
    "tell",
    "about",
    "me",
    "please",
    "do",
    "does",
    "it",
    "this",
    "that"
  ];

  const synonyms = {
    ftdm: [
      "crmhs",
      "central raw material handling system"
    ],

    crmhs: [
      "central raw material handling system"
    ],

    receipt: [
      "payment",
      "transaction",
      "amount",
      "receipt no"
    ],

    payment: [
      "receipt",
      "transaction"
    ]
  };

  const keywords =
    question
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(
        word =>
          !stopWords.includes(word)
      )
      .filter(
        word =>
          word.length > 2
      );

  let expandedKeywords =
    [...keywords];

  keywords.forEach(word => {

    if (synonyms[word]) {

      expandedKeywords.push(
        ...synonyms[word]
      );

    }

  });

  expandedKeywords =
    [...new Set(expandedKeywords)];

  console.log(
    "KEYWORDS:",
    expandedKeywords
  );

  const results = [];

  documents.forEach((doc) => {

    doc.chunks.forEach((chunk) => {

      const lowerChunk =
        chunk.toLowerCase();

      const fileName =
        doc.name.toLowerCase();

      let score = 0;

      expandedKeywords.forEach(word => {

        // Exact phrase match
        if (
          lowerChunk.includes(word)
        ) {
          score += 5;
        }

        // File name match
        if (
          fileName.includes(word)
        ) {
          score += 15;
        }

      });

      // Receipt document boost
      if (
        question.toLowerCase().includes("receipt")
        &&
        fileName.includes("receipt")
      ) {
        score += 50;
      }

      // CRMHS report boost
      if (
        (
          question.toLowerCase().includes("crmhs")
          ||
          question.toLowerCase().includes("ftdm")
        )
        &&
        (
          fileName.includes("ftdm")
          ||
          fileName.includes("crmhs")
        )
      ) {
        score += 50;
      }

      if (score > 0) {

        results.push({
          score,
          text: `
SOURCE DOCUMENT: ${doc.name}

${chunk}
`
        });

      }

    });

  });

  console.log(
    "RESULTS FOUND:",
    results.length
  );

  results.sort(
    (a, b) => b.score - a.score
  );

  return results
    .slice(0, 5)
    .map(
      item => item.text
    );

};