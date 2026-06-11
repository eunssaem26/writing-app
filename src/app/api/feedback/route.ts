import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/claude/system-prompt";
import { stripJson } from "@/lib/claude/strip-json";
import { buildUserPrompt } from "@/lib/claude/build-user-prompt";
import { getLessonConfig } from "@/prompts";
import type { FeedbackResult } from "@/lib/claude/types";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // 허가된(로그인한) 학생만 AI 피드백 사용 가능 — API 직접 호출로 인한 비용 누수 차단
    let studentId: string | null = null;
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

    const userPrompt = buildUserPrompt(lesson, student_text);

    const response = await client.messages.create({
      model: lesson.model,
      max_tokens: lesson.max_tokens,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonText = stripJson(rawText);
    const result: FeedbackResult = JSON.parse(jsonText);

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

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/feedback]", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
