
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AnalysisResult {
  mood: string;
  summary: string;
  advice: string;
}

export const geminiService = {
  analyzeEntry: async (content: string): Promise<AnalysisResult> => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this journal entry and provide a mood (one word), a short summary (1 sentence), and a piece of encouraging advice based on the content: \n\n ${content}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mood: { type: Type.STRING },
              summary: { type: Type.STRING },
              advice: { type: Type.STRING },
            },
            required: ["mood", "summary", "advice"],
          },
        },
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return {
        mood: "Reflective",
        summary: "An entry about your personal growth and thoughts.",
        advice: "Keep expressing yourself; it's the path to clarity."
      };
    }
  },
};
