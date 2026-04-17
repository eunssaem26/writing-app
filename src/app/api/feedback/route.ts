import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/claude/system-prompt";
import { stripJson } from "@/lib/claude/strip-json";
import { buildUserPrompt } from "@/lib/claude/build-user-prompt";
import { getLessonConfig } from "@/prompts";
import type { FeedbackResult } from "@/lib/claude/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
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

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/feedback]", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
