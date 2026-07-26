import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { task, deadline } = req.body;

  if (!task || !deadline) {
    return res.status(400).json({ error: '작업 내용과 최종 기한을 입력해 주세요.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
사용자가 미루고 있는 작업: "${task}"
최종 마감 기한: "${deadline}"

현재 시간부터 최종 마감 기한까지 이 작업을 완수하기 위한 타임테이블과 실행 전략을 짜주세요.
반드시 아래 JSON 형식으로만 응답해 주세요. 다른 설명이나 마크다운 태그 없이 JSON만 출력하세요.

{
  "timetable": [
    {
      "time": "예: 14:00 - 15:00 또는 D-1 10:00",
      "action": "해당 시간대에 해야 할 작업"
    }
  ],
  "strategy": "조급함을 완화하고 할 수 있다는 동기를 부여하는 마감 돌파 전략 및 코칭 텍스트"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const resultText = response.text;
    const parsedData = JSON.parse(resultText);

    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message || '타임테이블 생성 실패' });
  }
}
