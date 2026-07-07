import type { LessonConfig } from "@/prompts/types";
import { stageLabel } from "@/prompts";

export function buildUserPrompt(
  lesson: LessonConfig,
  studentText: string,
  // 피드백을 영어로 낼지 — 기본은 L2 트랙 차시. 학생 언어(en)에 따라 상위에서 덮어씀.
  english: boolean = lesson.track === "l2"
): string {
  const sentences = studentText
    .split("\n")
    .map((line, i) => `${i + 1}. ${line}`)
    .join("\n");

  const criteriaType = lesson.is_rubric ? "루브릭 항목" : "평가 기준";
  const isL2 = english;

  // L2는 영어 피드백 + 영어 result_label, heritage는 기존 한국어 그대로.
  const resultLabelSchema = isL2
    ? `"Great job! 🎉" | "Almost there — let's fix a few things"`
    : `"합격" | "아직 조금 더 다듬어봐요"`;
  const languageNote = isL2
    ? `\n[Feedback language]\nWrite all explanatory text (result_label, reason, problem, one_tip) in ENGLISH. Keep "suggestion" as a corrected KOREAN sentence.\n`
    : "";

  return `[차시 정보]
차시: ${stageLabel(lesson.stage)} ${lesson.lesson_num}차시 — ${lesson.lesson_title}
학습 내용: ${lesson.lesson_summary}
과제: ${lesson.assignment}

[${criteriaType}]
${lesson.criteria}

[합격 기준]
${lesson.pass_rule}

[이번 차시에서 평가하지 않는 항목]
${lesson.not_evaluated}
${languageNote}
[학생 글 — 줄번호 포함]
${sentences}

[출력 형식]
반드시 아래 JSON 스키마를 그대로 따르세요. 다른 텍스트는 절대 출력하지 마세요.

{
  "lesson_id": "${lesson.lesson_id}",
  "pass": true | false,
  "result_label": ${resultLabelSchema},
  "score": null${lesson.is_rubric ? ` | {
    "total": <number>,
    "breakdown": {
      "fluency": <0~4>,
      "structure": <0~4>,
      "content": <0~4>,
      "expression": <0~4>,
      "conventions": <0~4>
    }
  }` : ""},
  "failed_criteria": [
    {
      "criterion_id": "<C1 또는 R1 등>",
      "criterion_text": "<기준 설명 한 문장>",
      "evidence_sentence_indexes": [<문장 번호 목록>]
    }
  ],
  "strengths": [
    {
      "sentence_index": <번호>,
      "text": "<원문 발췌>",
      "reason": "<칭찬 이유>"
    }
  ],
  "improvements": [
    {
      "criterion_id": "<failed_criteria의 criterion_id와 동일>",
      "sentence_index": <번호>,
      "original": "<원문>",
      "problem": "<무엇이 문제인지>",
      "suggestion": "<수정 예시 문장>"
    }
  ],
  "one_tip": "<다음 글쓰기에 도움될 팁 1가지>",
  "teacher_handoff_needed": true | false,
  "teacher_handoff_reason": null | "<선생님 확인이 필요한 이유>"
}`;
}
