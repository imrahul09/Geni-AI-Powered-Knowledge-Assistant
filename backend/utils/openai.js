import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getGeminiApiResponse = async (message) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    return response.text;
  } catch (err) {
    console.log("Gemini API Error:", err);
    throw err;
  }
};

export default getGeminiApiResponse;
