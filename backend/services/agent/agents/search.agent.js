import { searchTool } from "../config/tavily.js"
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const searchAgent = async (state) => {
  try{
    await checkAgentLimit(state.userId,"search")
    const result = await searchTool.invoke({
      query:state.prompt
    })
    await deductCredits(state.userId,"search",state.sessionId)
    return {
      ...state,
      searchResults: result,
      images: result.images
    }
  }catch(error){
    return {
      ...state,
      searchResults: [],
      images: []
    }
  }
}