import { pipeline }
from "@xenova/transformers";

let extractor = null;

const getExtractor =
  async () => {

    if (!extractor) {

      console.log(
        "Loading Embedding Model..."
      );

      extractor =
        await pipeline(
          "feature-extraction",
          "Xenova/all-MiniLM-L6-v2"
        );

      console.log(
        "Embedding Model Loaded"
      );

    }

    return extractor;

  };

export const generateEmbedding =
  async (text) => {

    const model =
      await getExtractor();

    const output =
      await model(
        text,
        {
          pooling: "mean",
          normalize: true
        }
      );

    return Array.from(
      output.data
    );

  };