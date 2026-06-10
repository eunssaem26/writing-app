# Supabase 연결 가이드 (은쌤용 — 약 15분)

로그인·학생별 대시보드 코드는 모두 준비됐어요. 아래만 하면 실제로 켜집니다.
연결 전에는 로그인 게이트가 자동으로 꺼져 있어서 지금처럼 누구나 쓸 수 있어요.

## 1. Supabase 프로젝트 만들기 (5분)

1. https://supabase.com 접속 → GitHub 계정으로 가입/로그인
2. **New project** 클릭
   - Name: `thinking-field`
   - Database Password: 아무거나 강력하게 
   - Region: `Northeast Asia (Seoul)` 권장
3. 생성 완료 후 **Project Settings → API** 에서 두 값 복사:
   - `Project URL`
   - `anon public` 키

## 2. 키 붙여넣기 (2분)

`writing-app/.env.local` 의 플레이스홀더를 실제 값으로 교체: 이거 어떻게 하는거야?



Vercel에도 동일하게: writing-app 프로젝트 → Settings → Environment Variables 에 두 개 추가 후 재배포.

## 3. 테이블 만들기 (2분)

Supabase 대시보드 → **SQL Editor** → `supabase/schema.sql` 파일 내용 전체를 붙여넣고 **Run**.

→ profiles(계정), parent_links(학부모-학생 연결), diagnosis_results(진단 결과), lesson_records(수업 기록) 테이블과 보안 정책이 한 번에 생성돼요.

## 4. 로그인 리디렉트 주소 등록 (2분)

Supabase 대시보드 → **Authentication → URL Configuration**:

- Site URL: 배포된 writing-app 주소 (예: `https://writing-app-xxx.vercel.app`)
- Redirect URLs에 추가:
  - `http://localhost:3000/auth/callback`
  - `https://<배포주소>/auth/callback`

이메일 로그인(매직 링크)은 이걸로 끝 — 바로 작동해요.

## 5. (선택) Google 로그인 켜기 (5분)

Authentication → Providers → Google → Enable.
Google Cloud Console에서 OAuth Client ID/Secret을 만들어 붙여넣어야 해요.
당장은 이메일 로그인만으로 충분하니 나중에 해도 됩니다.

## 6. 은쌤을 교사 계정으로 승격 (1분)

은쌤 계정으로 한 번 로그인한 뒤, SQL Editor에서:

```sql
update profiles set role = 'teacher'
where id = (select id from auth.users where email = 'eunssaem26@gmail.com');
```

→ 대시보드(`/dashboard`)에서 전체 학생 현황이 보여요.

## 7. 학부모 연결하는 법

학부모가 가입한 뒤, SQL Editor에서:

```sql
-- 역할 변경
update profiles set role = 'parent'
where id = (select id from auth.users where email = '학부모이메일');

-- 자녀 연결
insert into parent_links (parent_id, student_id) values (
  (select id from auth.users where email = '학부모이메일'),
  (select id from auth.users where email = '학생이메일')
);
```

→ 학부모는 자기 자녀의 진단 결과·수업 기록만 볼 수 있어요.

---

## 동작 방식 요약

- 로그인 전: `/stage/...`(수업), `/dashboard` 접근 시 자동으로 `/login`으로 이동
- 로그인 페이지: 영어 우선 표기 (Log in / Continue with Google / Send login link)
- 수업에서 글을 쓰고 피드백을 받으면 자동으로 `lesson_records`에 저장
- 진단평가가 배포되면 결과가 `diagnosis_results`에 저장 (다음 단계)
- 권한: 학생=본인 것만, 학부모=연결된 자녀 것만, 교사=전체 (DB 차원에서 강제)
