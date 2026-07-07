export type Track = "heritage" | "l2";

export interface LessonConfig {
  // 트랙: 미지정이면 heritage(재외동포·기존 7단계). "l2"는 영어권 순수 외국인 온램프.
  track?: Track;
  stage: number;
  lesson_num: number;
  lesson_id: string;
  lesson_title: string;
  lesson_summary: string;
  assignment: string;
  criteria: string;
  pass_rule: string;
  not_evaluated: string;
  model: string;
  max_tokens: number;
  is_rubric: boolean;
}
