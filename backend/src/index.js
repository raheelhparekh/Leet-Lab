import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "../routes/auth.routes.js";
import problemRoutes from "../routes/problem.routes.js";
import executeCodeRoutes from "../routes/executeCode.routes.js"
import submissionRoutes from "../routes/submission.routes.js"
import playlistRoutes from "../routes/playlist.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.send(" hello welcome to leetlab");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code",executeCodeRoutes)
app.use("/api/v1/submission",submissionRoutes)
app.use("/api/v1/playlist", playlistRoutes)

app.listen(PORT, () => {
  console.log(`Server is runing on Port : ${PORT}`);
});
