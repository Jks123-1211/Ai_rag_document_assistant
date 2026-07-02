import mongoose from "mongoose";

const answerCacheSchema =
  new mongoose.Schema({

    chatId: String,

    question: String,

    answer: String

  });

export default mongoose.model(
  "AnswerCache",
  answerCacheSchema
);