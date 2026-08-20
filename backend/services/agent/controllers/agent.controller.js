import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";
import redis from "../../../shared/redis/redis.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId } = req.body;

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "user",
      content: prompt,
    });

    const result = await graph.invoke({
      prompt,
      conversationId,
    });

    const aiMessage = result.aiResponse;
    await addMessage(conversationId,"user",prompt)
    await addMessage(conversationId,"assistant",aiMessage)

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "assistant",
      content: aiMessage,
    });
    return res.status(200).json(aiMessage);
  } catch (error) {
    console.error("Agent error:", error);

    return res.status(500).json({
      message: "Agent error",
      error: error.message,
    });
  }
};