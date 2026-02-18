
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDailyGreeting(leftCount: number, totalCount: number) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        역할: 한국 기업의 워라밸 코치
        상황: 현재 전체 직원 ${totalCount}명 중 ${leftCount}명이 퇴근했습니다.
        요청: 
        1. 현재 퇴근 속도에 맞춘 따뜻하고 센스 있는 격려 멘트 1문장.
        2. 야근이나 회식 대신 가족/자신을 위한 시간을 권장하는 팁 1문장.
        조건: 한국어로 작성, 이모지 활용, 총 100자 이내, 친근한 반말과 존댓말 사이의 부드러운 말투.
      `,
      config: {
        temperature: 0.9,
      }
    });
    return response.text.replace(/["']/g, '') || "오늘도 수고 많으셨습니다! 즐거운 퇴근길 되세요.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "오늘 하루도 정말 고생 많으셨습니다. 가족과 함께 따뜻한 저녁 시간 보내세요!";
  }
}
