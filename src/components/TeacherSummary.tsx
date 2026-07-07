import { parseFeedback } from "@/lib/diagnosis/report";
import type { DashLabels } from "@/lib/dashboard-labels";
import type {
  DiagnosisResult,
  LessonRecord,
  Profile,
} from "@/lib/supabase/types";

function latestLevel(diagnoses: DiagnosisResult[], kind: "reading" | "writing") {
  const d = diagnoses.find((x) => x.kind === kind); // 이미 최신순 정렬
  return d ? d.level : null;
}

function passedCount(lessons: LessonRecord[]) {
  const passed = new Set<string>();
  for (const l of lessons) {
    if (parseFeedback(l.feedback).pass === true) passed.add(`${l.stage}-${l.lesson}`);
  }
  return passed.size;
}

function lastActive(diagnoses: DiagnosisResult[], lessons: LessonRecord[]) {
  const dates = [
    ...diagnoses.map((d) => d.created_at),
    ...lessons.map((l) => l.created_at),
  ];
  if (dates.length === 0) return null;
  return dates.reduce((a, b) => (a > b ? a : b));
}

/** 교사용 — 전체 학생을 한눈에 보는 요약 테이블 */
export default function TeacherSummary({
  students,
  diagnoses,
  lessons,
  lang,
  t,
}: {
  students: Profile[];
  diagnoses: DiagnosisResult[];
  lessons: LessonRecord[];
  lang: "ko" | "en";
  t: DashLabels;
}) {
  const fmt = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
          month: "short",
          day: "numeric",
        })
      : t.notStarted;

  return (
    <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-bold text-zinc-800">{t.summary}</h2>
        <span className="text-sm text-zinc-400 tabular-nums">
          {students.length}
          {t.students}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-400">
              <th className="py-2 pr-3 font-medium">{t.studentName}</th>
              <th className="py-2 px-3 text-center font-medium">
                {t.readingShort}
              </th>
              <th className="py-2 px-3 text-center font-medium">
                {t.writingShort}
              </th>
              <th className="py-2 px-3 text-center font-medium">
                {t.progressCol}
              </th>
              <th className="py-2 pl-3 text-right font-medium">{t.lastActive}</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const myDiag = diagnoses.filter((d) => d.student_id === s.id);
              const myLessons = lessons.filter((l) => l.student_id === s.id);
              const r = latestLevel(myDiag, "reading");
              const w = latestLevel(myDiag, "writing");
              const passed = passedCount(myLessons);
              return (
                <tr
                  key={s.id}
                  className="border-b border-zinc-100 last:border-0 hover:bg-amber-50/40"
                >
                  <td className="py-2.5 pr-3">
                    <a
                      href={`#student-${s.id}`}
                      className="font-medium text-zinc-700 hover:text-emerald-700 hover:underline"
                    >
                      {s.display_name ?? s.id.slice(0, 8)}
                    </a>
                    {s.track === "l2" && (
                      <span className="ml-1.5 rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-teal-700 align-middle">
                        L2
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center tabular-nums">
                    {r !== null ? (
                      <span className="font-semibold text-sky-700">{r}</span>
                    ) : (
                      <span className="text-zinc-300">{t.notStarted}</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center tabular-nums">
                    {w !== null ? (
                      <span className="font-semibold text-emerald-700">{w}</span>
                    ) : (
                      <span className="text-zinc-300">{t.notStarted}</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center tabular-nums text-zinc-600">
                    {passed > 0 ? (
                      <>
                        {passed} {t.passed}
                      </>
                    ) : (
                      <span className="text-zinc-300">{t.notStarted}</span>
                    )}
                  </td>
                  <td className="py-2.5 pl-3 text-right text-xs text-zinc-500">
                    {fmt(lastActive(myDiag, myLessons))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
