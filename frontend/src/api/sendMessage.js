import api from "../../utils/axios"

async function sendMessage(payload){
  try{
    const {data} = api.post("/api/agent/chat",payload)
    return data
  }catch(error){
    console.log(error)
    return null
  }
}

export default sendMessage;