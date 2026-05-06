import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeImage(base64Image: string, mimeType: string) {
  const prompt = `
    You are an expert digital forensics analyst. Analyze the provided image for any signs of morphing, tampering, or manipulation.
    
    Look for:
    1. Edge inconsistencies (blurring, pixelation, or unnatural sharp edges around subjects).
    2. Lighting and shadow mismatches (shadows going in different directions, inconsistent intensity).
    3. Texture and noise patterns (repeating patterns, patches of noise that don't match the rest of the image).
    4. Proportional errors or anatomical anomalies.
    5. Artifacts typical of AI generation or photoshopping.
    
    Respond in a structured format:
    - **Verdict**: [Morphed / Highly Likely Morphed / suspicious / Likely Authentic / Authentic]
    - **Confidence Score**: [0-100%]
    - **Key Findings**: A bulleted list of specific artifacts or anomalies found.
    - **Detailed Reasoning**: A short paragraph explaining why you reached this verdict.
    
    Be objective and technical.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: prompt }
        ]
      },
    });

    return response.text || "No analysis provided.";
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze image. Please check if the file format is supported.");
  }
}
