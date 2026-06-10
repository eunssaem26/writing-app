-- 생각하는 글밭 — 학생·학부모·교사 계정과 학습 기록 스키마
-- Supabase 대시보드 > SQL Editor 에 전체 붙여넣기 후 Run 하면 됩니다.

-- ── 프로필 ──────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'student' check (role in ('student', 'parent', 'teacher')),
  display_name text,
  language text not null default 'ko' check (language in ('ko', 'en')),
  track text check (track in ('heritage', 'l2')),
  created_at timestamptz not null default now()
);

-- 회원가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 학부모-학생 연결 ────────────────────────────────────
create table public.parent_links (
  parent_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  primary key (parent_id, student_id)
);

-- ── 진단평가 결과 ───────────────────────────────────────
create table public.diagnosis_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('reading', 'writing')),
  level int not null,
  correct_count int not null default 0,
  wrong_count int not null default 0,
  detail jsonb,
  created_at timestamptz not null default now()
);

-- ── 수업(글쓰기) 기록 ───────────────────────────────────
create table public.lesson_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  stage int not null,
  lesson int not null,
  student_text text not null,
  feedback jsonb,
  created_at timestamptz not null default now()
);

-- ── 권한 헬퍼 (RLS 정책 안에서 profiles를 다시 조회하면
--    무한 재귀가 되므로 security definer 함수로 우회) ──
create or replace function public.is_teacher()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'teacher'
  );
$$;

create or replace function public.is_parent_of(sid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from parent_links where parent_id = auth.uid() and student_id = sid
  );
$$;

-- ── Row Level Security ──────────────────────────────────
alter table public.profiles enable row level security;
alter table public.parent_links enable row level security;
alter table public.diagnosis_results enable row level security;
alter table public.lesson_records enable row level security;

-- profiles: 본인 / 교사 / 연결된 학부모만 조회
create policy "profiles_select" on public.profiles for select
  using (id = auth.uid() or public.is_teacher() or public.is_parent_of(id));

create policy "profiles_update_own" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid() and role = 'student');

create policy "profiles_teacher_update" on public.profiles for update
  using (public.is_teacher());

-- parent_links: 당사자와 교사만 조회, 연결 관리는 교사만
create policy "parent_links_select" on public.parent_links for select
  using (parent_id = auth.uid() or student_id = auth.uid() or public.is_teacher());

create policy "parent_links_teacher_write" on public.parent_links for all
  using (public.is_teacher()) with check (public.is_teacher());

-- diagnosis_results: 본인 / 교사 / 학부모 조회, 본인·교사만 기록
create policy "diagnosis_select" on public.diagnosis_results for select
  using (student_id = auth.uid() or public.is_teacher() or public.is_parent_of(student_id));

create policy "diagnosis_insert" on public.diagnosis_results for insert
  with check (student_id = auth.uid() or public.is_teacher());

-- lesson_records: 본인 / 교사 / 학부모 조회, 본인·교사만 기록
create policy "lessons_select" on public.lesson_records for select
  using (student_id = auth.uid() or public.is_teacher() or public.is_parent_of(student_id));

create policy "lessons_insert" on public.lesson_records for insert
  with check (student_id = auth.uid() or public.is_teacher());
