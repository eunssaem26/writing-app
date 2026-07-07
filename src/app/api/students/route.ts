import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// 교사 전용: 허가 학생 등록 (사전 등록제)
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "teacher") {
    return NextResponse.json(
      { error: "교사만 학생을 등록할 수 있습니다." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim();
  // 학습자 유형: heritage(재외동포·한국어 UI) / l2(영어권 초급·영어 UI)
  const track = body.track === "l2" ? "l2" : "heritage";
  const language = body.language === "en" ? "en" : "ko";
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "올바른 이메일을 입력해 주세요." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      {
        error:
          "서버에 SUPABASE_SECRET_KEY가 설정되지 않았습니다. SUPABASE_SETUP.md의 '학생 사전 등록제' 항목을 확인해 주세요.",
      },
      { status: 500 }
    );
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: name ? { full_name: name } : undefined,
  });

  if (error) {
    const already = /already|exists|registered/i.test(error.message);
    return NextResponse.json(
      { error: already ? "이미 등록된 이메일이에요." : error.message },
      { status: already ? 409 : 500 }
    );
  }

  // 트리거가 만든 프로필에 트랙·언어(·이름) 반영
  if (data.user) {
    const update: { track: string; language: string; display_name?: string } = {
      track,
      language,
    };
    if (name) update.display_name = name;
    await admin.from("profiles").update(update).eq("id", data.user.id);
  }

  return NextResponse.json({ ok: true });
}
