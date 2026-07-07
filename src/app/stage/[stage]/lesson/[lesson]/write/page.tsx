"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getLessonConfig, stageLabel } from "@/prompts";
import type { FeedbackResult } from "@/lib/claude/types";
import FeedbackPanel from "@/components/FeedbackPanel";

export default function WritePage({
  params,
}: {
  params: Promise<{ stage: string; lesson: string }>;
}) {
  const { stage: stageStr, lesson: lessonStr } = use(params);
  const stage = Number(stageStr);
  const lessonNum = Number(lessonStr);
  const lesson = getLessonConfig(stage, lessonNum);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [englishFeedback, setEnglishFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [retrying, setRetrying] = useState(false);

  // ── 자동저장(로컬): 새로고침·와이파이 끊김에도 쓰던 글을 지키기 ──
  const draftKey = `byeolsaem:draft:${stageStr}:${lessonStr}`;
  const draftRestored = useRef(false);

  useEffect(() => {
    if (draftRestored.current) return;
    draftRestored.current = true;
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) setText(saved);
    } catch {
      /* 무시 */
    }
  }, [draftKey]);

  useEffect(() => {
    if (!draftRestored.current) return;
    try {
      if (text) localStorage.setItem(draftKey, text);
      else localStorage.removeItem(draftKey);
    } catch {
      /* 저장 실패(용량·프라이빗 모드)는 무시 */
    }
  }, [draftKey, text]);

  if (!lesson) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center text-zinc-500">
        차시를 찾을 수 없습니다.
      </main>
    );
  }

  const nextLesson = getLessonConfig(stage, lessonNum + 1);

  // 첨삭 1회 요청. 4xx(입력·인증)는 재시도 무의미하므로 fatal로 표시해 즉시 중단시킨다.
  async function requestFeedback() {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage, lesson_num: lessonNum, student_text: text }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      const e = new Error(
        data?.error ?? "문제가 생겼어요. 잠시 후 다시 시도해 주세요."
      );
      if (res.status >= 400 && res.status < 500) (e as Error & { fatal?: boolean }).fatal = true;
      throw e;
    }
    return (await res.json()) as { feedback: FeedbackResult; english: boolean };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setFeedback(null);
    setRetrying(false);

    // 최초 1회 + 일시적 실패(5xx: 과부하·형식 오류) 시 자동 재시도 1회.
    // 부하 테스트에서 ~5% JSON 파싱 실패가 재현돼, 학생이 손대지 않아도 자가 복구되게 함.
    const MAX_ATTEMPTS = 2;
    let lastErr: unknown = null;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const data = await requestFeedback();
        setFeedback(data.feedback);
        setEnglishFeedback(!!data.english);
        setAttempt((n) => n + 1);
        if (data.feedback.pass) {
          try {
            localStorage.removeItem(draftKey); // 통과 → 저장된 초안 정리
          } catch {
            /* 무시 */
          }
        }
        setLoading(false);
        setRetrying(false);
        return;
      } catch (err) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : String(err);
        const fatal = (err as { fatal?: boolean })?.fatal;
        const networkDown = /fetch|network|load failed/i.test(msg);
        // 입력·인증 오류거나, 네트워크 끊김(재요청 시 중복 첨삭 비용 우려)이거나,
        // 마지막 시도면 재시도하지 않는다.
        if (fatal || networkDown || attempt === MAX_ATTEMPTS) break;
        setRetrying(true);
        await new Promise((r) => setTimeout(r, 2500)); // 잠깐 쉬고 자동 재시도
      }
    }

    const msg = lastErr instanceof Error ? lastErr.message : String(lastErr);
    setError(
      /fetch|network|load failed/i.test(msg)
        ? "인터넷 연결이 불안정해요. 연결을 확인하고 다시 시도해 주세요."
        : msg
    );
    setLoading(false);
    setRetrying(false);
  }

  function handleRevise() {
    setFeedback(null);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      {/* 헤더 */}
      <Link
        href={`/stage/${stage}`}
        className="mb-4 inline-block text-sm text-zinc-400 hover:text-zinc-600"
      >
        ← {stageLabel(stage)} 목록
      </Link>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
          {stageLabel(stage)} · {lessonNum}차시
        </p>
        <h1 className="text-2xl font-bold text-zinc-800">{lesson.lesson_title}</h1>
        <p className="mt-1 text-sm text-zinc-500">{lesson.lesson_summary}</p>
      </div>

      {/* 과제 카드 */}
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <p className="text-xs font-semibold text-amber-700">과제</p>
        <p className="mt-1 text-sm text-zinc-700">{lesson.assignment}</p>
      </div>

      {/* 피드백이 없을 때 — 글쓰기 폼 */}
      {!feedback && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="여기에 글을 써보세요..."
            rows={10}
            className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-base text-zinc-800 placeholder-zinc-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="self-end rounded-full bg-amber-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (retrying ? "글쌤이 잠깐 멈칫했어요, 다시 시도 중..." : "평가 중...") : "제출하기"}
          </button>
        </form>
      )}

      {/* 피드백 패널 */}
      {feedback && (
        <div className="flex flex-col gap-6">
          <FeedbackPanel
            feedback={feedback}
            studentText={text}
            english={englishFeedback}
          />

          <div className="flex gap-3">
            {feedback.pass ? (
              <>
                <button
                  onClick={handleRevise}
                  className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100"
                >
                  다시 써보기
                </button>
                {nextLesson ? (
                  <Link
                    href={`/stage/${stage}/lesson/${lessonNum + 1}/write`}
                    className="rounded-full bg-emerald-500 px-8 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
                  >
                    다음 차시 →
                  </Link>
                ) : (
                  <Link
                    href={`/stage/${stage}`}
                    className="rounded-full bg-emerald-500 px-8 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
                  >
                    단계 완료! 목록으로
                  </Link>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleRevise}
                  className="rounded-full bg-amber-500 px-8 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
                >
                  다시 써볼게요 ({attempt}번 시도)
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
