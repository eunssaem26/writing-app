import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";
import type {
  DiagnosisResult,
  LessonRecord,
  Profile,
} from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const LABELS = {
  ko: {
    title: "내 학습 기록",
    teacherTitle: "전체 학생 현황",
    parentTitle: "자녀 학습 기록",
    diagnosis: "진단평가 결과",
    lessons: "수업 기록",
    noDiagnosis: "아직 진단평가 기록이 없어요.",
    noLessons: "아직 수업 기록이 없어요.",
    noStudents: "연결된 학생이 없어요. 선생님께 문의해 주세요.",
    level: "단계",
    reading: "읽기",
    writing: "글쓰기",
    correct: "정답",
    continueLessons: "수업 계속하기 →",
    signOut: "로그아웃",
  },
  en: {
    title: "My Learning Record",
    teacherTitle: "All Students",
    parentTitle: "My Child's Learning Record",
    diagnosis: "Placement Test Results",
    lessons: "Lesson History",
    noDiagnosis: "No placement test results yet.",
    noLessons: "No lesson records yet.",
    noStudents: "No linked students yet. Please contact your teacher.",
    level: "Level",
    reading: "Reading",
    writing: "Writing",
    correct: "correct",
    continueLessons: "Continue lessons →",
    signOut: "Sign out",
  },
} as const;

function formatDate(iso: string, lang: "ko" | "en") {
  return new Date(iso).toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function DashboardPage() {
  const { configured } = supabaseConfig();
  if (!configured) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <h1 className="mb-4 text-2xl font-bold text-zinc-800">
          대시보드 준비 중 / Dashboard coming soon
        </h1>
        <p className="text-zinc-500">
          로그인 기능이 연결되면 학생별 진단 결과와 수업 기록이 여기에 정리돼요.
        </p>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  const lang = profile?.language ?? "ko";
  const t = LABELS[lang];
  const role = profile?.role ?? "student";

  // 역할에 따라 볼 수 있는 학생 목록을 구성 (RLS가 서버에서 한 번 더 강제함)
  let students: Profile[] = [];
  if (role === "teacher") {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "student")
      .order("created_at");
    students = (data as Profile[]) ?? [];
  } else if (role === "parent") {
    const { data: links } = await supabase
      .from("parent_links")
      .select("student_id")
      .eq("parent_id", user.id);
    const ids = (links ?? []).map((l) => l.student_id);
    if (ids.length > 0) {
      const { data } = await supabase.from("profiles").select("*").in("id", ids);
      students = (data as Profile[]) ?? [];
    }
  } else if (profile) {
    students = [profile];
  }

  const studentIds = students.map((s) => s.id);
  const [{ data: diagnoses }, { data: lessons }] = await Promise.all([
    studentIds.length > 0
      ? supabase
          .from("diagnosis_results")
          .select("*")
          .in("student_id", studentIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as DiagnosisResult[] }),
    studentIds.length > 0
      ? supabase
          .from("lesson_records")
          .select("*")
          .in("student_id", studentIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as LessonRecord[] }),
  ]);

  const title =
    role === "teacher"
      ? t.teacherTitle
      : role === "parent"
        ? t.parentTitle
        : t.title;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            생각하는 글밭 · Thinking Field
          </p>
          <h1 className="text-2xl font-bold text-zinc-800">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {t.continueLessons}
          </Link>
          <form action="/auth/signout" method="post">
            <button className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50">
              {t.signOut}
            </button>
          </form>
        </div>
      </div>

      {students.length === 0 && (
        <p className="rounded-xl bg-amber-100 p-4 text-amber-800">
          {t.noStudents}
        </p>
      )}

      <div className="flex flex-col gap-8">
        {students.map((student) => {
          const myDiagnoses = ((diagnoses as DiagnosisResult[]) ?? []).filter(
            (d) => d.student_id === student.id
          );
          const myLessons = ((lessons as LessonRecord[]) ?? []).filter(
            (l) => l.student_id === student.id
          );
          return (
            <section
              key={student.id}
              className="rounded-2xl border-2 border-amber-200 bg-white p-6"
            >
              {role !== "student" && (
                <h2 className="mb-4 text-lg font-bold text-zinc-800">
                  {student.display_name ?? student.id.slice(0, 8)}
                </h2>
              )}

              <h3 className="mb-2 font-semibold text-zinc-700">
                {t.diagnosis}
              </h3>
              {myDiagnoses.length === 0 ? (
                <p className="mb-5 text-sm text-zinc-400">{t.noDiagnosis}</p>
              ) : (
                <ul className="mb-5 flex flex-col gap-2">
                  {myDiagnoses.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center justify-between rounded-lg bg-sky-50 px-4 py-2 text-sm"
                    >
                      <span className="font-medium text-zinc-700">
                        {d.kind === "reading" ? t.reading : t.writing} ·{" "}
                        {t.level} {d.level}
                      </span>
                      <span className="text-zinc-500">
                        {d.correct_count}/{d.correct_count + d.wrong_count}{" "}
                        {t.correct} · {formatDate(d.created_at, lang)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <h3 className="mb-2 font-semibold text-zinc-700">{t.lessons}</h3>
              {myLessons.length === 0 ? (
                <p className="text-sm text-zinc-400">{t.noLessons}</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {myLessons.map((l) => (
                    <li
                      key={l.id}
                      className="rounded-lg bg-emerald-50 px-4 py-2 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-zinc-700">
                          Stage {l.stage} · Lesson {l.lesson}
                        </span>
                        <span className="text-zinc-500">
                          {formatDate(l.created_at, lang)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-zinc-500">
                        {l.student_text}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
