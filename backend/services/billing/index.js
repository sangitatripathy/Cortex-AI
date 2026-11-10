import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import dns from 'node:dns';
import router from "./routes/billing.route.js";
dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
]);

dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.get("/",router);
app.get("/",(req,res)=>{
  res.json({message:"hello from billing"})
})

app.get("/",(req,res)=>{
  res.json({message:"Hello from billing Service"})
})

app.listen(port,()=>{
  console.log(`Billing started at ${port}`)
  ConnectDB();
})