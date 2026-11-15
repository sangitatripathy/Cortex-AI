import { getModel } from "../config/llmModel.js";
import fs from "fs";

export const imageAnalyzer = async (state) =>{
  try{
    const llm = await getModel("imageAnalyzer")

    const imageBuffer = await fs.readFile(state.file.path)

    const base64image = imageBuffer.toString("base64")

    const messages = [
      new SystemMessage(
        `You are CortexAI image analyzer agent.
        Rules:
        - Analyze only the uploaded image.
        - Answer the user's question accurately
        - If text exists in the image, extract it.
        - If charts or tables exist, explain them.
        - If something is unclear, say so.
        - Use markdown when helpful.
        - Do not hallucinate. 
        `
      ),
      new HumanMessage(
        {
          content:[
            {
              type:"text",
              text: state.prompt || "analyze the image"
            },
            {
              type:"image_uri",
              "image_url":{
                url:`data:${state.file.mimetype};base64,${base64image}`
              }
            }
          ]
        }
      )
    ]

    const response = await llm.invoke(messages)
    return {
      ...state,
      aiResponse: response.content
    }

  }catch(error){
    console.log(error)
    return {
      ...state,
      aiResponse: "Failed to analyze file"
    }
  }finally{
    fs.unlink(state.file.path)
  }
}