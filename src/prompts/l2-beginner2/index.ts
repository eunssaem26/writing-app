import type { LessonConfig } from "../types";

// L2 초급 2 (TOPIK 2 · A2) — 영어권 순수 외국인 온램프 2단계.
// 과거·미래 시제 → 이유·연결 → 하나의 주제로 5~6문장 글. 지시문 영어 우선(한국어 병기),
// 산출은 한국어. stage 102 = L2 초급 2. 최종 수료 시 기존 7단계 진단으로 편입한다.

const HAIKU = "claude-haiku-4-5-20251001";
const SONNET = "claude-sonnet-4-6";

export const l2Beginner2Lessons: LessonConfig[] = [
  {
    track: "l2", stage: 102, lesson_num: 1, lesson_id: "01",
    lesson_title: "과거 시제 ~았/었어요 (Past tense)",
    lesson_summary:
      "Past tense: 가다→갔어요, 먹다→먹었어요, 하다→했어요. Use ~았어요 after ㅏ/ㅗ, ~었어요 otherwise.",
    assignment:
      "Write 4 sentences about what you did yesterday, using past tense ~았/었어요. Example: 어제 학교에 갔어요. 친구를 만났어요.\n(어제 한 일을 과거형으로 4문장.)",
    criteria: `C1: 과거형 ~았/었어요 서술어를 4회 이상 썼는가
C2: 최소 3개 서로 다른 동사를 사용했는가
C3: '어제' 등 과거 시점을 담았는가`,
    pass_rule: "C1 충족(4개 중 3개 이상 정확) + C2·C3 확인",
    not_evaluated: "불규칙 활용 완벽성, 조사 미세 오류",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 102, lesson_num: 2, lesson_id: "02",
    lesson_title: "미래·계획 ~(으)ㄹ 거예요 (Future & plans)",
    lesson_summary:
      "Future/plans: 가다→갈 거예요, 먹다→먹을 거예요. Use to talk about what you will do.",
    assignment:
      "Write 4 sentences about your plans for this weekend, using ~(으)ㄹ 거예요. Example: 주말에 영화를 볼 거예요.\n(이번 주말 계획을 미래형으로 4문장.)",
    criteria: `C1: 미래형 ~(으)ㄹ 거예요를 4회 이상 썼는가
C2: 받침 유무에 따라 을/ㄹ을 대체로 맞게 골랐는가
C3: 주말·미래 시점의 계획을 담았는가`,
    pass_rule: "C1·C3 충족 + C2 확인",
    not_evaluated: "불규칙 활용, 조사 세부",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 102, lesson_num: 3, lesson_id: "03",
    lesson_title: "존댓말과 반말 기초 (Polite vs casual)",
    lesson_summary:
      "Polite ~요 (해요) for most people; casual (해) with close friends. Beginners should master the polite ~요 form first.",
    assignment:
      "Write the same 3 sentences twice: once in polite ~요 form, once in casual form. Example: 밥을 먹어요 / 밥을 먹어.\n(같은 3문장을 존댓말과 반말로 각각.)",
    criteria: `C1: 존댓말 ~요 형태 3문장을 바르게 썼는가
C2: 반말 형태 3문장을 바르게 썼는가
C3: 존댓말↔반말 전환이 서로 대응되는가`,
    pass_rule: "C1 충족 + C2·C3 확인",
    not_evaluated: "높임 어휘(진지/드시다 등), 조사 세부",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 102, lesson_num: 4, lesson_id: "04",
    lesson_title: "이유 말하기 ~아서/어서, 그래서 (Reasons)",
    lesson_summary:
      "Give reasons: 배고파서 밥을 먹어요 (I eat because I'm hungry). 그래서 = so/therefore between sentences.",
    assignment:
      "Write 4 sentences that give reasons, using ~아서/어서 or 그래서. Example: 비가 와서 집에 있어요. 피곤해요. 그래서 일찍 자요.\n(이유를 담아 4문장 — ~아서/어서 또는 그래서 사용.)",
    criteria: `C1: ~아서/어서 또는 그래서를 최소 2회 사용했는가
C2: 원인-결과 관계가 논리적으로 이어지는가
C3: 4문장이 완결됐는가`,
    pass_rule: "C1·C2 충족 + C3 확인",
    not_evaluated: "고급 연결어미, 조사 세부",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 102, lesson_num: 5, lesson_id: "05",
    lesson_title: "문장 연결 그리고·하지만 (And / But)",
    lesson_summary:
      "그리고 = and (adds). 하지만/그렇지만 = but (contrasts). Use them to join short sentences into smoother writing.",
    assignment:
      "Write a 4–5 sentence paragraph about your day, using 그리고 and 하지만 at least once each. Example: 아침에 커피를 마셨어요. 그리고 산책했어요. 하지만 비가 왔어요.\n(하루에 대해 그리고·하지만을 넣어 4~5문장.)",
    criteria: `C1: 그리고를 1회 이상 바르게 썼는가
C2: 하지만(또는 그렇지만)을 1회 이상 바르게 썼는가
C3: 문장들이 한 주제(하루)로 이어지는가
C4: 과거/현재 시제를 일관되게 썼는가`,
    pass_rule: "C1·C2·C3 충족 + C4 확인",
    not_evaluated: "고급 접속부사, 조사 세부",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 102, lesson_num: 6, lesson_id: "06",
    lesson_title: "형용사로 꾸미기 (Describing with adjectives)",
    lesson_summary:
      "Adjectives describe: 예쁘다→예뻐요, 크다→커요, 맛있다→맛있어요. Before a noun: 예쁜 꽃, 큰 집.",
    assignment:
      "Describe 4 things around you using adjectives (both 예뻐요-style and 예쁜 꽃-style). Example: 이 꽃은 예뻐요. 저는 큰 가방이 있어요.\n(주변 4가지를 형용사로 꾸며 쓰기.)",
    criteria: `C1: 형용사 서술어(~어요/아요)를 2회 이상 바르게 썼는가
C2: 명사를 꾸미는 형태(~ㄴ/은 명사)를 1회 이상 썼는가
C3: 서로 다른 형용사를 3개 이상 사용했는가`,
    pass_rule: "C1 충족 + C2·C3 확인",
    not_evaluated: "불규칙 형용사(ㅂ/ㅡ 탈락) 완벽성, 조사",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 102, lesson_num: 7, lesson_id: "07",
    lesson_title: "메모·메시지 쓰기 (Notes & messages)",
    lesson_summary:
      "Everyday practical writing: a short message to a friend. Greeting + reason/plan + closing (예: 안녕! / 잘 자!).",
    assignment:
      "Write a short Korean message (4–5 sentences) to a friend: greet them, say what you did or will do, and close. Example: 마리아 씨, 안녕하세요! 어제 영화를 봤어요. 재미있었어요. 주말에 또 만나요!\n(친구에게 보내는 짧은 메시지 4~5문장.)",
    criteria: `C1: 인사로 시작하고 맺음말로 끝나는가
C2: 과거 또는 미래 시제로 소식·계획을 담았는가
C3: 메시지 흐름이 자연스러운가`,
    pass_rule: "C1·C2 충족 + C3 확인",
    not_evaluated: "격식 표현, 조사 세부, 이모지",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 102, lesson_num: 8, lesson_id: "08",
    lesson_title: "간단한 일기 쓰기 (Simple diary)",
    lesson_summary:
      "A diary tells what happened + how you felt: 오늘 ~했어요 + 재미있었어요/힘들었어요. Past tense + a feeling.",
    assignment:
      "Write a 5-sentence diary entry about today: what you did (past tense) and one feeling. Example: 오늘 친구를 만났어요. 같이 밥을 먹었어요. 정말 즐거웠어요.\n(오늘 한 일 + 느낌을 담아 일기 5문장.)",
    criteria: `C1: 과거 시제로 오늘 한 일을 3문장 이상 썼는가
C2: 느낌·감정을 1문장 이상 담았는가
C3: 시간 순서가 자연스러운가`,
    pass_rule: "C1·C2 충족 + C3 확인",
    not_evaluated: "조사 세부, 불규칙 활용, 어휘 다양성",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 102, lesson_num: 9, lesson_id: "09",
    lesson_title: "좋아하는 것 소개 글 (About what I like)",
    lesson_summary:
      "Introduce something you like and give reasons: what it is + why you like it + an example. This is your first mini-paragraph with reasons.",
    assignment:
      "Write a 5–6 sentence paragraph about something you like (a food, hobby, place). Include what it is, why you like it (~아서/어서), and one example.\n(좋아하는 것 하나를 이유와 함께 5~6문장으로.)",
    criteria: `C1: 하나의 주제(좋아하는 것)로 5문장 이상 썼는가
C2: 이유(~아서/어서, 그래서)를 1회 이상 담았는가
C3: 예시나 경험을 1개 담았는가
C4: 시제를 일관되게 썼는가`,
    pass_rule: "C1·C2 충족 + C3·C4 확인",
    not_evaluated: "고급 어휘, 조사 세부, 존댓말 등급",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    track: "l2", stage: 102, lesson_num: 10, lesson_id: "10",
    lesson_title: "주말 이야기 쓰기 (My weekend)",
    lesson_summary:
      "Tell a short story of your weekend in order, using past tense + connectors (그리고, 그래서, 하지만).",
    assignment:
      "Write 6 sentences about your last weekend in order: what you did, with whom, and how it was. Use past tense and at least two connectors.\n(지난 주말을 순서대로 6문장 — 과거형 + 연결어 2개 이상.)",
    criteria: `C1: 과거 시제로 6문장을 썼는가
C2: 연결어(그리고/그래서/하지만)를 2회 이상 사용했는가
C3: 시간 순서가 자연스럽게 이어지는가
C4: 느낌이나 평가를 1문장 담았는가`,
    pass_rule: "C1·C2·C3 충족 + C4 확인",
    not_evaluated: "불규칙 활용, 조사 세부, 어휘 난이도",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    track: "l2", stage: 102, lesson_num: 11, lesson_id: "11",
    lesson_title: "복습 — 자유 주제 글 (Review: free writing)",
    lesson_summary:
      "Put it all together: pick any topic and write a short paragraph using past/future tense, reasons, and connectors.",
    assignment:
      "Choose one topic — my last trip / my dream / my best friend — and write 6 Korean sentences using tense, reasons, and connectors.\n(여행·꿈·친구 중 하나로 6문장 — 시제·이유·연결어 활용.)",
    criteria: `C1: 하나의 주제로 6문장 이상 썼는가
C2: 과거 또는 미래 시제를 바르게 썼는가
C3: 이유 또는 연결어를 사용했는가
C4: 문장들이 한 주제로 모이는가`,
    pass_rule: "C1·C4 충족 + C2·C3 확인",
    not_evaluated: "고급 문법, 어휘 다양성, 존댓말 등급",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    track: "l2", stage: 102, lesson_num: 12, lesson_id: "12",
    lesson_title: "초급 2 최종 과제 (Final task — rubric)",
    lesson_summary:
      "Show a full A2 paragraph: a story or description with tense, reasons, connectors, and feelings that a Korean reader fully understands.",
    assignment:
      "Write a 7–9 sentence paragraph about a memorable day or a plan you're excited about. Include: what happened/will happen (tense), a reason (~아서/어서), connectors (그리고/하지만), and how you felt/feel.\n(기억에 남는 하루나 기대되는 계획을 7~9문장으로 — 시제·이유·연결어·느낌 포함.)",
    criteria: `C1(구성): 하나의 주제로 시간 순서가 있는 문단인가
C2(시제): 과거/미래 시제를 바르게 일관되게 썼는가
C3(연결): 이유(~아서/어서/그래서)와 연결어(그리고/하지만)를 사용했는가
C4(내용): 사건·이유·느낌을 모두 담았는가
C5(분량): 완결된 문장 7개 이상인가`,
    pass_rule: "C1·C4·C5 충족 + C2·C3 각 70% 이상 정확 → 기존 7단계 진단평가로 편입",
    not_evaluated: "고급 어휘·관용구, 존댓말 등급 세부, 불규칙 활용 완벽성",
    model: SONNET, max_tokens: 1800, is_rubric: true,
  },
];
