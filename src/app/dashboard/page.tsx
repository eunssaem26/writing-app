import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";
import AddStudentForm from "@/components/AddStudentForm";
import StudentReport from "@/components/StudentReport";
import TeacherSummary from "@/components/TeacherSummary";
import { DASHBOARD_LABELS } from "@/lib/dashboard-labels";
import type {
  DiagnosisResult,
  LessonRecord,
  Profile,
} from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

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
  const t = DASHBOARD_LABELS[lang];
  const role = profile?.role ?? "student";

  // 역할에 따라 볼 수 있는 학생 목록 (RLS가 서버에서 한 번 더 강제)
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

  const allDiagnoses = (diagnoses as DiagnosisResult[]) ?? [];
  const allLessons = (lessons as LessonRecord[]) ?? [];

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

      {role === "teacher" && <AddStudentForm />}

      {students.length === 0 && (
        <p className="rounded-xl bg-amber-100 p-4 text-amber-800">
          {t.noStudents}
        </p>
      )}

      {/* 교사: 전체 학생 요약 테이블 (2명 이상일 때 의미가 큼) */}
      {role === "teacher" && students.length > 0 && (
        <TeacherSummary
          students={students}
          diagnoses={allDiagnoses}
          lessons={allLessons}
          lang={lang}
          t={t}
        />
      )}

      {/* 학생별 상세 리포트 */}
      <div className="flex flex-col gap-8">
        {students.map((student) => (
          <div
            key={student.id}
            id={`student-${student.id}`}
            className="scroll-mt-4"
          >
            <StudentReport
              student={student}
              diagnoses={allDiagnoses.filter((d) => d.student_id === student.id)}
              lessons={allLessons.filter((l) => l.student_id === student.id)}
              lang={lang}
              t={t}
              showName={role !== "student"}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
