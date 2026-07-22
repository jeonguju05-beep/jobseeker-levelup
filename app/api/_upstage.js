// Upstage Solar Chat Completions 호출 공용 헬퍼 (서버 전용, 클라이언트에서 import하지 않음)
export async function callSolar(messages, { temperature = 0.6 } = {}) {
  const apiKey = process.env.UPSTAGE_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      status: 500,
      error:
        "UPSTAGE_API_KEY가 설정되지 않았어요. .env.local에 키를 넣고 서버를 재시작해주세요.",
    };
  }

  const res = await fetch("https://api.upstage.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.UPSTAGE_MODEL || "solar-pro2",
      messages,
      temperature,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      status: res.status,
      error: `Upstage API 오류 (${res.status}): ${text.slice(0, 300)}`,
    };
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content?.trim() || "";
  return { ok: true, content };
}
