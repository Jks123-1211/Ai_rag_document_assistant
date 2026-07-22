import app from "./app.js";
import dotenv from "dotenv";
import connectDB
from "./config/db.js";

import {
  rebuildAllIndexes
} from "./services/vectorStore.service.js";


dotenv.config();
const PORT = process.env.PORT || 3000;
await connectDB();

await rebuildAllIndexes();

app.listen(
  PORT,
  () => {

    console.log(
      `server is running on port ${PORT}`
    );

  }
);
