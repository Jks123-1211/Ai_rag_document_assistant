import mongoose from "mongoose";

const documentSchema =
  new mongoose.Schema(
    {
      chatId: {
        type: String,
        required: true
      },

      name: {
        type: String,
        required: true
      },

      chunks: {
        type: [String],
        default: []
      },

      embeddings: {
        type: [[Number]],
        default: []
      },

      fileSize: {
        type: Number,
        default: 0
      },

      totalChunks: {
        type: Number,
        default: 0
      },

      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },
    {
      timestamps: true
    }
  );

export default mongoose.model(
  "Document",
  documentSchema
);