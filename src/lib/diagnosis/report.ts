// 대시보드 리포트용 — DB에 저장된 진단 detail / 수업 feedback(jsonb, 타입 unknown)을
// 안전하게 파싱한다. 필드가 없거나 형태가 달라도 화면이 깨지지 않도록 방어적으로 읽는다.

export interface DiagDetail {
  domainLevels: Record<string, number>;
  weightedAvg: number | null;
  borderline: boolean;
}

export function parseDiagDetail(detail: unknown): DiagDetail {
  const d = (detail && typeof detail === "object" ? detail : {}) as Record<
    string,
    unknown
  >;
  const raw =
    d.domain_levels && typeof d.domain_levels === "object"
      ? (d.domain_levels as Record<string, unknown>)
      : {};
  const domainLevels: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "number") domainLevels[k] = v;
  }
  return {
    domainLevels,
    weightedAvg: typeof d.weighted_avg === "number" ? d.weighted_avg : null,
    borderline: d.borderline === true,
  };
}

export interface LessonFeedbackSummary {
  pass: boolean | null;
  scoreTotal: number | null;
  resultLabel: string;
}

export function parseFeedback(feedback: unknown): LessonFeedbackSummary {
  const f = (feedback && typeof feedback === "object" ? feedback : {}) as Record<
    string,
    unknown
  >;
  const score =
    f.score && typeof f.score === "object"
      ? (f.score as Record<string, unknown>)
      : null;
  return {
    pass: typeof f.pass === "boolean" ? f.pass : null,
    scoreTotal: score && typeof score.total === "number" ? score.total : null,
    resultLabel: typeof f.result_label === "string" ? f.result_label : "",
  };
}
