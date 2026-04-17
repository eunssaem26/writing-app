import Link from "next/link";

const STAGES = [
  { stage: 1, title: "1단계 — 문장 쓰기", lessons: 12, color: "bg-sky-100 border-sky-300" },
  { stage: 2, title: "2단계 — 단락 쓰기", lessons: 12, color: "bg-emerald-100 border-emerald-300" },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold text-zinc-800">글쓰기 커리큘럼</h1>
      <p className="mb-10 text-zinc-500">단계를 골라 시작해보세요.</p>
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
