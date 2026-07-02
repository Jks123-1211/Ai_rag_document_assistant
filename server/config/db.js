import mongoose from "mongoose";

const connectDB = async () => {

  try {

    await mongoose.connect(
      "mongodb://localhost:27017/ai_rag_assistant"
    );

    console.log(
      "MongoDB Connected"
    );

  } catch (error) {

    console.error(
      "MongoDB Error:",
      error
    );

    process.exit(1);

  }

};

export default connectDB;