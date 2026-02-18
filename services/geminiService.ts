
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDailyGreeting(leftCount: number, totalCount: number) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `현재 전체 직원 ${totalCount}명 중 ${leftCount}명이 퇴근했습니다. 
      대한민국의 직장인들을 위한 오늘의 따뜻한 격려 한마디와 건강한 워라밸 팁을 한국어로 150자 이내로 작성해줘. 
      분위기는 밝고 친근하게 해줘.`,
      config: {
        temperature: 0.8,
      }
    });
    return response.text || "오늘도 수고 많으셨습니다! 즐거운 퇴근길 되세요.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "오늘 하루도 정말 고생 많으셨습니다. 가족과 함께 따뜻한 저녁 시간 보내세요!";
  }
}
