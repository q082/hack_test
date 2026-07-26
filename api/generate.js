import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { task, deadline } = req.body;

  if (!task || !deadline) {
    return res.status(400).json({ error: '작업 내용과 마감 기한을 모두 입력해주세요.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
사용자가 미루고 있는 작업: "${task}"
최종 마감 기한: "${deadline}" (현재 시간 기준)

당신은 마감 직전의 사용자를 구출하는 열정적이고 능숙한 코치입니다.
현재 시간부터 마감 시각까지의 남은 시간을 계산하여, 사용자가 지금 당장 실행할 수 있는 현실적이고 구체적인 단계를 시각대별 타임테이블로 분해해주세요.

[응답 요구사항]
1. 타임테이블(schedule):
   - time: HH:MM 형태 (예: "14:00", "14:30")
   - title: 해당 시간대에 시작해야 할 핵심 행동
   - detail: 실행을 위한 팁 및 구체적 행동 지침
2. overview (오른쪽 설명창에 들어갈 내용):
   - motivational_message: 조급하지만 "할 수 있다!"는 활력을 주는 강력한 응원 메시지 (2~3문장)
   - strategy_summary: 이 마감 기한을 완벽히 맞추기 위한 핵심 진행 전략 및 주의사항
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            motivational_message: { type: Type.STRING },
            strategy_summary: { type: Type.STRING },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING, description: "알람 시각 (HH:MM)" },
                  title: { type: Type.STRING, description: "해야 할 일 제목" },
                  detail: { type: Type.STRING, description: "상세 실행 팁" }
                },
                required: ["time", "title", "detail"]
              }
            }
          },
          required: ["motivational_message", "strategy_summary", "schedule"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: '타임테이블 생성 중 오류가 발생했습니다: ' + error.message });
  }
}