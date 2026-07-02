import mongoose from "mongoose";

const chatSchema =
  new mongoose.Schema(
    {
      chatId: {
        type: String,
        required: true
      },

      role: {
        type: String,
        required: true
      },

      content: {
        type: String,
        required: true
      }
    },
    {
      timestamps: true
    }
  );

export default mongoose.model(
  "Chat",
  chatSchema
);