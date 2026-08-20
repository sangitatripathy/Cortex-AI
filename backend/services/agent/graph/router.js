import { getModel } from "../config/llmModel.js";

export const router = async (state) => {
  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent,
    };
  }
  const llm = await getModel("router");
  const prompt = `You are an agent router.
  Available agents:
  - chat
  - search
  - coding
  - pdf
  - ppt
  - vision

  Rules:
  chat:
  General Conversation,
  explanations,
  learning,
  question.

  search:
  Current events,
  latest information,
  news,
  recent developments,
  internet lookup.

  coding:
  Generate code,
  debug code,
  build projects,
  architecture,
  API design.

  pdf:
  Questions about generate PDFs
  or document context.

  ppt:
  Questions about generate ppts
  or ppt context.

  vision:
  Generate Image,
  Create Image

  Return only one word:

  chat
  search
  coding
  pdf
  ppt
  vision

  User Query:
  ${state.prompt}
  `;

  const res = await llm.invoke(prompt);
  return {
    ...state,
    agent: res.content.trim().toLowerCase(),
  };
};
