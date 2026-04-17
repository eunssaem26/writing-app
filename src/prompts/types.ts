export interface LessonConfig {
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
