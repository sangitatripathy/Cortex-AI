import mongoose from "mongoose";

const ConnectDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected")
  }catch(error){
    console.log(`db error ${error}`)
  }
}

export default ConnectDB;