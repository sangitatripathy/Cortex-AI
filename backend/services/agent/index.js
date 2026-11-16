import express from "express";
import "dotenv/config";
import ConnectDB from "./config/db.js";
import dns from 'node:dns';
import router from "./routes/agent.route.js";
dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
]);


const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use("/",router);

app.use((err,req,res,next) =>{
  console.log(err)

  if(err.status){
    return res.status(err.status).json(err.data)
  }

  return res.status(500).json({message:`agent error ${err}`})
})

app.get("/",(req,res)=>{
  res.json({message:"Hello from agent"})
})


app.listen(port,()=>{
  console.log(`Agent started at ${port}`)
  ConnectDB();
})