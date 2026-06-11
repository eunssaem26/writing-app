import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";

// 진단 결과 저장 — 로그인한 본인 결과만 (RLS가 DB에서 한 번 더 강제)
export async function POST(req: NextRequest) {
  if (!supabaseConfig().configured) {
    return NextResponse.json({ error: "저장소 미설정" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await req.json();
  const kind = body.kind === "writing" ? "writing" : "reading";
  const level = Number(body.level);
  if (!Number.isInteger(level) || level < 1 || level > 7) {
    return NextResponse.json({ error: "잘못된 결과 형식입니다." }, { status: 400 });
  }

  const { error } = await supabase.from("diagnosis_results").insert({
    student_id: user.id,
    kind,
    level,
    correct_count: Number(body.correct_count) || 0,
    wrong_count: Number(body.wrong_count) || 0,
    detail: body.detail ?? null,
  });

  if (error) {
    console.error("[/api/diagnosis]", error);
    return NextResponse.json(
      { error: "결과 저장 중 문제가 생겼어요." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
