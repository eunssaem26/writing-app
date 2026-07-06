# 운영 매뉴얼 — 로그인/서비스 장애 대처

## 증상: "로그인 시 사이트에 연결할 수 없음" + 첫 로딩이 느림

### 원인
1. **로그인 불가** — Supabase 무료 플랜 프로젝트가 **약 7일간 미사용 시 자동 일시정지(pause)** 된다.
   pause되면 프로젝트 도메인(`*.supabase.co`)이 DNS에서 사라져(NXDOMAIN) 로그인이 서버에 닿지 못한다.
2. **느린 첫 로딩** — Vercel 서버리스 콜드 스타트. 앱이 한동안 유휴 상태였다가 첫 접속 시 부팅에 ~1초가 걸리는 정상 현상.

### 빠른 진단 (터미널)
```bash
# DNS가 사라졌으면(NXDOMAIN) = Supabase가 pause된 것
host bbmrnjkqjxmlvzjsvzfp.supabase.co

# 살아 있으면 200, 죽었으면 연결 실패
curl -s -o /dev/null -w "%{http_code}\n" https://bbmrnjkqjxmlvzjsvzfp.supabase.co/auth/v1/health
```

### 즉시 복구 (은쌤이 직접)
1. https://app.supabase.com 접속 → 프로젝트 `bbmrnjkqjxmlvzjsvzfp` 선택
2. 상단에 뜨는 **"Restore project"** 버튼 클릭 → 복구 완료까지 몇 분 대기
3. 위 `curl` 명령이 `200`을 반환하면 로그인 정상화

## 재발 방지 (자동)
- **Vercel Cron keep-alive** — `vercel.json`의 `crons`가 매일 08:00(UTC)에 `/api/keepalive`를 호출,
  Supabase에 가벼운 DB 조회를 발생시켜 자동 pause를 막는다.
- 확인: Vercel 대시보드 → writing-app-1q5b → **Settings → Cron Jobs** 에 항목이 보여야 함.
- 로그 확인: Vercel → Logs 에서 `/api/keepalive` 200 여부.
- (선택) 남용 방지: Vercel 환경변수에 `CRON_SECRET`을 넣으면 Cron 호출만 허용된다.

## 완전 방지(유료)
- 이 장애를 근본적으로 없애려면 Supabase **Pro 플랜($25/월)** — pause가 없다.
  keep-alive cron으로 무료 플랜을 유지하는 것이 현재 전략.

## 주의
- keep-alive는 **Vercel에 배포되어 실행 중일 때만** 작동한다. 배포가 멈춰 있으면 pause를 못 막는다.
- GitHub Actions 스케줄과 달리 Vercel Cron은 배포가 살아있는 한 계속 돈다.
