import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";
  const safeNext = next.startsWith("/") ? next : "/dashboard";

  // OAuth(구글 등) 제공자가 에러와 함께 돌려보낸 경우 처리.
  // 사전 등록되지 않은 사람이 로그인 시도 → 신규가입 차단(422/access_denied)이면
  // "미등록 이메일" 안내로 보낸다(초대제 유지). 그 외 에러는 일반 안내.
  const authError = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  if (authError) {
    const signupBlocked =
      errorCode === "422" ||
      authError === "access_denied" ||
      /signups?\s*not\s*allowed/i.test(searchParams.get("error_description") ?? "");
    const reason = signupBlocked ? "not_registered" : "auth";
    return NextResponse.redirect(`${origin}/login?error=${reason}`);
  }

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
