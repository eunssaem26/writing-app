import type { LessonConfig } from "./types";
import { stage1Lessons } from "./stage1";
import { stage2Lessons } from "./stage2";

const allLessons: LessonConfig[] = [...stage1Lessons, ...stage2Lessons];

export function getLessonConfig(stage: number, lessonNum: number): LessonConfig | null {
  return allLessons.find(
    (l) => l.stage === stage && l.lesson_num === lessonNum
  ) ?? null;
}
