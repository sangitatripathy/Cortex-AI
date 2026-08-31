import { getModel } from "../config/llmModel.js";
import { generatePPT } from "../utils/generatePPT.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFroms3 } from "../utils/getFromS3.js";

export const pptAgent = async (state) => {
  try {
    const llm = await getModel("ppt");
    const prompt = `You are a professional presentation designer.
    Return only valid JSON.
    Format:
    {
      "title":"",
      "subtitle":"",
      "slides":[
        {
          "title":"",
          "points":[
            "",
            "",
            "",
            ""
          ]
        }
      ]
    }

    Rules:
    - Generate exactly 6 content slides.
    -Each slide should have 4-6 concise bullet points.
    - No Markdown
    - No explanation
    - No code block
    - Return ONLY JSON

    Topic:
    ${state.prompt}
    `;

    const res = await llm.invoke(prompt);
    const data = JSON.parse(res.content);
    const ppt = await generatePPT(data);
    const buffer = await ppt.write({
      outputType: "nodebuffer",
    });

    const filename = `ppt-${Date.now()}.pptx`;

    await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );

    const downloadUrl = await getFroms3(filename, 10 * 60);

    return {
      ...state,
      aiResponse: `
      ✅ presentation Generated

      **${data.title}**

      📥 [Download PPT](${downloadUrl})

      Link expires in 10 minutes
      `,
    };
  } catch (error) {
    console.log(error);
    return {
      ...state,
      aiResponse:"Failed to generate PPT"
    }
  }
};
