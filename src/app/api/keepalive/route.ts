import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Supabase 무료 플랜은 약 7일간 활동이 없으면 프로젝트를 자동 일시정지(pause)한다.
// pause되면 프로젝트 도메인이 DNS에서 사라져 로그인 시 "사이트에 연결할 수 없음"이 뜬다.
// 이 라우트를 Vercel Cron이 매일 호출해 가벼운 DB 조회를 발생시켜 활동 상태를 유지한다.
// (vercel.json의 crons 참고)

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // CRON_SECRET이 설정돼 있으면 Vercel Cron 호출만 허용한다(외부 남용 방지). 선택 사항.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  const supabase = createAdminClient();
  if (!supabase) {
    // Supabase 미설정 상태 — keep-alive 대상이 없으므로 조용히 통과
    return NextResponse.json({ ok: true, skipped: "supabase not configured" });
  }

  // auth.users에 대한 가벼운 실제 DB 조회 1건 — 스키마에 의존하지 않는다.
  const { error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, pinged: true });
}
