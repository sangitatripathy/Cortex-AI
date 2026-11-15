import axios from 'axios';

export const deductCredits = async (userId, agent, sessionId) => {
  try {
    const { data } = await axios.post(
      `${process.env.AUTH_SERVICE_URI}/deduct-credits`,
      { userId, agent, sessionId },
      { headers: sessionId ? { "x-session-id": sessionId } : {} },
    );
    return data;
  } catch (error) {
    console.log("DEDUCT CREDITS ERROR:", error.response?.data || error.message);
    return null;
  }
};
