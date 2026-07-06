import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";
import { startSession, advanceSession } from "@/lib/diagnosis/session";
import type { ClientResponse } from "@/lib/diagnosis/session-types";
import type { Kind } from "@/lib/diagnosis/engine";

export const dynamic = "force-dynamic";

// 진단 세션 — 정답/채점은 전부 서버에서. 클라이언트는 문항을 받고 응답만 보낸다.
export async function POST(req: NextRequest) {
  const configured = supabaseConfig().configured;

  // 로그인 필수(설정된 경우). 미설정 dev 환경에서는 게이트 없이 세션만 동작.
  let userId: string | null = null;
  if (configured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    userId = user.id;
  }

  const body = await req.json().catch(() => ({}));
  const action = body?.action;

  if (action === "start") {
    const kind: Kind = body.kind === "writing" ? "writing" : "reading";
    return NextResponse.json(startSession(kind));
  }

  if (action === "answer") {
    const token = typeof body.token === "string" ? body.token : "";
    const responses: ClientResponse[] = Array.isArray(body.responses)
      ? body.responses
      : [];
    const out = advanceSession(token, responses);
    if (!out) {
      return NextResponse.json(
        { error: "세션이 만료되었거나 유효하지 않아요. 진단을 다시 시작해 주세요." },
        { status: 400 }
      );
    }

    // 최종 결과면 서버가 직접(권위 있게) 저장한다 — 클라이언트 위조 불가.
    if (out.result && configured && userId) {
      const supabase = await createClient();
      const r = out.result;
      const { error } = await supabase.from("diagnosis_results").insert({
        student_id: userId,
        kind: r.kind,
        level: r.level,
        correct_count: r.correct,
        wrong_count: r.wrong,
        detail: {
          domain_levels: r.domainLevels,
          weighted_avg: r.avg,
          borderline: r.borderline,
          items: r.detailItems,
        },
      });
      if (error) {
        console.error("[/api/diagnosis/session] save", error);
        return NextResponse.json({ result: out.result, saved: false });
      }
      return NextResponse.json({ result: out.result, saved: true });
    }

    return NextResponse.json(out);
  }

  return NextResponse.json({ error: "알 수 없는 요청입니다." }, { status: 400 });
}
