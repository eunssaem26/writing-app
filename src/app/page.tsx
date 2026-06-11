import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";

const YOUTUBE_URL =
  "https://www.youtube.com/@%EC%83%9D%EA%B0%81%ED%95%98%EB%8A%94%EA%B8%80%EB%B0%AD";

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

      <Link
        href="/diagnosis"
        className="mb-10 flex items-center gap-4 rounded-2xl border-2 border-amber-300 bg-amber-100 px-6 py-5 transition-shadow hover:shadow-md"
      >
        <Image
          src="/characters/byeolsaem.png"
          alt="별쌤"
          width={56}
          height={56}
          className="rounded-full shadow-sm"
        />
        <div className="flex-1">
          <p className="text-lg font-semibold text-zinc-800">
            진단평가 — 내 수준 알아보기
          </p>
          <p className="text-sm text-zinc-500">
            별쌤의 7단계 진단으로 딱 맞는 수업에서 시작해요
          </p>
        </div>
        <span className="text-2xl">→</span>
      </Link>

      <div className="mb-10 flex items-center gap-4">
        <Image
          src="/characters/geulsaem.png"
          alt="글쌤 — 글쓰기 코치"
          width={72}
          height={72}
          className="rounded-full shadow-md"
          priority
        />
        <div>
          <h1 className="text-3xl font-bold text-zinc-800">글쓰기 커리큘럼</h1>
          <p className="text-zinc-500">
            글쌤과 함께 단계를 골라 시작해보세요.{" "}
            <span className="text-zinc-400">Pick a stage to begin.</span>
          </p>
        </div>
      </div>
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

      <footer className="mt-16 flex flex-col items-center gap-2 text-sm text-zinc-400">
        <div className="flex gap-2">
          {["byeolsaem", "chaeksaem", "geulsaem", "hogi", "kkansaem", "philo"].map(
            (c) => (
              <Image
                key={c}
                src={`/characters/${c}.png`}
                alt={c}
                width={32}
                height={32}
                className="rounded-full"
              />
            )
          )}
        </div>
        <a
          href={YOUTUBE_URL}
          target="_blank"
          rel="noopener"
          className="font-semibold text-red-600 hover:underline"
        >
          ▶ YouTube 생각하는 글밭 — 글밭 식구들 만나러 가기
        </a>
      </footer>
    </main>
  );
}
