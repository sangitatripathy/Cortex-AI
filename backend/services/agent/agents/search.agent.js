import { searchTool } from "../config/tavily.js"

export const searchAgent = async (state) => {
  try{
    const result = await searchTool.invoke({
      query:state.prompt
    })

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