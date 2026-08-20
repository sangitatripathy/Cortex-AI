import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import router from "./routes/auth.route.js";
import morgan from 'morgan';
import dns from 'node:dns';
dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
]);

dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(morgan("dev"))
app.use(express.json());
app.use("/",router)

app.get("/",(req,res)=>{
  res.json({message:"Hello from auth"})
})

app.listen(port,()=>{
  console.log(`Auth started at ${port}`)
  ConnectDB();
})