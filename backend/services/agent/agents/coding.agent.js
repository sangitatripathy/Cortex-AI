import { getModel } from "../config/llmModel.js";

export const codingAgent = async (state) => {
  const intentLlm = getModel("intent");
  const llm = getModel("coding");

  const intentRes = await intentLlm.invoke(`
You are an intent classifier.

Return ONLY one of these values:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}
`);

  const intent = intentRes.content.trim().replace(/^["']|["']$/g, "");

  console.log("Intent:", intent);


  if (intent === "CODE_GENERATION") {
    const prompt = `
      You are CortexAI Coding Agent.

      Generate the requested project.

      Default Stack:
      - HTML
      - CSS
      - JavaScript

      Use React / Next.js / Vue only if explicitly requested.

      Requirements:
      - Responsive
      - Modern UI
      - CSS Variables
      - Flexbox/Grid
      - Smooth scrolling
      - Hover effects
      - Beautiful spacing
      - Single page unless user asks otherwise

      IMAGES
      ============================

      Always use real Unsplash images

      IMPORTANT:
      Return ONLY valid JSON.

      The response MUST have exactly this structure:

      {
        "files": [
          {
            "name": "index.html",
            "content": "complete file content"
          },
          {
            "name": "style.css",
            "content": "complete file content"
          },
          {
            "name": "script.js",
            "content": "complete file content"
          }
        ]
      }

      IMPORTANT JSON RULES:

      - Start with {
      - End with }
      - Do NOT use markdown
      - Do NOT use \`\`\`
      - Do NOT add explanations
      - Escape all double quotes inside strings
      - Escape newlines inside strings as \\n
      - Escape backslashes when necessary
      - Return valid JSON that can be parsed using JSON.parse()

      User Request:
      ${state.prompt}
      `;

    const res = await llm.invoke(prompt);

    console.log("RAW CODING RESPONSE:");
    console.log(res.content);

    let content = res.content.trim();

    // Remove markdown fences if model ignores instructions
    content = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let data;

    try {
      data = JSON.parse(content);
    } catch (error) {
      console.error("JSON PARSE ERROR:", error);
      console.error("MODEL OUTPUT:", content);

      return {
        ...state,
        aiResponse:
          "I generated the code, but the response format was invalid. Please try again.",
        artifacts: [],
      };
    }

    return {
      ...state,

      aiResponse: "Code Generated Successfully.",

      artifacts: [
        {
          id: Date.now(),
          type: "Project",
          files: data?.files || [],
          title: state.prompt,
        },
      ],
    };
  }

  // -------------------------
  // 3. Other Coding Tasks
  // -------------------------

  const res = await llm.invoke(`
You are CortexAI Coding Agent.

Detected Intent:
${intent}

Return Markdown only.

Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code

User Request:
${state.prompt}
`);

  return {
    ...state,
    aiResponse: res.content,
    artifacts: [],
  };
};
