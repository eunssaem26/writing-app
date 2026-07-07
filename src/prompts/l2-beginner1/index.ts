import type { LessonConfig } from "../types";

// L2 초급 1 (TOPIK 1 · A1) — 영어권 순수 외국인 온램프.
// 한글 해득 → 기본 문형 → 나를 소개하는 짧은 글. 지시문은 영어 우선(한국어 병기),
// 산출은 한국어. stage 101 = L2 초급 1 (기존 heritage 1~7단계와 충돌하지 않는 번호).
// 진단 없이 순서대로 진행하고, 초급 2(stage 102) 수료 후 기존 7단계 진단으로 편입한다.

const HAIKU = "claude-haiku-4-5-20251001";
const SONNET = "claude-sonnet-4-6";

export const l2Beginner1Lessons: LessonConfig[] = [
  {
    track: "l2", stage: 101, lesson_num: 1, lesson_id: "01",
    lesson_title: "한글 읽기 — 모음과 자음 (Reading Hangul)",
    lesson_summary:
      "Hangul is built from vowels (ㅏㅓㅗㅜㅡㅣ) and consonants (ㄱㄴㄷㄹㅁ). Consonant + vowel = a syllable: ㄴ+ㅏ = 나.",
    assignment:
      "Type these 5 Korean syllables in Hangul (copy them): 나, 가, 도, 무, 리. Then type your favorite one and, in English, what sound it makes.\n(한글 5개를 따라 쓰고, 좋아하는 한 글자와 그 소리를 영어로 쓰세요.)",
    criteria: `C1: 한글 음절 5개(나·가·도·무·리)를 알아볼 수 있게 입력했는가
C2: 좋아하는 글자 1개를 골라 그 소리를 영어로 설명했는가`,
    pass_rule: "C1 충족(5개 중 4개 이상 정확), C2 확인",
    not_evaluated: "완벽한 자형, 받침, 띄어쓰기",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 101, lesson_num: 2, lesson_id: "02",
    lesson_title: "한글 쓰기 — 받침과 조합 (Batchim)",
    lesson_summary:
      "A syllable can have a bottom consonant (받침): 바+ㅁ = 밤. Batchim closes the syllable's sound.",
    assignment:
      "Write these 4 syllables with batchim: 밤, 손, 물, 집. Then type your first name in Hangul as best you can.\n(받침이 있는 글자 4개를 쓰고, 내 이름을 한글로 써 보세요.)",
    criteria: `C1: 받침 있는 음절 4개(밤·손·물·집)를 알아볼 수 있게 입력했는가
C2: 자기 이름을 한글로 시도했는가 (완벽하지 않아도 됨)`,
    pass_rule: "C1 충족(4개 중 3개 이상), C2 시도 확인",
    not_evaluated: "이름 표기의 완벽성, 미세한 자형",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 101, lesson_num: 3, lesson_id: "03",
    lesson_title: "인사와 자기소개 (Greetings & Introductions)",
    lesson_summary:
      "안녕하세요 = Hello. 저는 ___이에요/예요 = I am ___. 만나서 반가워요 = Nice to meet you.",
    assignment:
      "Write 3 sentences in Korean introducing yourself: your name, your country, and a greeting. Example: 안녕하세요. 저는 마리아예요. 저는 멕시코에서 왔어요.\n(이름·나라·인사를 담아 한국어로 3문장 쓰기.)",
    criteria: `C1: 인사말(안녕하세요 등)이 있는가
C2: '저는 ~이에요/예요' 문형으로 이름을 소개했는가
C3: 나라 정보를 담았는가`,
    pass_rule: "C1·C2 충족, C3 확인",
    not_evaluated: "조사 미세 오류, 맞춤법 세부, 존댓말 등급",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 101, lesson_num: 4, lesson_id: "04",
    lesson_title: "이것은 ~입니다 (This is ~)",
    lesson_summary:
      "이것은 ___입니다 = This is ___. 이것 = this, 그것 = that. Use to name objects around you.",
    assignment:
      "Look around you. Write 4 sentences naming things in Korean using 이것은 ___이에요. Example: 이것은 책이에요. 이것은 물이에요.\n(주변 사물 4개를 '이것은 ~이에요'로 쓰기.)",
    criteria: `C1: '이것은 ~이에요/입니다' 문형을 4번 바르게 썼는가
C2: 서로 다른 사물 4개를 명명했는가`,
    pass_rule: "C1 충족(4개 중 3개 이상 정확), C2 확인",
    not_evaluated: "어휘 철자 세부, 조사 예외",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 101, lesson_num: 5, lesson_id: "05",
    lesson_title: "조사 은/는, 이/가 (Topic & Subject markers)",
    lesson_summary:
      "은/는 marks the topic, 이/가 marks the subject. After a batchim: 은/이. After a vowel: 는/가. 저는(vowel), 이름은(batchim).",
    assignment:
      "Write 4 sentences using 은/는 and 이/가 correctly. Example: 저는 학생이에요. 날씨가 좋아요.\n(은/는, 이/가를 바르게 넣어 4문장 쓰기.)",
    criteria: `C1: 은/는을 받침 유무에 맞게 최소 2회 썼는가
C2: 이/가를 받침 유무에 맞게 최소 2회 썼는가
C3: 4문장이 뜻이 통하는가`,
    pass_rule: "C1·C2 각 1회 이상 정확 + C3 충족",
    not_evaluated: "고급 조사 구분, 어휘 난이도",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 101, lesson_num: 6, lesson_id: "06",
    lesson_title: "숫자·날짜·시간 (Numbers, Dates, Time)",
    lesson_summary:
      "Sino-Korean numbers: 일 이 삼 사 오. 오늘은 ___월 ___일이에요 = Today is ___. 지금 ___시예요 = It's ___ o'clock.",
    assignment:
      "Write 3 Korean sentences: today's date, the current time, and your age. Example: 오늘은 오월 칠일이에요.\n(오늘 날짜·지금 시간·내 나이를 한국어 3문장으로.)",
    criteria: `C1: 날짜를 '~월 ~일' 형식으로 썼는가
C2: 시간 또는 나이를 숫자 표현으로 담았는가
C3: 3문장이 완결됐는가`,
    pass_rule: "C1 충족 + C2·C3 확인",
    not_evaluated: "고유어/한자어 수 구분 오류, 조사 세부",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 101, lesson_num: 7, lesson_id: "07",
    lesson_title: "조사 을/를, 에/에서 (Object & Place markers)",
    lesson_summary:
      "을/를 marks the object (밥을 먹어요). 에 = to/at a place (학교에 가요). 에서 = at/from where an action happens (집에서 자요).",
    assignment:
      "Write 4 sentences using 을/를 and 에 or 에서. Example: 저는 학교에 가요. 밥을 먹어요.\n(을/를, 에/에서를 넣어 4문장 쓰기.)",
    criteria: `C1: 을/를을 받침 유무에 맞게 최소 2회 썼는가
C2: 에 또는 에서를 문맥에 맞게 최소 2회 썼는가
C3: 4문장이 뜻이 통하는가`,
    pass_rule: "C1·C2 각 1회 이상 정확 + C3 충족",
    not_evaluated: "에/에서 미세 구분 완벽성, 어휘",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 101, lesson_num: 8, lesson_id: "08",
    lesson_title: "지금 ~해요 (Present tense)",
    lesson_summary:
      "Polite present tense ~아요/어요: 가다→가요, 먹다→먹어요, 마시다→마셔요. Use for what you do now/usually.",
    assignment:
      "Write 5 sentences about what you do in a day, using present tense ~아요/어요. Example: 아침에 커피를 마셔요. 학교에 가요.\n(하루 일과를 현재형 ~아요/어요로 5문장.)",
    criteria: `C1: 현재형 ~아요/어요 서술어를 5회 이상 썼는가
C2: 최소 3개 서로 다른 동사를 사용했는가
C3: 문장들이 하루 일과로 이어지는가`,
    pass_rule: "C1·C2 충족, C3 확인",
    not_evaluated: "불규칙 활용 완벽성, 조사 세부",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 101, lesson_num: 9, lesson_id: "09",
    lesson_title: "나를 소개하는 짧은 글 (A short self-introduction)",
    lesson_summary:
      "Now combine what you learned: greeting + name + country + one thing you like + a closing. This is your first paragraph.",
    assignment:
      "Write a 4–5 sentence self-introduction in Korean. Include: a greeting, your name, your country, one thing you like, and 만나서 반가워요.\n(인사·이름·나라·좋아하는 것·맺음말을 담아 4~5문장 자기소개 글.)",
    criteria: `C1: 인사로 시작하고 맺음말로 끝나는가
C2: 이름·나라·좋아하는 것 세 정보를 모두 담았는가
C3: 문장이 4개 이상이고 각 문장이 완결되는가
C4: '저는 ~이에요', 현재형 등 배운 문형을 사용했는가`,
    pass_rule: "C1·C2·C3 충족, C4 확인",
    not_evaluated: "조사 미세 오류, 어휘 다양성, 존댓말 등급",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    track: "l2", stage: 101, lesson_num: 10, lesson_id: "10",
    lesson_title: "내 하루 쓰기 (Writing about my day)",
    lesson_summary:
      "Describe your day in order using time words: 아침에(morning), 점심에(noon), 저녁에(evening) + present tense.",
    assignment:
      "Write 5 sentences about your day in order, using 아침에 / 점심에 / 저녁에 and present tense. Example: 아침에 밥을 먹어요. 점심에 친구를 만나요.\n(아침·점심·저녁 순서로 하루를 5문장으로.)",
    criteria: `C1: 시간 표현(아침에/점심에/저녁에 등)을 2개 이상 사용했는가
C2: 현재형 서술어로 5문장을 썼는가
C3: 시간 순서가 자연스럽게 이어지는가`,
    pass_rule: "C1·C2 충족, C3 확인",
    not_evaluated: "조사 세부, 불규칙 활용, 어휘 난이도",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    track: "l2", stage: 101, lesson_num: 11, lesson_id: "11",
    lesson_title: "복습 — 자유 주제 짧은 글 (Review: free writing)",
    lesson_summary:
      "Bring it all together. Pick any topic (my family, my hobby, my town) and write a short paragraph using what you learned.",
    assignment:
      "Choose one topic — my family / my hobby / my favorite food — and write 5–6 Korean sentences about it. Use markers (은/는, 을/를) and present tense.\n(가족·취미·좋아하는 음식 중 하나로 5~6문장 짧은 글.)",
    criteria: `C1: 하나의 주제로 5문장 이상 썼는가
C2: 조사(은/는, 이/가, 을/를)를 대체로 바르게 썼는가
C3: 현재형 서술어를 일관되게 사용했는가
C4: 문장들이 한 주제로 모이는가`,
    pass_rule: "C1·C4 충족 + C2·C3 확인",
    not_evaluated: "고급 문법, 어휘 다양성, 존댓말 등급",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    track: "l2", stage: 101, lesson_num: 12, lesson_id: "12",
    lesson_title: "초급 1 최종 과제 (Final task — rubric)",
    lesson_summary:
      "Show everything you can do: a self-introduction paragraph that a Korean reader can fully understand.",
    assignment:
      "Write a 6–8 sentence introduction of yourself in Korean: greeting, name, country, age or job, one thing you like and why, your daily routine, and a closing. Use markers, present tense, and time words.\n(인사·이름·나라·나이나 직업·좋아하는 것과 이유·하루 일과·맺음말을 담아 6~8문장.)",
    criteria: `C1(구성): 인사–소개–좋아하는 것–일과–맺음말 흐름이 있는가
C2(문형): '저는 ~이에요', 현재형 ~아요/어요를 바르게 썼는가
C3(조사): 은/는, 이/가, 을/를, 에/에서를 대체로 정확히 썼는가
C4(내용): 요구된 정보(이름·나라·좋아하는 것·이유·일과)를 모두 담았는가
C5(분량): 완결된 문장 6개 이상인가`,
    pass_rule: "C1·C4·C5 충족 + C2·C3 각 70% 이상 정확 → 초급 2 진급 또는 기존 진단 편입",
    not_evaluated: "존댓말 등급 세부, 고급 어휘, 불규칙 활용 완벽성",
    model: SONNET, max_tokens: 1800, is_rubric: true,
  },
];
