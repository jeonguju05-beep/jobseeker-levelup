import { callSolar } from "../_upstage";

export async function POST(request) {
  const { deadlines, level, stageLabel } = await request.json();

  const deadlineLines =
    Array.isArray(deadlines) && deadlines.length > 0
      ? deadlines
          .map((d) => `- ${d.title} (${d.date}, D-${d.dday})`)
          .join("\n")
      : "(등록된 마감일 없음)";

  const result = await callSolar([
    {
      role: "system",
      content:
        "너는 취업 준비생의 하루 할 일을 짜주는 코치야. " +
        "아래 마감일 목록과 현재 성장 단계를 참고해서, 오늘 하면 좋을 미션을 " +
        "딱 1개, 한 문장으로 짧게 제안해줘 (예: '토스 서류 마감이 D-3이니 오늘은 자소서 항목 하나를 완성해보는 건 어때요?'). " +
        "따옴표나 부가 설명 없이 문장 하나만 출력해.",
    },
    {
      role: "user",
      content: `[마감일 목록]\n${deadlineLines}\n\n[현재 상태] LV${level ?? 1}, ${stageLabel ?? ""}`,
    },
  ]);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json({ content: result.content });
}
