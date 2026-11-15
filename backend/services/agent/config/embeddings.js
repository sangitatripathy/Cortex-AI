import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const embeddings = new GooogleGenerativeAIEmbeddings({
  model:"gemini-embedding-001"
})