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

    console.log("IMAGE PROMPT:", prompt);

    const imageUrl =
      `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`;

    console.log("Generating image...");

    const imageRes = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}`,
      },
    });

    console.log("Pollinations status:", imageRes.status);

    const buffer = Buffer.from(imageRes.data);

    console.log("Image size:", buffer.length);

    const filename = `image-${Date.now()}.png`;

    await uploadToS3(
      filename,
      buffer,
      "image/png"
    );

    console.log("Uploaded to S3:", filename);

    const downloadUrl = await getFroms3(
      filename,
      10 * 60
    );

    console.log("Signed URL generated");

    return {
      ...state,

      aiResponse: `# 🖼️ Image Generated Successfully`,

      images: [downloadUrl],

      artifacts: [],
    };

  } catch (error) {

    console.error("VISION ERROR");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);

    return {
      ...state,
      aiResponse: "❌ Failed to generate image",
      images: [],
      artifacts: [],
    };
  }
};