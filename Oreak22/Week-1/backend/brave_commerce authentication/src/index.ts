import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import registerRouter from "./routers/register.router";
import signinRouter from "./routers/signin.router";
import authenticateRouter from "./routers/authenticate.router";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(require("cors")());
app.use("/api/auth", registerRouter);
app.use("/api/auth", signinRouter);
app.use("/api/auth", authenticateRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
