import express from "express";

import {
  deleteChatDocuments
} from "../services/documentStore.js";

const router = express.Router();

router.delete(
  "/:chatId",
  async (req, res) => {

    try {

      const { chatId } =
        req.params;

      await deleteChatDocuments(
        chatId
      );

      res.json({
        message:
          "Chat deleted"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete chat"
      });

    }

  }
);

export default router;