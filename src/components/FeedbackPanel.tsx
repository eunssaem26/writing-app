"use client";

import Image from "next/image";
import type { FeedbackResult } from "@/lib/claude/types";

interface Props {
  feedback: FeedbackResult;
  studentText: string;
}

export default function FeedbackPanel({ feedback, studentText }: Props) {
  const sentences = studentText.split("\n");

  return (
    <div className="flex flex-col gap-5">
      {/* 합격/불합격 배너 */}
      <div
        className={`flex items-center gap-3 rounded-2xl px-6 py-4 ${
          feedback.pass
            ? "bg-emerald-50 border border-emerald-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        <Image
          src="/characters/geulsaem.png"
          alt="글쌤"
          width={48}
          height={48}
          className="rounded-full shadow-sm"
        />
        <span className="text-3xl">{feedback.pass ? "🎉" : "💪"}</span>
        <div>
          <p className="text-xs font-medium text-zinc-400">글쌤의 피드백</p>
          <p
            className={`text-lg font-bold ${
              feedback.pass ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {feedback.result_label}
          </p>
          {feedback.teacher_handoff_needed && (
            <p className="mt-0.5 text-xs text-orange-600">
              선생님 확인이 필요합니다: {feedback.teacher_handoff_reason}
            </p>
          )}
        </div>
      </div>

      {/* 루브릭 점수 (차시12) */}
      {feedback.score && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-zinc-600">총점</p>
          <p className="text-4xl font-bold text-zinc-800">
            {feedback.score.total}
            <span className="ml-1 text-lg font-normal text-zinc-400">/ 20</span>
          </p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {Object.entries(feedback.score.breakdown).map(([key, val]) => (
              <div key={key} className="flex flex-col items-center gap-1">
                <div className="h-1 w-full rounded-full bg-zinc-100">
                  <div
                    className="h-1 rounded-full bg-amber-400"
                    style={{ width: `${((val ?? 0) / 4) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400">
                  {SCORE_LABEL[key] ?? key}
                </span>
                <span className="text-sm font-semibold text-zinc-700">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 칭찬 */}
      {feedback.strengths.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-zinc-500">잘한 점</h2>
          <div className="flex flex-col gap-2">
            {feedback.strengths.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3"
              >
                <p className="text-xs text-zinc-400">
                  {s.sentence_index}번 문장
                </p>
                <p className="mt-0.5 text-sm font-medium text-zinc-700">
                  &ldquo;{sentences[s.sentence_index - 1] ?? s.text}&rdquo;
                </p>
                <p className="mt-1 text-xs text-emerald-700">{s.reason}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 개선 사항 */}
      {feedback.improvements.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-zinc-500">고쳐볼 점</h2>
          <div className="flex flex-col gap-3">
            {feedback.improvements.map((imp, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200 bg-white p-4"
              >
                <span className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                  {imp.criterion_id} · {imp.sentence_index}번 문장
                </span>
                <p className="mt-2 text-sm text-zinc-500 line-through">
                  {imp.original}
                </p>
                <p className="mt-1 text-xs text-red-500">{imp.problem}</p>
                <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-zinc-800">
                  → {imp.suggestion}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 한 가지 팁 */}
      {feedback.one_tip && (
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-xs font-semibold text-amber-700">오늘의 팁</p>
          <p className="mt-1 text-sm text-zinc-700">{feedback.one_tip}</p>
        </div>
      )}
    </div>
  );
}

const SCORE_LABEL: Record<string, string> = {
  fluency: "유창성",
  structure: "구조",
  content: "내용",
  expression: "어휘",
  conventions: "맞춤법",
  topic_sentence: "중심문장",
  supporting: "뒷받침",
  closing: "마무리",
  coherence: "연결성",
  connectives: "접속어",
};
