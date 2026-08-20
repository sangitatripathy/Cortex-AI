import redis from "../../../shared/redis/redis.js";
import { getMessages } from "../utils/getMessages.js";

export const getMemory = async(conversationId) =>{
  const key=`messages-${conversationId}`
  const cached = await redis.get(key)
  if(cached){
    return JSON.parse(cached)
  }

  const messages = await getMessages(conversationId)
  await redis.set(key,JSON.stringify(messages),"EX",24*60*60)

  return messages
}

export const addMessage = async (conversationId, role, content) => {
  const key = `messages-${conversationId}`;

  const rawMessage = await redis.get(key);

  let messages;

  if (rawMessage) {
    messages = JSON.parse(rawMessage);
  } else {
    messages = await getMessages(conversationId);

    if (!messages) {
      messages = [];
    }
  }

  messages.push({
    role,
    content,
  });

  // Keep the last 20 messages
  if (messages.length > 20) {
    messages = messages.slice(-20);
  }

  await redis.set(
    key,
    JSON.stringify(messages),
    "EX",
    24 * 60 * 60
  );
};