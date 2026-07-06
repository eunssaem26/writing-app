import Image from "next/image";
import Link from "next/link";
import { DOMAINS, deviationNotice, type Kind } from "@/lib/diagnosis/engine";
import { generateGrowthGuidance } from "@/lib/diagnosis/growth-path";
import { parseDiagDetail, parseFeedback } from "@/lib/diagnosis/report";
import { STAGE_LESSON_COUNTS } from "@/prompts";
import type { DashLabels } from "@/lib/dashboard-labels";
import type {
  DiagnosisResult,
  LessonRecord,
  Profile,
} from "@/lib/supabase/types";

function formatDate(iso: string, lang: "ko" | "en") {
  return new Date(iso).toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** 영역별 단계 막대 하나 */
function DomainBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-sm text-zinc-600">{name}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-2.5 rounded-full bg-emerald-500"
          style={{ width: `${Math.min((level / 7) * 100, 100)}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-sm font-semibold text-zinc-700 tabular-nums">
        {level}
      </span>
    </div>
  );
}

/** 최신 진단 1건의 심화 리포트 (영역별 단계 + 강·약점 + 다음 단계) */
function DiagnosisCard({
  diag,
  lang,
  t,
}: {
  diag: DiagnosisResult;
  lang: "ko" | "en";
  t: DashLabels;
}) {
  const kind = diag.kind as Kind;
  const { domainLevels, borderline } = parseDiagDetail(diag.detail);
  const hasBreakdown = Object.keys(domainLevels).length > 0;
  const domains = DOMAINS[kind];
  const dev = hasBreakdown ? deviationNotice(domainLevels, kind) : null;
  const growth = hasBreakdown ? generateGrowthGuidance(domainLevels, kind) : null;
  const kindLabel = kind === "reading" ? t.reading : t.writing;

  return (
    <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-semibold text-zinc-800">{kindLabel}</span>
        <span className="text-sm text-zinc-500">
          {t.overall}{" "}
          <strong className="text-emerald-700">
            {diag.level}
            {t.level}
          </strong>
          {borderline && (
            <span className="ml-1 text-xs text-amber-600">({t.borderline})</span>
          )}
          {" · "}
          {diag.correct_count}/{diag.correct_count + diag.wrong_count} {t.correct}
        </span>
      </div>

      {hasBreakdown && (
        <>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
            {t.byDomain}
          </p>
          <div className="mb-3 flex flex-col gap-1.5">
            {domains.map((d) => (
              <DomainBar
                key={d.code}
                name={d.name}
                level={domainLevels[d.code] ?? 1}
              />
            ))}
          </div>
        </>
      )}

      {dev && (
        <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
          <strong>{dev.strong.name}</strong>({dev.strong.level}
          {t.level}) {t.strength} · <strong>{dev.weak.name}</strong>(
          {dev.weak.level}
          {t.level}) {t.needsWork}
        </p>
      )}

      {growth && growth.focus.length > 0 && (
        <div className="rounded-lg border border-emerald-100 bg-white/70 px-3 py-2">
          <p className="mb-1 text-xs font-bold text-emerald-800">
            🌱 {t.nextStep}
          </p>
          <ul className="flex flex-col gap-1">
            {growth.focus.map((f) => (
              <li key={f.code} className="text-xs leading-relaxed text-zinc-600">
                <span className="font-semibold text-emerald-700">
                  {f.name} {f.current}
                  {t.level} → {f.next}
                  {t.level}
                </span>{" "}
                {f.nextStep}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-2 text-right text-xs text-zinc-400">
        {formatDate(diag.created_at, lang)}
      </p>
    </div>
  );
}

export default function StudentReport({
  student,
  diagnoses,
  lessons,
  lang,
  t,
  showName,
}: {
  student: Profile;
  diagnoses: DiagnosisResult[];
  lessons: LessonRecord[];
  lang: "ko" | "en";
  t: DashLabels;
  showName: boolean;
}) {
  // 진단: 종류별 최신 1건은 심화 카드, 나머지는 간단 히스토리
  const latestReading = diagnoses.find((d) => d.kind === "reading");
  const latestWriting = diagnoses.find((d) => d.kind === "writing");
  const featured = [latestReading, latestWriting].filter(
    (d): d is DiagnosisResult => Boolean(d)
  );
  const featuredIds = new Set(featured.map((d) => d.id));
  const history = diagnoses.filter((d) => !featuredIds.has(d.id));

  // 진도: 단계별 통과 차시 수
  const passedByStage = new Map<number, Set<number>>();
  for (const l of lessons) {
    if (parseFeedback(l.feedback).pass === true) {
      if (!passedByStage.has(l.stage)) passedByStage.set(l.stage, new Set());
      passedByStage.get(l.stage)!.add(l.lesson);
    }
  }
  const touchedStages = [...new Set(lessons.map((l) => l.stage))].sort(
    (a, b) => a - b
  );

  const recentLessons = lessons.slice(0, 6);

  return (
    <section className="rounded-2xl border-2 border-amber-200 bg-white p-6">
      {showName && (
        <h2 className="mb-4 text-lg font-bold text-zinc-800">
          {student.display_name ?? student.id.slice(0, 8)}
        </h2>
      )}

      {/* 진단 리포트 */}
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-zinc-700">
        <Image
          src="/characters/byeolsaem.png"
          alt="별쌤"
          width={28}
          height={28}
          className="rounded-full"
        />
        {t.diagnosis}
      </h3>
      {featured.length === 0 ? (
        <p className="mb-5 text-sm text-zinc-400">{t.noDiagnosis}</p>
      ) : (
        <div className="mb-3 flex flex-col gap-3">
          {featured.map((d) => (
            <DiagnosisCard key={d.id} diag={d} lang={lang} t={t} />
          ))}
        </div>
      )}
      {history.length > 0 && (
        <details className="mb-5">
          <summary className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-600">
            {t.history} ({history.length})
          </summary>
          <ul className="mt-2 flex flex-col gap-1">
            {history.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500"
              >
                <span>
                  {d.kind === "reading" ? t.reading : t.writing} · {t.level}{" "}
                  {d.level}
                </span>
                <span>{formatDate(d.created_at, lang)}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* 수업 진도 */}
      {touchedStages.length > 0 && (
        <>
          <h3 className="mb-2 font-semibold text-zinc-700">{t.progress}</h3>
          <div className="mb-5 flex flex-col gap-2">
            {touchedStages.map((stage) => {
              const total = STAGE_LESSON_COUNTS[stage] ?? 0;
              const passed = passedByStage.get(stage)?.size ?? 0;
              const pct = total > 0 ? (passed / total) * 100 : 0;
              return (
                <div key={stage} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-sm text-zinc-600">
                    {stage}
                    {t.stage}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-2.5 rounded-full bg-emerald-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right text-xs font-medium text-zinc-500 tabular-nums">
                    {t.passedOf(passed, total)}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 최근 수업 */}
      <h3 className="mb-2 flex items-center gap-2 font-semibold text-zinc-700">
        <Image
          src="/characters/geulsaem.png"
          alt="글쌤"
          width={28}
          height={28}
          className="rounded-full"
        />
        {t.recentLessons}
      </h3>
      {recentLessons.length === 0 ? (
        <p className="text-sm text-zinc-400">{t.noLessons}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recentLessons.map((l) => {
            const fb = parseFeedback(l.feedback);
            return (
              <li key={l.id} className="rounded-lg bg-emerald-50 px-4 py-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-medium text-zinc-700">
                    {l.stage}
                    {t.stage} · {l.lesson}
                    {t.lesson}
                    {fb.pass === true && (
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                        {t.passed}
                      </span>
                    )}
                    {fb.pass === false && (
                      <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-800">
                        {t.retry}
                      </span>
                    )}
                    {fb.scoreTotal !== null && (
                      <span className="text-xs text-zinc-400">
                        {t.score} {fb.scoreTotal}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs text-zinc-500">
                    {formatDate(l.created_at, lang)}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-zinc-500">{l.student_text}</p>
              </li>
            );
          })}
        </ul>
      )}

      {showName || (
        <div className="mt-5">
          <Link
            href="/diagnosis"
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            {t.continueLessons}
          </Link>
        </div>
      )}
    </section>
  );
}
