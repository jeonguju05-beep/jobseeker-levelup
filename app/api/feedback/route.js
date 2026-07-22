import { callSolar } from "../_upstage";

export async function POST(request) {
  const { missionContent, userText } = await request.json();

  if (!userText || !userText.trim()) {
    return Response.json({ error: "피드백받을 내용을 입력해주세요." }, { status: 400 });
  }

  const result = await callSolar([
    {
      role: "system",
      content:
        "너는 취업 준비생을 돕는 친절하고 꼼꼼한 커리어 코치야. " +
        "사용자가 붙여넣은 자기소개서 문장이나 면접 예상 답변을 읽고, " +
        "잘한 점 1~2개와 구체적으로 고칠 점 2~3개를 한국어로 짧고 실용적으로 피드백해줘. " +
        "너무 길게 쓰지 말고, 불릿 형태로 핵심만 말해줘.",
    },
    {
      role: "user",
      content: `[관련 미션] ${missionContent || "(제목 없음)"}\n\n[내가 쓴 내용]\n${userText}`,
    },
  ]);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json({ content: result.content });
}
