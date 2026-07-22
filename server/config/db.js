import mongoose from "mongoose";

const connectDB = async () => {

  try {

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    await mongoose.connect(process.env.MONGODB_URI);

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
