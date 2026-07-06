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
import type { LessonConfig } from "@/prompts/types";

const STAGE_LESSONS: Record<number, LessonConfig[]> = {
  1: stage1Lessons,
  2: stage2Lessons,
  3: stage3Lessons,
  4: stage4Lessons,
  5: stage5Lessons,
  6: stage6Lessons,
  7: stage7Lessons,
};

// 진단은 학생을 1~7단계로 배정한다. 모든 단계에 수업이 준비돼 있지만,
// 혹시 특정 단계 목록이 비어도 404 대신 "준비 중" 안내로 흐름을 잇는다(안전망).
const MAX_STAGE = 7;

export default async function StagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage: stageStr } = await params;
  const stage = Number(stageStr);

  // 1~7 정수가 아닌 진짜 잘못된 주소만 404 처리
  if (!Number.isInteger(stage) || stage < 1 || stage > MAX_STAGE) notFound();

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
          <p className="mb-1 text-sm font-semibold text-amber-700">{stage}단계</p>
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
