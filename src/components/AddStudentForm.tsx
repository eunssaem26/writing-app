"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddStudentForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [track, setTrack] = useState<"heritage" | "l2">("heritage");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    // 트랙에 맞춰 UI 언어도 함께 설정: 재외동포=한국어, 영어권 초급=영어
    const language = track === "l2" ? "en" : "ko";
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, track, language }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMsg({
        ok: true,
        text: `${name || email} 학생 등록 완료 (${
          track === "l2" ? "영어권 초급" : "재외동포"
        })! 이제 이 이메일로 로그인할 수 있어요.`,
      });
      setEmail("");
      setName("");
      setTrack("heritage");
      router.refresh();
    } else {
      setMsg({ ok: false, text: data.error ?? "등록에 실패했어요." });
    }
  }

  return (
    <section className="mb-8 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-6">
      <h2 className="mb-1 font-bold text-zinc-800">학생 추가</h2>
      <p className="mb-4 text-sm text-zinc-500">
        여기에 등록된 이메일만 로그인할 수 있어요 (사전 등록제).
      </p>
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1">
          <label htmlFor="student-email" className="mb-1 block text-xs font-medium text-zinc-500">
            이메일 *
          </label>
          <input
            id="student-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@example.com"
            className="w-full rounded-lg border-2 border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400"
          />
        </div>
        <div className="min-w-32">
          <label htmlFor="student-name" className="mb-1 block text-xs font-medium text-zinc-500">
            이름 (선택)
          </label>
          <input
            id="student-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className="w-full rounded-lg border-2 border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400"
          />
        </div>
        <div className="min-w-44">
          <label htmlFor="student-track" className="mb-1 block text-xs font-medium text-zinc-500">
            학습자 유형
          </label>
          <select
            id="student-track"
            value={track}
            onChange={(e) => setTrack(e.target.value as "heritage" | "l2")}
            className="w-full rounded-lg border-2 border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400"
          >
            <option value="heritage">재외동포 (한국어 UI)</option>
            <option value="l2">영어권 초급 (English UI)</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
        >
          {loading ? "등록 중..." : "등록"}
        </button>
      </form>
      {msg && (
        <p
          className={`mt-3 rounded-lg p-2.5 text-sm ${
            msg.ok ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-600"
          }`}
        >
          {msg.text}
        </p>
      )}
    </section>
  );
}
