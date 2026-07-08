import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseConfig } from "@/lib/supabase/config";
import type { Profile } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

// 게임 코너/캐릭터 라벨
const CORNER: Record<string, string> = {
  geul: "글쌤 · 맞춤법",
  hogi: "호기 · 헷갈리는 단어",
  chaek: "책쌤 · 속담·어휘",
  kkan: "깐쌤 · 빨간펜",
  byeol: "별쌤 · 진단",
  eun: "은쌤 · 보스전",
};

type GameEvent = {
  session_id: string;
  event_type: "answer" | "diag" | "boss";
  corner: string | null;
  question_id: string | null;
  question_text: string | null;
  correct: boolean | null;
  stars: number | null;
  score_correct: number | null;
  score_total: number | null;
  boss_pass: boolean | null;
  created_at: string;
};

export default async function GameStatsPage() {
  const { configured } = supabaseConfig();
  if (!configured) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <h1 className="mb-4 text-2xl font-bold text-zinc-800">준비 중</h1>
        <p className="text-zinc-500">Supabase 연결 후 게임 통계가 여기에 표시돼요.</p>
      </main>
    );
  }

  // 로그인 + 교사 권한 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/game");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();
  if ((profile?.role ?? "student") !== "teacher") redirect("/dashboard");

  // service key로 집계 조회 (익명 게임 이벤트는 RLS상 anon이 못 읽음)
  const admin = createAdminClient();
  if (!admin) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <h1 className="mb-4 text-2xl font-bold text-zinc-800">설정 필요</h1>
        <p className="text-zinc-500">
          서버에 SUPABASE_SECRET_KEY가 없어 통계를 읽을 수 없어요.
        </p>
      </main>
    );
  }

  const { data, error } = await admin
    .from("game_events")
    .select(
      "session_id,event_type,corner,question_id,question_text,correct,stars,score_correct,score_total,boss_pass,created_at"
    )
    .order("created_at", { ascending: false })
    .limit(20000);

  const events = (data as GameEvent[] | null) ?? [];

  // ── 집계 ──
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessions = new Set(events.map((e) => e.session_id));
  const weekSessions = new Set(
    events.filter((e) => new Date(e.created_at).getTime() >= weekAgo).map((e) => e.session_id)
  );

  const diagEvents = events.filter((e) => e.event_type === "diag" && e.stars != null);
  const avgStars =
    diagEvents.length > 0
      ? diagEvents.reduce((s, e) => s + (e.stars ?? 0), 0) / diagEvents.length
      : null;

  const bossEvents = events.filter((e) => e.event_type === "boss");
  const bossPass = bossEvents.filter((e) => e.boss_pass).length;
  const bossRate = bossEvents.length > 0 ? (bossPass / bossEvents.length) * 100 : null;

  const answers = events.filter((e) => e.event_type === "answer");

  // 코너별 정답률
  const byCorner = new Map<string, { attempts: number; correct: number }>();
  for (const a of answers) {
    const key = a.corner ?? "?";
    const cur = byCorner.get(key) ?? { attempts: 0, correct: 0 };
    cur.attempts++;
    if (a.correct) cur.correct++;
    byCorner.set(key, cur);
  }
  const cornerRows = [...byCorner.entries()]
    .map(([k, v]) => ({ key: k, ...v, rate: v.attempts ? (v.correct / v.attempts) * 100 : 0 }))
    .sort((a, b) => a.rate - b.rate);

  // 가장 많이 틀린 문제 TOP10
  const byQ = new Map<string, { text: string; corner: string; wrong: number; total: number }>();
  for (const a of answers) {
    if (!a.question_id) continue;
    const cur =
      byQ.get(a.question_id) ??
      { text: a.question_text ?? a.question_id, corner: a.corner ?? "?", wrong: 0, total: 0 };
    cur.total++;
    if (a.correct === false) cur.wrong++;
    byQ.set(a.question_id, cur);
  }
  const mostMissed = [...byQ.values()]
    .filter((q) => q.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong || b.wrong / b.total - a.wrong / a.total)
    .slice(0, 10);

  const stat = (label: string, value: string, sub?: string) => (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="mt-1 text-3xl font-bold text-zinc-800">{value}</div>
      {sub && <div className="mt-1 text-xs text-zinc-400">{sub}</div>}
    </div>
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-zinc-800">문해력 게임 통계</h1>
      <p className="mt-1 text-sm text-zinc-500">
        익명 집계예요. 로그인·이름 없이 플레이 기록만 모아요.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
          아직 game_events 테이블이 없어요. Supabase에서 game-analytics.sql을 먼저 실행해 주세요.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stat("총 플레이", `${sessions.size}`, "세션 수(누적)")}
        {stat("이번 주", `${weekSessions.size}`, "최근 7일 세션")}
        {stat("평균 별점", avgStars != null ? `⭐${avgStars.toFixed(1)}` : "—", "별쌤 진단")}
        {stat("보스 통과율", bossRate != null ? `${Math.round(bossRate)}%` : "—", `${bossPass}/${bossEvents.length}명`)}
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-zinc-800">가장 많이 틀린 문제 TOP10</h2>
        {mostMissed.length === 0 ? (
          <p className="text-sm text-zinc-400">아직 데이터가 없어요.</p>
        ) : (
          <ol className="space-y-2">
            {mostMissed.map((q, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3"
              >
                <span className="mt-0.5 text-sm font-bold text-zinc-400">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-zinc-800">{q.text}</div>
                  <div className="mt-0.5 text-xs text-zinc-400">{CORNER[q.corner] ?? q.corner}</div>
                </div>
                <div className="whitespace-nowrap text-right text-xs text-zinc-500">
                  <div className="font-bold text-red-500">{q.wrong}회 오답</div>
                  <div>{Math.round((q.wrong / q.total) * 100)}% ({q.total}회 중)</div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-zinc-800">코너별 정답률</h2>
        {cornerRows.length === 0 ? (
          <p className="text-sm text-zinc-400">아직 데이터가 없어요.</p>
        ) : (
          <ul className="space-y-2">
            {cornerRows.map((c) => (
              <li key={c.key} className="rounded-xl border border-zinc-200 bg-white p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-800">{CORNER[c.key] ?? c.key}</span>
                  <span className="font-bold text-zinc-600">
                    {Math.round(c.rate)}%{" "}
                    <span className="font-normal text-zinc-400">
                      ({c.correct}/{c.attempts})
                    </span>
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div className="h-full rounded-full bg-emerald-400" style={{ width: `${c.rate}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
