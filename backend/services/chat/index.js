import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import chatRouter from "./routes/chat.route.js";
import dns from 'node:dns';
dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
]);

dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use("/",chatRouter)

app.listen(port,()=>{
  console.log(`Chat started at ${port}`)
  ConnectDB();
})