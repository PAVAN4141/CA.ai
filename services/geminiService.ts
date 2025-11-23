import { GoogleGenAI, Type } from "@google/genai";
import { VisualizationResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a response for the Tax/Regulation Chat.
 * Uses gemini-2.5-flash for speed and Google Search for up-to-date grounding.
 */
export const getTaxAdvice = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[]
) => {
  try {
    const model = "gemini-2.5-flash";
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: "You are an expert Chartered Accountant assistant. You provide accurate, professional, and concise answers regarding tax laws, accounting standards (IFRS/GAAP), and compliance. Always cite sources when possible.",
        tools: [{ googleSearch: {} }],
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: prompt });
    
    // Extract text
    const text = result.text;

    // Extract grounding metadata if available
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let sources: { uri: string; title: string }[] = [];
    
    if (groundingChunks) {
      groundingChunks.forEach(chunk => {
        if (chunk.web) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Tax Advice Error:", error);
    throw error;
  }
};

/**
 * Solves complex advisory cases using thinking capability.
 * Uses gemini-3-pro-preview with thinkingConfig.
 */
export const getStrategicAdvisory = async (prompt: string) => {
  try {
    const model = "gemini-3-pro-preview";
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: "You are a senior strategic financial advisor. You analyze complex business scenarios, mergers, audits, and ethical dilemmas with deep reasoning. Break down the problem, analyze implications, and provide a structured recommendation.",
        thinkingConfig: { thinkingBudget: 16000 }, // Allocate significant budget for reasoning
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Advisory Error:", error);
    throw error;
  }
};

/**
 * Extracts financial data for visualization.
 * Uses gemini-2.5-flash with JSON schema.
 */
export const analyzeFinancialData = async (rawText: string): Promise<VisualizationResponse> => {
  try {
    const model = "gemini-2.5-flash";
    const response = await ai.models.generateContent({
      model,
      contents: `Analyze the following financial text/data and extract key metrics into a JSON format suitable for a bar chart (categories and numerical values). Also provide a brief textual executive summary. Input Data: ${rawText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "Executive summary of the financial data."
            },
            data: {
              type: Type.ARRAY,
              description: "Array of data points for visualization",
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                }
              }
            }
          },
          required: ["summary", "data"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    return JSON.parse(jsonText) as VisualizationResponse;
  } catch (error) {
    console.error("Financial Analysis Error:", error);
    throw error;
  }
};
