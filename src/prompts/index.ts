import type { LessonConfig } from "./types";
import { stage1Lessons } from "./stage1";
import { stage2Lessons } from "./stage2";
import { stage3Lessons } from "./stage3";
import { stage4Lessons } from "./stage4";
import { stage5Lessons } from "./stage5";
import { stage6Lessons } from "./stage6";
import { stage7Lessons } from "./stage7";

const allLessons: LessonConfig[] = [
  ...stage1Lessons,
  ...stage2Lessons,
  ...stage3Lessons,
  ...stage4Lessons,
  ...stage5Lessons,
  ...stage6Lessons,
  ...stage7Lessons,
];

export function getLessonConfig(stage: number, lessonNum: number): LessonConfig | null {
  return allLessons.find(
    (l) => l.stage === stage && l.lesson_num === lessonNum
  ) ?? null;
}
