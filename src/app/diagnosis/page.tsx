import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "진단평가 — 생각하는 글밭",
};

const KINDS = [
  {
    kind: "reading",
    title: "읽기 진단",
    desc: "어휘력 · 사실적 이해 · 추론 · 비판 · 구조 파악",
    color: "border-sky-300 bg-sky-50 hover:bg-sky-100",
    character: "/characters/chaeksaem.png",
    characterName: "책쌤",
  },
  {
    kind: "writing",
    title: "글쓰기 진단",
    desc: "내용 생성 · 글 조직 · 표현 · 어법 · 고쳐쓰기",
    color: "border-emerald-300 bg-emerald-50 hover:bg-emerald-100",
    character: "/characters/geulsaem.png",
    characterName: "글쌤",
  },
];

export default function DiagnosisHome() {
  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <div className="mb-10 text-center">
        <Image
          src="/characters/byeolsaem.png"
          alt="별쌤"
          width={88}
          height={88}
          className="mx-auto mb-3 rounded-full shadow-md"
        />
        <h1 className="text-2xl font-bold text-zinc-800">진단평가</h1>
        <p className="mt-2 text-zinc-500">
          별쌤이 설계한 7단계 진단으로 지금 나의 수준을 알아보고,
          <br />딱 맞는 수업에서 시작해요. (영역별 각 25분)
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {KINDS.map((k) => (
          <Link
            key={k.kind}
            href={`/diagnosis/${k.kind}`}
            className={`flex items-center gap-4 rounded-2xl border-2 px-6 py-5 transition-colors ${k.color}`}
          >
            <Image
              src={k.character}
              alt={k.characterName}
              width={56}
              height={56}
              className="rounded-full shadow-sm"
            />
            <div className="flex-1">
              <p className="text-lg font-semibold text-zinc-800">{k.title}</p>
              <p className="text-sm text-zinc-500">{k.desc}</p>
            </div>
            <span className="text-2xl">→</span>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-zinc-400">
        결과는 자동으로 저장되어 나·학부모·선생님이 대시보드에서 함께 볼 수 있어요.
      </p>
    </main>
  );
}
