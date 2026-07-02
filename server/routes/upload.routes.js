import express from "express";
import multer from "multer";
import { extractPdfText } from "../services/pdf.service.js";
import { addDocument } from "../services/documentStore.js";
import { chunkText } from "../utils/chunkText.js";
import { createChatVectorStore }
from "../services/vectorStore.service.js";

const router = express.Router();

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        file.originalname
    );
  },

});

const upload = multer({
  storage,
});

router.post(
  "/",
  upload.single("file"),
  async (req, res) => {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    try {

      if (!req.file) {

        return res.status(400).json({
          message: "No file uploaded",
        });

      }

      const { chatId } = req.body;

      console.log(
        "Starting PDF extraction..."
      );

      const text =
        await extractPdfText(
          req.file.path
        );

      console.log(
        "PDF extraction complete"
      );

      console.log(
        "Text Length:",
        text.length
      );

      const chunks =
        chunkText(text);

      console.log(
        "Chunk Count:",
        chunks.length
      );

      console.log(
        "First Chunk:"
      );

      console.log(
        chunks[0]?.slice(0, 200)
      );

      console.log(
        "FAISS TEMPORARILY DISABLED"
      );

      const embeddings =
        await createChatVectorStore(
          chatId,
          chunks
        );
      const savedDocument =
        await addDocument(
          chatId,
          req.file.originalname,
          chunks,
          embeddings,
          req.file.size
        );

      console.log(
        "PDF Uploaded:",
        req.file.originalname
      );

      console.log(
        "Total Chunks:",
        chunks.length
      );
      res.json({

        message:
          "File uploaded successfully",

        documentId:
          savedDocument._id,

        fileName:
          req.file.originalname,

        totalChunks:
          chunks.length,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to extract PDF",
      });

    }

  }
);

export default router;