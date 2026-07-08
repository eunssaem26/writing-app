-- 문해력 게임 익명 통계 (Phase 1)
-- Supabase 대시보드 > SQL Editor 에 전체 붙여넣기 후 Run 하면 됩니다.
-- 개인정보를 담지 않습니다. 로그인·이름 없이 익명 세션ID 단위로만 집계합니다.

-- ── 게임 이벤트 테이블 ──────────────────────────────────
create table public.game_events (
  id            bigint generated always as identity primary key,
  session_id    text not null check (char_length(session_id) <= 64),   -- 브라우저가 만든 익명 ID (개인정보 아님)
  event_type    text not null check (event_type in ('answer', 'diag', 'boss')),
  corner        text check (char_length(corner) <= 32),                 -- 코너/캐릭터: geul, hogi, chaek, kkan ...
  question_id   text check (char_length(question_id) <= 64),
  question_text text check (char_length(question_text) <= 300),
  correct       boolean,                                                -- answer: 정답 여부
  stars         int check (stars between 0 and 5),                      -- diag: 별쌤 별점
  score_correct int check (score_correct >= 0),
  score_total   int check (score_total >= 0),
  boss_pass     boolean,                                                -- boss: 은쌤 보스전 통과 여부
  created_at    timestamptz not null default now()
);

create index game_events_created_at_idx on public.game_events (created_at);
create index game_events_type_corner_idx on public.game_events (event_type, corner);
-- '가장 많이 틀린 문제' 집계용
create index game_events_wrong_idx on public.game_events (question_id) where correct = false;

-- ── Row Level Security ──────────────────────────────────
alter table public.game_events enable row level security;

-- 익명(anon)·로그인 사용자 모두 INSERT만 가능.
-- SELECT/UPDATE/DELETE 정책이 없으므로 아무도 이 표를 읽거나 고칠 수 없다(쓰기 전용).
-- 대시보드는 service key(서버)로 RLS를 우회해 조회한다.
create policy "game_events_insert_only" on public.game_events
  for insert to anon, authenticated
  with check (true);
