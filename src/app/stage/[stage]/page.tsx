import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { stage1Lessons } from "@/prompts/stage1";
import { stage2Lessons } from "@/prompts/stage2";
import { stage3Lessons } from "@/prompts/stage3";
import { stage4Lessons } from "@/prompts/stage4";
import { stage5Lessons } from "@/prompts/stage5";
import { stage6Lessons } from "@/prompts/stage6";
import { stage7Lessons } from "@/prompts/stage7";
import { l2Beginner1Lessons } from "@/prompts/l2-beginner1";
import { l2Beginner2Lessons } from "@/prompts/l2-beginner2";
import { isValidStage, stageLabel } from "@/prompts";
import type { LessonConfig } from "@/prompts/types";

const STAGE_LESSONS: Record<number, LessonConfig[]> = {
  1: stage1Lessons,
  2: stage2Lessons,
  3: stage3Lessons,
  4: stage4Lessons,
  5: stage5Lessons,
  6: stage6Lessons,
  7: stage7Lessons,
  101: l2Beginner1Lessons, // L2 초급 1 (영어권 온램프)
  102: l2Beginner2Lessons, // L2 초급 2
};

export default async function StagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage: stageStr } = await params;
  const stage = Number(stageStr);

  // heritage 1~7 + L2 온램프(101~102)가 아닌 진짜 잘못된 주소만 404
  if (!isValidStage(stage)) notFound();

  const lessons = STAGE_LESSONS[stage];

  // 유효한 단계지만 아직 수업이 없는 경우 — 친절한 "준비 중" 안내
  if (!lessons) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <Link href="/" className="mb-6 inline-block text-sm text-zinc-400 hover:text-zinc-600">
          ← 처음으로
        </Link>
        <div className="rounded-2xl border-2 border-amber-200 bg-white p-8 text-center shadow-sm">
          <Image
            src="/characters/hogi.png"
            alt="호기"
            width={80}
            height={80}
            className="mx-auto mb-4 rounded-full shadow-md"
          />
          <p className="mb-1 text-sm font-semibold text-amber-700">{stageLabel(stage)}</p>
          <h1 className="mb-3 text-2xl font-bold text-zinc-800">
            이 단계는 지금 준비하고 있어요
          </h1>
          <p className="mx-auto mb-7 max-w-sm text-sm leading-relaxed text-zinc-500">
            {stage}단계 수업을 정성껏 만드는 중이에요. 준비가 끝나면 가장 먼저 알려드릴게요.
            그동안 지금 열려 있는 단계부터 함께 시작해 볼까요? 🌱
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/stage/1"
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              1단계부터 시작하기
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border-2 border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              내 학습 현황 보기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <Link href="/" className="mb-6 inline-block text-sm text-zinc-400 hover:text-zinc-600">
        ← 처음으로
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-zinc-800">{stageLabel(stage)} 차시 목록</h1>
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

      {/* L2 온램프 진행 안내: 초급1 → 초급2 → 기존 진단 편입 */}
      {stage === 101 && (
        <Link
          href="/stage/102"
          className="mt-5 flex items-center justify-between rounded-xl border-2 border-teal-200 bg-teal-50 px-5 py-4 text-sm transition-shadow hover:shadow-sm"
        >
          <span className="font-medium text-teal-800">
            Finished 초급 1? Next → L2 초급 2 (past &amp; future tense)
          </span>
          <span className="text-lg text-teal-700">→</span>
        </Link>
      )}
      {stage === 102 && (
        <Link
          href="/diagnosis"
          className="mt-5 flex items-center justify-between rounded-xl border-2 border-amber-200 bg-amber-50 px-5 py-4 text-sm transition-shadow hover:shadow-sm"
        >
          <span className="font-medium text-amber-800">
            Finished 초급 2? Take the placement test to join the main course →
          </span>
          <span className="text-lg text-amber-700">→</span>
        </Link>
      )}
    </main>
  );
}
