import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getCurrentUser } from "./controllers/user.contoller.js";
import protect from "./middleware/auth.middleware.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
import morgan from 'morgan';

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(morgan("dev"))
app.use(cookieParser());

app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URI));
app.use("/api/chat",protect, proxyWithHeader(process.env.CHAT_SERVICE_URI));
app.use("/api/agent",protect, proxy(process.env.AGENT_SERVICE_URI))
app.use("/api/me", protect, getCurrentUser);

app.get("/", (req, res) => {
  res.json({ message: "Hello from gateway" });
});

app.listen(port, () => {
  console.log(`gateway started at ${port}`);
});
