"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import {
  Answered,
  Band,
  Bank,
  buildPhase1,
  buildPhase2,
  buildWarmup,
  decideBand,
  deviationNotice,
  DOMAINS,
  isCorrect,
  Item,
  judgeDomainLevel,
  Kind,
  overallLevel,
} from "@/lib/diagnosis/engine";

type Step = "loading" | "intro" | "quiz" | "saving" | "result";

/** 문항 텍스트의 _밑줄_ 마커(_, __, ___)를 실제 밑줄로 렌더링 */
function renderMarked(text: string) {
  return text.split(/(_{1,3}[^_\n]+_{1,3})/g).map((part, i) => {
    const m = part.match(/^_{1,3}([^_\n]+)_{1,3}$/);
    return m ? (
      <u key={i} className="underline decoration-emerald-600 decoration-2 underline-offset-4">
        {m[1]}
      </u>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

interface ResultData {
  domainLevels: Record<string, number>;
  avg: number;
  level: number;
  borderline: boolean;
  deviation: ReturnType<typeof deviationNotice>;
  correct: number;
  wrong: number;
}

export default function DiagnosisSession({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind: kindParam } = use(params);
  const kind: Kind = kindParam === "writing" ? "writing" : "reading";
  const kindLabel = kind === "reading" ? "읽기" : "글쓰기";

  const [bank, setBank] = useState<Bank | null>(null);
  const [step, setStep] = useState<Step>("loading");
  const [queue, setQueue] = useState<Item[]>([]);
  const [phase, setPhase] = useState<"warmup" | "p1" | "p2">("warmup");
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<Answered[]>([]);
  const [choice, setChoice] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>([]); // 순서 배열형 응답
  const [result, setResult] = useState<ResultData | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "ok" | "fail">("idle");
  const [used] = useState(() => new Set<string>());
  const [usedPassages] = useState(() => new Set<string>());

  useEffect(() => {
    (kind === "reading"
      ? import("@/data/diagnosis/reading.json")
      : import("@/data/diagnosis/writing.json")
    ).then((m) => {
      setBank(m.default as unknown as Bank);
      setStep("intro");
    });
  }, [kind]);

  const passageMap = useMemo(() => {
    const m = new Map<string, string>();
    bank?.passages.forEach((p) => m.set(p.passage_id, p.text));
    return m;
  }, [bank]);

  function start() {
    if (!bank) return;
    const warmup = buildWarmup(bank, used);
    const p1 = buildPhase1(bank, kind, used);
    p1.forEach((i) => i.passage_id && usedPassages.add(i.passage_id));
    setQueue([...warmup, ...p1]);
    setPhase(warmup.length > 0 ? "warmup" : "p1");
    setIndex(0);
    setStep("quiz");
  }

  const current = queue[index];
  const warmupCount = queue.filter((q, i) => i < index && phaseOf(i) === "warmup").length;

  function phaseOf(i: number): "warmup" | "p1" | "p2" {
    // 큐 구성: 워밍업 2 → 1차 15 → 2차 15
    if (i < 2) return "warmup";
    if (i < 17) return "p1";
    return "p2";
  }

  function submitAnswer() {
    if (!bank || !current) return;
    const response = Array.isArray(current.answer) ? order : choice;
    if (response === null || (Array.isArray(response) && response.length !== current.choices.length)) return;

    const currentPhase = phaseOf(index);
    const record: Answered = {
      item: current,
      correct: isCorrect(current, response as number | number[]),
      phase: currentPhase,
    };
    const nextAnswered = [...answered, record];
    setAnswered(nextAnswered);
    setChoice(null);
    setOrder([]);

    const isLastOfP1 = index === 16; // 워밍업 2 + 1차 15
    const isLast = index === queue.length - 1;

    if (isLastOfP1 && phaseOf(index) === "p1") {
      // 영역별 후보 대역 결정 → 2차 문항 조립
      const bands: Record<string, Band> = {};
      for (const d of DOMAINS[kind]) {
        const anchors = nextAnswered.filter(
          (a) => a.phase === "p1" && a.item.domain_code === d.code
        );
        const at = (lv: number) =>
          anchors.find((a) => a.item.level === lv)?.correct ?? false;
        bands[d.code] = decideBand(at(2), at(4), at(6));
      }
      const p2 = buildPhase2(bank, kind, bands, used, usedPassages);
      setQueue((q) => [...q, ...p2]);
      setIndex(index + 1);
      setPhase("p2");
      return;
    }

    if (isLast && phaseOf(index) === "p2") {
      finish(nextAnswered);
      return;
    }

    setIndex(index + 1);
    if (phaseOf(index + 1) !== currentPhase) setPhase(phaseOf(index + 1));
  }

  async function finish(all: Answered[]) {
    const domainLevels: Record<string, number> = {};
    for (const d of DOMAINS[kind]) {
      domainLevels[d.code] = judgeDomainLevel(all, d.code);
    }
    const overall = overallLevel(domainLevels, kind);
    const scored = all.filter((a) => a.phase !== "warmup");
    const res: ResultData = {
      domainLevels,
      avg: overall.avg,
      level: overall.level,
      borderline: overall.borderline,
      deviation: deviationNotice(domainLevels, kind),
      correct: scored.filter((a) => a.correct).length,
      wrong: scored.filter((a) => !a.correct).length,
    };
    setResult(res);
    setStep("saving");

    try {
      const r = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          level: res.level,
          correct_count: res.correct,
          wrong_count: res.wrong,
          detail: {
            domain_levels: domainLevels,
            weighted_avg: res.avg,
            borderline: res.borderline,
            items: scored.map((a) => ({
              item_id: a.item.item_id,
              level: a.item.level,
              domain: a.item.domain_code,
              correct: a.correct,
              phase: a.phase,
            })),
          },
        }),
      });
      setSaveState(r.ok ? "ok" : "fail");
    } catch {
      setSaveState("fail");
    }
    setStep("result");
  }

  // ───────────────────────── 화면 ─────────────────────────

  if (step === "loading") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center text-zinc-400">
        문항을 준비하고 있어요...
      </main>
    );
  }

  if (step === "intro") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border-2 border-amber-200 bg-white p-8 text-center">
          <Image
            src="/characters/byeolsaem.png"
            alt="별쌤"
            width={88}
            height={88}
            className="mx-auto mb-4 rounded-full shadow-md"
          />
          <h1 className="mb-2 text-2xl font-bold text-zinc-800">
            {kindLabel} 진단평가
          </h1>
          <p className="mb-6 leading-relaxed text-zinc-500">
            안녕! 나는 진단을 설계한 별쌤이야. 🦊
            <br />
            연습 2문항 + 진단 30문항이 나오고, 약 25분 정도 걸려.
            <br />
            모르는 문제는 골똘히 고민하지 말고 가장 가깝다고 생각하는 답을 골라줘.
            <br />
            <span className="text-zinc-400">
              점수를 매기는 시험이 아니라, 너에게 딱 맞는 시작점을 찾는 거야.
            </span>
          </p>
          <button
            onClick={start}
            className="rounded-xl bg-emerald-600 px-8 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            시작하기
          </button>
        </div>
      </main>
    );
  }

  if (step === "saving") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center text-zinc-400">
        결과를 정리하고 있어요...
      </main>
    );
  }

  if (step === "result" && result) {
    const domains = DOMAINS[kind];
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border-2 border-amber-200 bg-white p-8">
          <div className="mb-6 text-center">
            <Image
              src="/characters/byeolsaem.png"
              alt="별쌤"
              width={72}
              height={72}
              className="mx-auto mb-3 rounded-full shadow-md"
            />
            <h1 className="text-xl font-bold text-zinc-800">
              {kindLabel} 진단 결과
            </h1>
            <p className="mt-3 text-3xl font-bold text-emerald-700">
              종합 {result.level}단계
              {result.borderline && (
                <span className="ml-1 text-base font-medium text-amber-600">
                  (경계선 — {Math.max(1, result.level - (result.avg < result.level ? 1 : 0))}~
                  {Math.min(7, result.level + (result.avg >= result.level ? 1 : 0))}단계 사이)
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              정답 {result.correct} / {result.correct + result.wrong}
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-2">
            {domains.map((d) => {
              const lv = result.domainLevels[d.code];
              return (
                <div key={d.code} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-sm text-zinc-600">
                    {d.name}
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-3 rounded-full bg-emerald-500"
                      style={{ width: `${(lv / 7) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 shrink-0 text-right text-sm font-semibold text-zinc-700">
                    {lv}단계
                  </span>
                </div>
              );
            })}
          </div>

          {result.deviation && (
            <p className="mb-6 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
              영역 간 편차가 커요. <strong>{result.deviation.strong.name}</strong>
              은(는) {result.deviation.strong.level}단계로 강점이고,{" "}
              <strong>{result.deviation.weak.name}</strong>은(는){" "}
              {result.deviation.weak.level}단계라 집중 보완이 필요해요.
            </p>
          )}

          <div className="flex flex-col items-center gap-3">
            {kind === "writing" && (
              <Link
                href={`/stage/${Math.min(result.level, 7)}`}
                className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                내 수준에 맞는 글쓰기 수업 시작하기 ({result.level}단계) →
              </Link>
            )}
            <Link
              href="/dashboard"
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              대시보드에서 결과 보기 →
            </Link>
            {saveState === "fail" && (
              <p className="text-xs text-red-500">
                결과 저장에 실패했어요. 화면을 캡처해서 선생님께 보여 주세요.
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ─────────────── 문항 풀이 화면 ───────────────
  if (!current) return null;
  const passage = current.passage_id ? passageMap.get(current.passage_id) : null;
  const isOrdering = Array.isArray(current.answer);
  const total = phase === "p2" || queue.length > 17 ? 32 : 17;
  const isWarm = phaseOf(index) === "warmup";

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between text-sm text-zinc-400">
        <span>
          {isWarm
            ? `연습 ${index + 1}/2 (점수 미반영)`
            : `${kindLabel} 진단 ${index - 1}/${total - 2}`}
        </span>
        <span>{current.domain}</span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-2 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {passage && (
        <div className="mb-5 max-h-72 overflow-y-auto whitespace-pre-line rounded-xl border border-zinc-200 bg-white p-5 text-[15px] leading-relaxed text-zinc-700">
          {renderMarked(passage)}
        </div>
      )}

      <p className="mb-5 whitespace-pre-line text-lg font-semibold leading-relaxed text-zinc-800">
        {renderMarked(current.question_text)}
      </p>

      {isOrdering && (
        <p className="mb-3 text-sm text-emerald-700">
          순서대로 보기를 눌러 주세요. (다시 누르면 선택이 풀려요)
        </p>
      )}

      <div className="mb-8 flex flex-col gap-3">
        {current.choices.map((c, i) => {
          const selected = isOrdering ? order.includes(i) : choice === i;
          const orderNum = isOrdering ? order.indexOf(i) + 1 : 0;
          return (
            <button
              key={i}
              onClick={() => {
                if (isOrdering) {
                  setOrder((o) =>
                    o.includes(i) ? o.filter((x) => x !== i) : [...o, i]
                  );
                } else {
                  setChoice(i);
                }
              }}
              className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left text-[15px] leading-relaxed transition-colors ${
                selected
                  ? "border-emerald-500 bg-emerald-50 text-zinc-800"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300"
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  selected
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {isOrdering ? (selected ? orderNum : "·") : ["①", "②", "③", "④"][i] ?? i + 1}
              </span>
              <span>{renderMarked(c)}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={submitAnswer}
        disabled={isOrdering ? order.length !== current.choices.length : choice === null}
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {index === queue.length - 1 && phaseOf(index) === "p2" ? "제출하고 결과 보기" : "다음 →"}
      </button>
    </main>
  );
}
