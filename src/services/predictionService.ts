import { GoogleGenAI, Type } from "@google/genai";
import { PredictionInput } from "../types";

const GEMINI_API_KEY = "AIzaSyCsBLZq8QY4uYHngyM7-fJsFuwRMDEr48U";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function predictHousePrice(input: PredictionInput): Promise<{ predictedPrice: number; reasoning: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Predict the house price based on these features: ${JSON.stringify(input)}. 
      The currency is BDT (Bangladeshi Taka). 
      Return the predicted price and a brief reasoning in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedPrice: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["predictedPrice", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      predictedPrice: result.predictedPrice || 0,
      reasoning: result.reasoning || "Failed to generate reasoning."
    };
  } catch (error) {
    console.error("Prediction error:", error);
    throw new Error("Failed to predict house price. Please check your data and try again.");
  }
}
