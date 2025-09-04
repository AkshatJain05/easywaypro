import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Gemini API Setup (once)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Utility: Remove Markdown code fences
function cleanMarkdown(raw) {
  if (!raw) return "";
  let text = raw.trim();
  if (text.startsWith("```json")) text = text.replace(/^```json/, "").trim();
  else if (text.startsWith("```")) text = text.replace(/^```/, "").trim();
  if (text.endsWith("```")) text = text.replace(/```$/, "").trim();
  return text;
}

// Default JSON keys
const defaultKeys = {
  summary: "",
  functionality_details: "",
  time_complexity: "",
  space_complexity: "",
  expected_output: "",
  potential_bugs: "",
  security_issues: "",
  performance_tips: "",
  readability_tips: "",
  optimizedCode: "",
  fixedCode: ""
};


// POST /analyze-code
router.post("/analyze-code", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required." });
  }

 const prompt = `
You are Easyway Code Analyzer. Analyze the following ${language} code.

Return ONLY a valid JSON object with these keys:
${JSON.stringify(defaultKeys, null, 2)}

Rules:
- Keep answers short and simple.
- If nothing applies, leave as "".
- Use plain text (no markdown, no backticks).
- "expected_output": give a small input/output example if possible.
- "refactored_code": runnable improved ${language} code only.

Code:
${code}
`;


  try {
    // ✅ Correct API call format
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const rawText = result.response.text();
    const cleanedText = cleanMarkdown(rawText);

    let analysisData;
    try {
      analysisData = JSON.parse(cleanedText);
    } catch (jsonError) {
      console.error("Failed to parse Gemini JSON:", jsonError);
      console.error("Raw Gemini response:", rawText);
      return res.status(500).json({
        error: "Failed to parse analysis result. Gemini may not have returned valid JSON.",
        rawResponse: rawText,
      });
    }

    const finalData = { ...defaultKeys, ...analysisData };
    res.json(finalData);
  } catch (error) {
    console.error("Error analyzing code with Gemini API:", error);
    res.status(500).json({ error: "Failed to analyze code.", details: error.message });
  }
});

export default router;
