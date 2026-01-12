
import { GoogleGenAI, Type } from "@google/genai";
import { CommentAnalysis, ScriptOutline } from "../types";

export const analyzeVideoContent = async (
  videoTitle: string,
  comments: string[]
): Promise<CommentAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze these YouTube comments for the video: "${videoTitle}".
    Provide a detailed report in JSON format.
    1. Summary: Brief overview of audience sentiment.
    2. Reaction: How people specifically reacted (emotions, feedback).
    3. Pros/Cons: List 3 key positives and 3 gaps/negatives.
    4. Keywords: 5 high-potential keywords/topics for a new video that would solve audience needs.
    
    Comments:
    ${comments.slice(0, 40).join('\n---\n')}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          audienceReaction: { type: Type.STRING },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exactly 5 keywords" }
        },
        required: ["summary", "audienceReaction", "pros", "cons", "keywords"]
      },
    },
  });

  return JSON.parse(response.text);
};

export const generateScriptOutline = async (
  keyword: string,
  contextTitle: string
): Promise<ScriptOutline> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Create a professional YouTube video script outline (목차) based on the keyword: "${keyword}".
    The video is inspired by the successful elements of "${contextTitle}".
    Provide a catchy title and at least 5 structured sections with brief descriptions.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING },
          title: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          }
        },
        required: ["keyword", "title", "sections"]
      },
    },
  });

  return JSON.parse(response.text);
};
