import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, SYSTEM_PROMPT_L2 } from "@/lib/claude/system-prompt";
import { stripJson } from "@/lib/claude/strip-json";
import { buildUserPrompt } from "@/lib/claude/build-user-prompt";
import { getLessonConfig } from "@/prompts";
import { normalizeFeedback } from "@/lib/claude/validate";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // 허가된(로그인한) 학생만 AI 피드백 사용 가능 — API 직접 호출로 인한 비용 누수 차단
    let studentId: string | null = null;
    let studentLang: "ko" | "en" = "ko";
    if (supabaseConfig().configured) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json(
          { error: "로그인이 필요합니다. Please log in first." },
          { status: 401 }
        );
      }
      studentId = user.id;
      // 학생의 UI 언어 — 영어권(en) 학생은 heritage 단계로 편입해도 영어 피드백을 받는다
      const { data: profile } = await supabase
        .from("profiles")
        .select("language")
        .eq("id", user.id)
        .single<{ language: "ko" | "en" }>();
      if (profile?.language === "en") studentLang = "en";
    }

    const body = await req.json();
    const { stage, lesson_num, student_text } = body as {
      stage: number;
      lesson_num: number;
      student_text: string;
    };

    if (!stage || !lesson_num || !student_text?.trim()) {
      return NextResponse.json(
        { error: "stage, lesson_num, student_text 가 필요합니다." },
        { status: 400 }
      );
    }

    const lesson = getLessonConfig(stage, lesson_num);
    if (!lesson) {
      return NextResponse.json(
        { error: `차시를 찾을 수 없습니다: ${stage}단계 ${lesson_num}차시` },
        { status: 404 }
      );
    }

    // 영어 피드백 조건: L2 초급 차시이거나, 학생이 영어권(en)이라 heritage 단계로
    // 편입한 경우 — 편입 후에도 영어 피드백을 이어받아 '중급 합류'의 벽을 낮춘다.
    const english = lesson.track === "l2" || studentLang === "en";
    const userPrompt = buildUserPrompt(lesson, student_text, english);
    const systemPrompt = english ? SYSTEM_PROMPT_L2 : SYSTEM_PROMPT;

    const response = await client.messages.create({
      model: lesson.model,
      max_tokens: lesson.max_tokens,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonText = stripJson(rawText);
    // 파싱 + 스키마 검증·정규화 (필드 누락/형변형으로 화면이 깨지는 것 방지)
    const result = normalizeFeedback(JSON.parse(jsonText));

    // 수업 기록 저장 (실패해도 피드백 응답은 그대로 반환)
    if (studentId) {
      try {
        const supabase = await createClient();
        await supabase.from("lesson_records").insert({
          student_id: studentId,
          stage,
          lesson: lesson_num,
          student_text,
          feedback: result,
        });
      } catch (saveErr) {
        console.error("[/api/feedback] 기록 저장 실패", saveErr);
      }
    }

    // english: 클라이언트가 피드백 패널 라벨 언어를 서버 판단과 일치시키도록 함께 반환
    return NextResponse.json({ feedback: result, english });
  } catch (err) {
    console.error("[/api/feedback]", err);
    // 학생에게는 원인별 한국어 안내만 보여주고, 원문 에러는 서버 로그에만 남긴다
    const raw = err instanceof Error ? err.message : String(err);
    let message = "피드백을 만드는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.";
    if (/apiKey|authToken|authentication|invalid x-api-key|401/i.test(raw)) {
      message =
        "글쌤(AI) 연결 설정에 문제가 있어요. 선생님께 알려 주세요!";
    } else if (/rate.?limit|overloaded|429|529/i.test(raw)) {
      message = "지금 글쌤이 너무 바빠요. 1분 뒤에 다시 시도해 주세요.";
    } else if (/JSON|Unexpected token|schema/i.test(raw)) {
      message =
        "피드백을 읽어 오는 중 문제가 생겼어요. 한 번만 다시 시도해 주세요.";
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
