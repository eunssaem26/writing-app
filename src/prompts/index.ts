import type { LessonConfig } from "./types";
import { stage1Lessons } from "./stage1";
import { stage2Lessons } from "./stage2";
import { stage3Lessons } from "./stage3";
import { stage4Lessons } from "./stage4";
import { stage5Lessons } from "./stage5";
import { stage6Lessons } from "./stage6";
import { stage7Lessons } from "./stage7";
import { l2Beginner1Lessons } from "./l2-beginner1";
import { l2Beginner2Lessons } from "./l2-beginner2";

const allLessons: LessonConfig[] = [
  ...l2Beginner1Lessons,
  ...l2Beginner2Lessons,
  ...stage1Lessons,
  ...stage2Lessons,
  ...stage3Lessons,
  ...stage4Lessons,
  ...stage5Lessons,
  ...stage6Lessons,
  ...stage7Lessons,
];

// L2 온램프 단계 번호(101~) ↔ 표시 이름. 기존 heritage는 "N단계".
const L2_STAGE_LABELS: Record<number, string> = {
  101: "L2 초급 1",
  102: "L2 초급 2",
};

/** 단계 표시 이름 — heritage는 "3단계", L2 온램프는 "L2 초급 1" */
export function stageLabel(stage: number): string {
  return L2_STAGE_LABELS[stage] ?? `${stage}단계`;
}

/** 유효한 단계 번호인지 (heritage 1~7 + L2 온램프 101~102) */
export function isValidStage(stage: number): boolean {
  return (Number.isInteger(stage) && stage >= 1 && stage <= 7) || stage === 101 || stage === 102;
}

export function getLessonConfig(stage: number, lessonNum: number): LessonConfig | null {
  return allLessons.find(
    (l) => l.stage === stage && l.lesson_num === lessonNum
  ) ?? null;
}

// 단계별 총 차시 수 — 대시보드 진도 계산에 사용
export const STAGE_LESSON_COUNTS: Record<number, number> = allLessons.reduce(
  (acc, l) => {
    acc[l.stage] = (acc[l.stage] ?? 0) + 1;
    return acc;
  },
  {} as Record<number, number>
);
