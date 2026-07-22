import express from "express";
import cors from "cors";//frontend runs on different origin and backend 
                        // runs on diiferent origin so we need to use cors to 
                        // allow cross origin request
import testRoutes from "./routes/test.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import chatDeleteRoutes
from "./routes/chatDelete.routes.js";

import documentRoutes
from "./routes/document.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("This origin is not allowed by CORS")
      );
    },
    methods: ["GET", "POST", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/test", testRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use(
  "/api/delete-chat",
  chatDeleteRoutes
);

app.use(
  "/api/documents",
  documentRoutes
);


export default app;
