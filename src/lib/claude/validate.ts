import type {
  FailedCriterion,
  FeedbackResult,
  Improvement,
  Score,
  ScoreBreakdown,
  Strength,
} from "./types";

/**
 * Claude가 돌려준 JSON을 FeedbackResult 형태로 검증·정규화한다.
 * 모델이 배열/필드를 누락하거나 형태를 바꿔도 화면이 깨지지 않도록,
 * 렌더링에 쓰이는 배열·문자열·boolean을 안전한 기본값으로 보정한다.
 * 최소 요건(객체 + boolean pass)조차 없으면 예외를 던져 상위에서 안내 처리.
 */
export function normalizeFeedback(raw: unknown): FeedbackResult {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("feedback schema: 응답이 객체가 아님");
  }
  const o = raw as Record<string, unknown>;
  if (typeof o.pass !== "boolean") {
    throw new Error("feedback schema: pass(boolean) 누락");
  }

  const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  const str = (v: unknown, d = ""): string => (typeof v === "string" ? v : d);

  let score: Score | null = null;
  if (o.score && typeof o.score === "object") {
    const s = o.score as Record<string, unknown>;
    if (typeof s.total === "number") {
      score = {
        total: s.total,
        breakdown:
          s.breakdown && typeof s.breakdown === "object"
            ? (s.breakdown as ScoreBreakdown)
            : {},
      };
    }
  }

  return {
    lesson_id: str(o.lesson_id),
    pass: o.pass,
    result_label: str(o.result_label),
    score,
    failed_criteria: arr<FailedCriterion>(o.failed_criteria),
    strengths: arr<Strength>(o.strengths),
    improvements: arr<Improvement>(o.improvements),
    one_tip: str(o.one_tip),
    teacher_handoff_needed: o.teacher_handoff_needed === true,
    teacher_handoff_reason:
      typeof o.teacher_handoff_reason === "string"
        ? o.teacher_handoff_reason
        : null,
  };
}
