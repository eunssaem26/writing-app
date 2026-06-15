"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useMemo, useRef, useState } from "react";
import {
  Answered,
  Band,
  Bank,
  buildAnchorSet,
  buildPhase2,
  buildWarmup,
  decideBand,
  deviationNotice,
  DOMAINS,
  groupByPassage,
  isCorrect,
  Item,
  judgeDomainLevel,
  Kind,
  overallLevel,
} from "@/lib/diagnosis/engine";
import { generateGrowthGuidance } from "@/lib/diagnosis/growth-path";

type Step = "loading" | "intro" | "quiz" | "saving" | "result";
type Phase = "warmup" | "p1" | "p2";
type Stage = "base" | "a6" | "p2"; // base = 워밍업+2단계+4단계 앵커

interface QueueEntry {
  item: Item;
  phase: Phase;
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
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<Answered[]>([]);
  const [choice, setChoice] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [result, setResult] = useState<ResultData | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "ok" | "fail">("idle");

  const stage = useRef<Stage>("base");
  const a6ByDomain = useRef<Record<string, Item>>({});
  const used = useRef(new Set<string>());
  const usedPassages = useRef(new Set<string>());

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
    const warmup = buildWarmup(bank, used.current);
    const anchors = buildAnchorSet(bank, kind, used.current);
    a6ByDomain.current = anchors.a6ByDomain;
    const p1Base = [...groupByPassage(anchors.a2), ...groupByPassage(anchors.a4)];
    p1Base.forEach((i) => i.passage_id && usedPassages.current.add(i.passage_id));
    setQueue([
      ...warmup.map((item) => ({ item, phase: "warmup" as Phase })),
      ...p1Base.map((item) => ({ item, phase: "p1" as Phase })),
    ]);
    stage.current = "base";
    setIndex(0);
    setStep("quiz");
  }

  const current = queue[index];

  /** 현재 큐 끝에 도달했을 때 다음 구간을 조립한다 */
  function extendOrFinish(all: Answered[]) {
    if (!bank) return;

    if (stage.current === "base") {
      // 사다리식: 4단계 앵커를 맞힌 영역에만 6단계 앵커 제시
      const qualified = DOMAINS[kind]
        .filter((d) =>
          all.some(
            (a) =>
              a.phase === "p1" &&
              a.item.domain_code === d.code &&
              a.item.level === 4 &&
              a.correct
          )
        )
        .map((d) => a6ByDomain.current[d.code])
        .filter(Boolean);

      if (qualified.length > 0) {
        const grouped = groupByPassage(qualified);
        grouped.forEach((i) => i.passage_id && usedPassages.current.add(i.passage_id));
        stage.current = "a6";
        setQueue((q) => [...q, ...grouped.map((item) => ({ item, phase: "p1" as Phase }))]);
        setIndex((i) => i + 1);
        return;
      }
      // 6단계 진출 영역이 없으면 곧장 2차로
    }

    if (stage.current === "base" || stage.current === "a6") {
      const bands: Record<string, Band> = {};
      for (const d of DOMAINS[kind]) {
        const anchors = all.filter(
          (a) => a.phase === "p1" && a.item.domain_code === d.code
        );
        const at = (lv: number) =>
          anchors.find((a) => a.item.level === lv)?.correct ?? false; // 미제시 6단계 = 오답 처리
        bands[d.code] = decideBand(at(2), at(4), at(6));
      }
      const p2 = groupByPassage(
        buildPhase2(bank, kind, bands, used.current, usedPassages.current)
      );
      stage.current = "p2";
      setQueue((q) => [...q, ...p2.map((item) => ({ item, phase: "p2" as Phase }))]);
      setIndex((i) => i + 1);
      return;
    }

    finish(all);
  }

  function submitAnswer(idk = false) {
    if (!bank || !current) return;
    const response = Array.isArray(current.item.answer) ? order : choice;
    if (!idk && (response === null || (Array.isArray(response) && response.length !== current.item.choices.length))) return;

    const record: Answered = {
      item: current.item,
      correct: idk ? false : isCorrect(current.item, response as number | number[]),
      phase: current.phase,
      ...(idk ? { idk: true } : {}),
    };
    const nextAnswered = [...answered, record];
    setAnswered(nextAnswered);
    setChoice(null);
    setOrder([]);

    if (index === queue.length - 1) {
      extendOrFinish(nextAnswered);
    } else {
      setIndex(index + 1);
    }
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
              ...(a.idk ? { idk: true } : {}),
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
            연습 2문항을 풀고 나면 진단이 시작돼. (약 20~30문항, 20분 안팎)
            <br />
            <strong className="text-zinc-600">
              일부러 위 학년 문제도 섞여 나와.
            </strong>{" "}
            어려운 게 나오는 건 네가 못해서가 아니라 원래 그런 거니까,
            <br />
            모르는 문제는 <strong className="text-emerald-700">&lsquo;잘 모르겠어요&rsquo;</strong> 버튼을 눌러도 괜찮아.
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
    const growth = generateGrowthGuidance(result.domainLevels, kind);
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
                  (경계선)
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

          {growth.focus.length > 0 && (
            <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">
              <p className="mb-3 text-sm font-bold text-emerald-800">
                🌱 다음 단계로 가려면?
              </p>
              <ul className="flex flex-col gap-3">
                {growth.focus.map((f) => (
                  <li
                    key={f.code}
                    className="text-sm leading-relaxed text-zinc-700"
                  >
                    <span className="font-semibold text-emerald-700">
                      {f.name} {f.current}단계 → {f.next}단계
                    </span>
                    <br />
                    {f.nextStep}
                  </li>
                ))}
              </ul>
              {growth.strength && (
                <p className="mt-4 border-t border-emerald-100 pt-3 text-xs leading-relaxed text-zinc-500">
                  지금은{" "}
                  <strong className="text-zinc-600">
                    {growth.strength.name}({growth.strength.level}단계)
                  </strong>
                  가 가장 튼튼해요. 강점을 살려 약한 영역을 끌어올려요.
                </p>
              )}
            </div>
          )}

          {growth.maxed && (
            <p className="mb-6 rounded-xl bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-800">
              모든 영역이 최고 단계예요. 정말 훌륭해요! 🎉
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
  const item = current.item;
  const passage = item.passage_id ? passageMap.get(item.passage_id) : null;
  const samePassageAsPrev =
    !!item.passage_id && queue[index - 1]?.item.passage_id === item.passage_id;
  const isOrdering = Array.isArray(item.answer);
  const isWarm = current.phase === "warmup";
  const scoredIndex = index - queue.filter((q, i) => i < index && q.phase === "warmup").length;
  const progress = (index + 1) / Math.max(queue.length, 27);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between text-sm text-zinc-400">
        <span>
          {isWarm
            ? `연습 ${index + 1} (점수 미반영)`
            : `${kindLabel} 진단 ${scoredIndex + 1}번째`}
        </span>
        <span>{item.domain}</span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-2 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>

      {samePassageAsPrev && (
        <p className="mb-2 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
          📖 방금 읽은 글에서 이어지는 문제예요
        </p>
      )}

      {passage && (
        <div className="mb-5 max-h-72 overflow-y-auto whitespace-pre-line rounded-xl border border-zinc-200 bg-white p-5 text-[15px] leading-relaxed text-zinc-700">
          {renderMarked(passage)}
        </div>
      )}

      <p className="mb-5 whitespace-pre-line text-lg font-semibold leading-relaxed text-zinc-800">
        {renderMarked(item.question_text)}
      </p>

      {isOrdering && (
        <p className="mb-3 text-sm text-emerald-700">
          순서대로 보기를 눌러 주세요. (다시 누르면 선택이 풀려요)
        </p>
      )}

      <div className="mb-6 flex flex-col gap-3">
        {item.choices.map((c, i) => {
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

      <div className="flex flex-col gap-2">
        <button
          onClick={() => submitAnswer(false)}
          disabled={isOrdering ? order.length !== item.choices.length : choice === null}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          다음 →
        </button>
        <button
          onClick={() => submitAnswer(true)}
          className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-600"
        >
          잘 모르겠어요, 다음 문제 주세요
        </button>
      </div>
    </main>
  );
}
