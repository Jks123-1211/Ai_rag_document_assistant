import { askGemini }
from "./gemini.service.js";

export const expandQuery =
  async (question) => {

    try {

      const prompt = `
You are a query expansion assistant.

Expand the user's question with related terms,
keywords, abbreviations, and alternative phrases.

Question:
${question}

Rules:
1. Return only keywords.
2. No explanations.
3. Maximum 20 words.
4. Include abbreviations if relevant.

Example:

Input:
What is the invoice number?

Output:
invoice number receipt number payment receipt transaction id order id
`;

      const expanded =
        await askGemini(
          prompt
        );

      console.log(
        "EXPANDED QUERY:",
        expanded
      );

      return expanded;

    } catch (error) {

      console.error(
        "Query Expansion Failed"
      );

      return question;

    }

  };