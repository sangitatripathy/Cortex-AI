import { getModel } from "../config/llmModel.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFroms3 } from "../utils/getFromS3.js";

export const visionAgent = async (state) => {
  try {
    const llm = await getModel("image");
    const res = await llm.invoke(`
    You are an elite AI image prompt engineer.

    Convert the user request into a highly detailed image generation prompt.

    Requirements:

    - Cinematic lighting
    - Professional composition
    - Ultra realistic
    - High detail
    - Beautiful color palette
    - Sharp focus
    - 8k quality
    - Photorealistic
    - Depth of field
    - Professional photography
    - Stunning visuals

    Return only the image prompt.

    User Request:
      ${state.prompt}
  `);

    const prompt = res.content.trim();

    const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`;

    const imageRes = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}`,
      },
    });

    const buffer = Buffer.from(imageRes.data);
    const filename = `image-${(Date, now())}.png`;

    await uploadToS3(filename, buffer, "image/png");

    const downloadUrl = await getFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `
    # 🖼️ Image Generated Successfully

    ![Generated Image](${downloadUrl})

    📥 [Download Image](${downloadUrl})

    ⏳ Link expires in 10 minutes
    `,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: "❌ Failed to generate image",
    };
  }
};
