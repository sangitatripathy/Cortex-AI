import { getModel } from "../config/llmModel.js";
import { getMemory } from "../config/memory.js";
import {
  SystemMessage,
  AIMessage,
  HumanMessage,
} from "@langchain/core/messages";

export const chatAgent = async (state) => {
  const llm = await getModel("chat");

  const history = await getMemory(state.conversationId);

  const searchContext = state.searchResults ? `Web Search Results:
  ${JSON.stringify(state.searchResults)}
  Answer the user using only the above search results`:""

  const prompt = `You are CortexAI, an Intelligent AI assistant
  
  ${searchContext}
  If searchContext exists:
  -Use search results to Answer
  -Do not mention internal tools

  Rules:
  - For simple questions, greetings, and short queries respond naturally in plain text.
  - For technical , educational, coding or detailed topics, use clean Markdown.
  Formatting:
  - Use # for titles and ## for sections.
  - Leave a blank line after headings.
  - Use bullet point for lists.
  - Use numbered lists for steps.
  - Use fenced code blocks with language tags for code.
  - Keep paragraphs short and readable.
  - Never write heading and content on the same line.
  - Never generate large walls of text
  `;

  const messages = [new SystemMessage(prompt)];

  history.forEach((msg) => {
    if (msg.role == "user") {
      messages.push(new HumanMessage(msg.content));
    }
    if (msg.role == "assistant") {
      messages.push(new AIMessage(msg.content));
    }
  });

  const response = await llm.invoke(messages);

  return {
    ...state,
    aiResponse: response.content,
  };
};
