import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";

const STAGES = [
  { stage: 1, title: "1단계 — 문장 쓰기", lessons: 12, color: "bg-sky-100 border-sky-300" },
  { stage: 2, title: "2단계 — 단락 쓰기", lessons: 12, color: "bg-emerald-100 border-emerald-300" },
];

export default async function HomePage() {
  let loggedIn = false;
  if (supabaseConfig().configured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    loggedIn = !!user;
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <nav className="mb-12 flex items-center justify-between">
        <div>
          <p className="font-bold text-emerald-700">생각하는 글밭</p>
          <p className="text-xs text-zinc-400">Thinking Field</p>
        </div>
        {loggedIn ? (
          <Link
            href="/dashboard"
            className="rounded-lg border-2 border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            My Dashboard
          </Link>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Log in
          </Link>
        )}
      </nav>

      <h1 className="mb-2 text-3xl font-bold text-zinc-800">글쓰기 커리큘럼</h1>
      <p className="mb-10 text-zinc-500">
        단계를 골라 시작해보세요. <span className="text-zinc-400">Pick a stage to begin.</span>
      </p>
      <div className="flex flex-col gap-4">
        {STAGES.map(({ stage, title, lessons, color }) => (
          <Link
            key={stage}
            href={`/stage/${stage}`}
            className={`flex items-center justify-between rounded-2xl border-2 px-6 py-5 transition-shadow hover:shadow-md ${color}`}
          >
            <div>
              <p className="text-lg font-semibold text-zinc-800">{title}</p>
              <p className="text-sm text-zinc-500">{lessons}차시</p>
            </div>
            <span className="text-2xl">→</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
