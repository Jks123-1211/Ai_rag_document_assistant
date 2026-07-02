import faiss from "faiss-node";

import {
  generateEmbedding
} from "./embedding.service.js";

import {
  getAllDocuments
} from "./documentStore.js";

const chatIndexes = {};

export const createChatVectorStore =
  async (
    chatId,
    chunks
  ) => {

    try {

      const embeddings = [];

      for (const chunk of chunks) {

        const vector =
          await generateEmbedding(
            chunk
          );

        if (
          !vector ||
          vector.length === 0
        ) {
          continue;
        }

        embeddings.push(vector);

        console.log(
          "Embedding Length:",
          vector.length
        );

      }

      console.log(
        "Embeddings Created:",
        embeddings.length
      );

      if (
        embeddings.length === 0
      ) {

        console.log(
          "No embeddings created"
        );

        return;

      }

      const dimension =
        embeddings[0].length;

      // First upload for this chat
      if (
        !chatIndexes[chatId]
      ) {

        const index =
          new faiss.IndexFlatL2(
            dimension
          );

        embeddings.forEach(
          vector => {

            index.add(
              vector
            );

          }
        );

        chatIndexes[chatId] = {
          index,
          chunks: [...chunks]
        };

      }

      // Additional uploads
      else {

        embeddings.forEach(
          vector => {

            chatIndexes[
              chatId
            ].index.add(
              vector
            );

          }
        );

        chatIndexes[
          chatId
        ].chunks.push(
          ...chunks
        );

      }

      console.log(
        "FAISS Index Updated:",
        chatId
      );

      console.log(
        "Total Chunks In Store:",
        chatIndexes[
          chatId
        ].chunks.length
      );

      return embeddings;

    } catch (error) {

      console.error(
        "FAISS Index Error:"
      );

      console.error(error);

    }

  };

export const searchSimilarChunks =
  async (
    chatId,
    question,
    topK = 5
  ) => {

    try {

      const store =
        chatIndexes[chatId];

      if (!store) {

        console.log(
          "No FAISS Store Found For:",
          chatId
        );

        return [];

      }

      const queryVector =
        await generateEmbedding(
          question
        );

      const actualK =
        Math.min(
          topK,
          store.chunks.length
        );

      const result =
        store.index.search(
          queryVector,
          actualK
        );

      console.log(
        "FAISS Search Results:",
        result
      );

      if (
        !result ||
        !result.labels
      ) {
        return [];
      }

      return result.labels
        .filter(
          idx => idx >= 0
        )
        .map(
          idx =>
            store.chunks[idx]
        );

    } catch (error) {

      console.error(
        "FAISS Search Error:"
      );

      console.error(error);

      return [];

    }

  };

export const deleteChatVectorStore =
  (chatId) => {

    delete chatIndexes[chatId];

    console.log(
      "FAISS Store Deleted:",
      chatId
    );

  };

export const rebuildAllIndexes =
  async () => {

    try {

      const documents =
        await getAllDocuments();

      console.log(
        "Rebuilding FAISS..."
      );

      const groupedChats = {};

      documents.forEach(doc => {

        if (
          !groupedChats[
            doc.chatId
          ]
        ) {

          groupedChats[
            doc.chatId
          ] = {
            chunks: [],
            embeddings: []
          };

        }

        groupedChats[
          doc.chatId
        ].chunks.push(
          ...doc.chunks
        );

        groupedChats[
          doc.chatId
        ].embeddings.push(
          ...doc.embeddings
        );

      });

      for (
        const chatId
        in groupedChats
      ) {

        const data =
          groupedChats[
            chatId
          ];

        if (
          !data.embeddings ||
          data.embeddings.length === 0
        ) {

          continue;

        }

        console.log(
          "TOTAL EMBEDDINGS:",
          data.embeddings.length
        );

        console.log(
          "FIRST EMBEDDING LENGTH:",
          data.embeddings[0]?.length
        );

        const dimension =
          data.embeddings[0].length;

        console.log(
          "FAISS OBJECT:",
          Object.keys(faiss)
        );

        const index =
          new faiss.IndexFlatL2(
            dimension
          );

        console.log(
          "INDEX CREATED"
        );

        data.embeddings.forEach(
          vector => {

            console.log(
              "ADDING VECTOR:",
              vector.slice(0, 5)
            );

            index.add(
              [...vector]
            );

          }
        );

        chatIndexes[
          chatId
        ] = {

          index,

          chunks:
            data.chunks

        };

        console.log(
          `FAISS Rebuilt: ${chatId}`
        );

      }

      console.log(
        "FAISS Rebuild Complete"
      );

    } catch (error) {

      console.error(
        "FAISS Rebuild Error"
      );

      console.error(error);

    }

  };
  