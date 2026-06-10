export type Role = "student" | "parent" | "teacher";
export type Language = "ko" | "en";

export interface Profile {
  id: string;
  role: Role;
  display_name: string | null;
  language: Language;
  track: "heritage" | "l2" | null;
  created_at: string;
}

export interface DiagnosisResult {
  id: string;
  student_id: string;
  kind: "reading" | "writing";
  level: number;
  correct_count: number;
  wrong_count: number;
  detail: unknown;
  created_at: string;
}

export interface LessonRecord {
  id: string;
  student_id: string;
  stage: number;
  lesson: number;
  student_text: string;
  feedback: unknown;
  created_at: string;
}
