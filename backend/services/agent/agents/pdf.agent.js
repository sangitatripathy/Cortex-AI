import { getModel } from "../config/llmModel.js";
import { generatePDF } from "../utils/generatePdf.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFroms3 } from "../utils/getFromS3.js";

export const pdfAgent = async (state) => {
  try {
    const llm = await getModel("pdf");

    const prompt = `
      You are an expert document writer.

      Return only valid JSON.
      Do NOT return markdown.
      Do NOT return explanations.

      Structure:
      {
        "title": "",
        "subtitle": "",
        "sections": [
          {
            "heading": "",
            "points": []
          }
        ]
      }

      Generate 4-8 sections.
      Each section should have 3-6 concise bullet points.

      Topic:
      ${state.prompt}
      `;

    const res = await llm.invoke(prompt);

    const data = JSON.parse(res.content);

    const pdfBuffer = await generatePDF(data);

    const filename = `pdf-${Date.now()}.pdf`;

    await uploadToS3(filename, pdfBuffer, "application/pdf");

    const downloadUrl = await getFroms3(filename, 60 * 10);

    return {
      ...state,

      aiResponse: `# PDF Generated

      Your document has been created successfully.

      **${data.title}**

      📄 Your PDF is ready to download.

      [Download PDF](${downloadUrl})

      *This download link expires in 10 minutes.*`,
    };
  } catch (error) {
    console.log("PDF ERROR:", error);

    return {
      ...state,
      aiResponse: "❌ Failed to generate PDF",
    };
  }
};
