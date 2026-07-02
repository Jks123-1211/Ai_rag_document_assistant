import express from "express";

import Document
from "../models/Document.js";

import AnswerCache
from "../models/AnswerCache.js";

import {
  clearChatMemory
}
from "../services/chatMemory.js";

const router =
  express.Router();

router.get(
  "/:chatId",
  async (
    req,
    res
  ) => {

    try {

      const documents =
        await Document.find({
          chatId:
            req.params.chatId
        })
        .select(
          "-chunks -embeddings"
        );

      res.json(
        documents
      );

    } catch (
      error
    ) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch documents"
      });

    }

  }
);

router.delete(
  "/:documentId",
  async (
    req,
    res
  ) => {

    try {

      const document =
        await Document.findById(
          req.params.documentId
        );

      if (!document) {

        return res.status(404).json({
          message:
            "Document not found"
        });

      }

      const chatId =
        document.chatId;

      await Document.findByIdAndDelete(
        req.params.documentId
      );

      await AnswerCache.deleteMany({
        chatId
      });

      await clearChatMemory(
        chatId
      );

      console.log(
        "Deleted Document:",
        document.name
      );

      console.log(
        "Deleted Chat:",
        chatId
      );

      return res.json({
        message:
          "Document deleted successfully"
      });

    } catch (
      error
    ) {

      console.error(
        "DELETE ERROR:"
      );

      console.error(
        error
      );

      return res.status(500).json({
        message:
          "Delete failed"
      });

    }

  }
);

export default router;