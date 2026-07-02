import dotenv from "dotenv";

dotenv.config();

const API_KEY =
  process.env.GEMINI_API_KEY;

const GENERATE_TEXT_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

const parseResponseText = (
  json
) => {

  if (!json) return "";

  const candidate =
    json.candidates?.[0];

  if (candidate) {

    if (candidate.output) {
      return candidate.output;
    }

    const content =
      candidate.content;

    const parts =
      content?.parts ||
      candidate.content?.[0]?.parts;

    if (
      Array.isArray(parts)
    ) {

      return parts
        .map(
          part =>
            part.text || ""
        )
        .join("");
    }

  }

  return json.output || "";
};

export const askGemini =
  async (prompt) => {

    if (!API_KEY) {

      throw new Error(
        "GEMINI_API_KEY is not set in the environment."
      );

    }

    let lastError;

    for (
      let attempt = 1;
      attempt <= 3;
      attempt++
    ) {

      try {

        console.log(
          `Gemini Attempt ${attempt}`
        );

        const response =
          await fetch(
            GENERATE_TEXT_URL,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                "x-goog-api-key":
                  API_KEY,
              },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        text: prompt,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.2,
                  maxOutputTokens: 512,
                },
              }),
            }
          );

        const json =
          await response.json();

        if (!response.ok) {

          const errorMessage =
            `Gemini API error: ${response.status} ${response.statusText} ${json.error?.message || JSON.stringify(json)}`;

          throw new Error(
            errorMessage
          );

        }

        return parseResponseText(
          json
        );

      } catch (error) {

        lastError = error;

        console.error(
          `Gemini Attempt ${attempt} Failed`
        );

        console.error(
          error.message
        );

        if (
          error.message.includes(
            "503"
          ) &&
          attempt < 3
        ) {

          console.log(
            "Gemini busy. Retrying in 2 seconds..."
          );

          await new Promise(
            resolve =>
              setTimeout(
                resolve,
                2000
              )
          );

          continue;

        }

        break;

      }

    }

    throw lastError;

};