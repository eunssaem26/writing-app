// L2 피드백 실검증: SYSTEM_PROMPT_L2로 Claude가 영어 JSON 피드백을 내는지 확인.
// 실행: source .env.local && node --experimental-strip-types scripts/sim-l2-feedback.mts
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT_L2 } from "../src/lib/claude/system-prompt.ts";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// L2 초급1 · 3차시(인사와 자기소개) 유저 프롬프트를 buildUserPrompt(L2)와 동일 형식으로 구성
const studentText = `안녕하세요.
저는 마리아예요.
저는 멕시코 왔어요.
저는 김치 좋아요.`;

const userPrompt = `[차시 정보]
차시: L2 초급 1 3차시 — 인사와 자기소개 (Greetings & Introductions)
학습 내용: 안녕하세요 · 저는 ~이에요 · 만나서 반가워요
과제: Write 3 sentences introducing yourself in Korean: name, country, greeting.

[평가 기준]
C1: 인사말(안녕하세요 등)이 있는가
C2: '저는 ~이에요/예요' 문형으로 이름을 소개했는가
C3: 나라 정보를 담았는가

[합격 기준]
C1·C2 충족, C3 확인

[이번 차시에서 평가하지 않는 항목]
조사 미세 오류, 맞춤법 세부, 존댓말 등급

[Feedback language]
Write all explanatory text (result_label, reason, problem, one_tip) in ENGLISH. Keep "suggestion" as a corrected KOREAN sentence.

[학생 글 — 줄번호 포함]
${studentText.split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n")}

[출력 형식]
반드시 아래 JSON 스키마를 그대로 따르세요. 다른 텍스트는 절대 출력하지 마세요.
{ "lesson_id":"03","pass":true|false,"result_label":"Great job! 🎉" | "Almost there — let's fix a few things","score":null,"failed_criteria":[],"strengths":[{"sentence_index":<n>,"text":"<원문>","reason":"<English>"}],"improvements":[{"criterion_id":"<Cn>","sentence_index":<n>,"original":"<원문>","problem":"<English>","suggestion":"<corrected Korean>"}],"one_tip":"<English>","teacher_handoff_needed":false,"teacher_handoff_reason":null }`;

const res = await client.messages.create({
  model: "claude-haiku-4-5-20251001",
  max_tokens: 900,
  system: [{ type: "text", text: SYSTEM_PROMPT_L2 }],
  messages: [{ role: "user", content: userPrompt }],
});

const text = res.content[0].type === "text" ? res.content[0].text : "";
console.log("=== 원문 응답 ===\n" + text + "\n");
try {
  const j = JSON.parse(text.replace(/^```json?\s*|\s*```$/g, ""));
  const asciiRatio = (s: string) => {
    const letters = (s.match(/[A-Za-z가-힣]/g) ?? []);
    const ascii = (s.match(/[A-Za-z]/g) ?? []).length;
    return letters.length ? ascii / letters.length : 1;
  };
  console.log("=== 검증 ===");
  console.log("pass:", j.pass, "| result_label:", j.result_label);
  console.log("result_label 영어?:", asciiRatio(j.result_label) > 0.8);
  console.log("one_tip 영어?:", asciiRatio(j.one_tip ?? "") > 0.8, "→", j.one_tip);
  if (j.improvements?.[0]) {
    console.log("improvement.problem 영어?:", asciiRatio(j.improvements[0].problem) > 0.8, "→", j.improvements[0].problem);
    console.log("improvement.suggestion (한국어여야):", j.improvements[0].suggestion);
  }
  if (j.strengths?.[0]) console.log("strength.reason 영어?:", asciiRatio(j.strengths[0].reason) > 0.8, "→", j.strengths[0].reason);
} catch (e) {
  console.log("JSON 파싱 실패:", e.message);
}
