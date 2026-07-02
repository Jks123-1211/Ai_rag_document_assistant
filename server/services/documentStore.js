import Document from "../models/Document.js";

export const addDocument = async (
  chatId,
  fileName,
  chunks,
  embeddings,
  fileSize
) => {

  return await Document.create({

    chatId,

    name: fileName,

    chunks,

    embeddings,

    fileSize,

    totalChunks:
      chunks.length,

    uploadedAt:
      new Date()

  });

};

export const getDocuments =
  async (
    chatId
  ) => {

    return await Document.find({
      chatId
    });

  };

export const getAllDocuments =
  async () => {

    return await Document.find();

  };

export const deleteDocument =
  async (
    documentId
  ) => {

    return await Document.findByIdAndDelete(
      documentId
    );

  };

export const deleteChatDocuments =
  async (
    chatId
  ) => {

    await Document.deleteMany({
      chatId
    });

  };