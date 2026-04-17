export interface FailedCriterion {
  criterion_id: string;
  criterion_text: string;
  evidence_sentence_indexes: number[];
}

export interface Strength {
  sentence_index: number;
  text: string;
  reason: string;
}

export interface Improvement {
  criterion_id: string;
  sentence_index: number;
  original: string;
  problem: string;
  suggestion: string;
}

export interface ScoreBreakdown {
  fluency?: number;
  structure?: number;
  content?: number;
  expression?: number;
  conventions?: number;
  // 2단계 루브릭
  topic_sentence?: number;
  supporting?: number;
  closing?: number;
  coherence?: number;
  connectives?: number;
}

export interface Score {
  total: number;
  breakdown: ScoreBreakdown;
}

export interface FeedbackResult {
  lesson_id: string;
  pass: boolean;
  result_label: string;
  score: Score | null;
  failed_criteria: FailedCriterion[];
  strengths: Strength[];
  improvements: Improvement[];
  one_tip: string;
  teacher_handoff_needed: boolean;
  teacher_handoff_reason: string | null;
}
