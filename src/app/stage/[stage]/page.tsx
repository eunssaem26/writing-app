import Link from "next/link";
import { notFound } from "next/navigation";
import { stage1Lessons } from "@/prompts/stage1";
import type { LessonConfig } from "@/prompts/types";

const STAGE_LESSONS: Record<number, LessonConfig[]> = {
  1: stage1Lessons,
};

export default async function StagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage: stageStr } = await params;
  const stage = Number(stageStr);
  const lessons = STAGE_LESSONS[stage];
  if (!lessons) notFound();

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <Link href="/" className="mb-6 inline-block text-sm text-zinc-400 hover:text-zinc-600">
        ← 처음으로
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-zinc-800">{stage}단계 차시 목록</h1>
      <div className="flex flex-col gap-3">
        {lessons.map((lesson) => (
          <Link
            key={lesson.lesson_id}
            href={`/stage/${stage}/lesson/${lesson.lesson_num}/write`}
            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 transition-shadow hover:shadow-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
              {lesson.lesson_num}
            </span>
            <div>
              <p className="font-medium text-zinc-800">{lesson.lesson_title}</p>
              <p className="text-xs text-zinc-400">{lesson.assignment.slice(0, 40)}…</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
