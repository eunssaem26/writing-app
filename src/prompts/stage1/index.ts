import type { LessonConfig } from "../types";

const HAIKU = "claude-haiku-4-5-20251001";
const SONNET = "claude-sonnet-4-6";

export const stage1Lessons: LessonConfig[] = [
  {
    stage: 1, lesson_num: 1, lesson_id: "01",
    lesson_title: "문장이란 무엇인가",
    lesson_summary: "완전한 문장 = 주어 + 서술어. 주어는 반드시 명시. 문장 끝에 마침표.",
    assignment: "오늘 있었던 일 3가지를 각각 완전한 문장 1개로 쓰기",
    criteria: `C1: 각 문장에 주어가 명시적으로 있는가
C2: 각 문장에 서술어가 있는가
C3: 각 문장 끝에 마침표가 있는가`,
    pass_rule: "3문장 모두 C1·C2·C3 충족",
    not_evaluated: "육하원칙, 맞춤법, 문장 부호 종류, 감정 표현",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 1, lesson_num: 2, lesson_id: "02",
    lesson_title: "문장을 풍부하게 만들기",
    lesson_summary: "육하원칙 6가지(누가/언제/어디서/무엇을/어떻게/왜). 기본 문장에 2~3개 요소 추가.",
    assignment: "오늘 먹은 음식에 대해 육하원칙이 담긴 문장 3개 쓰기",
    criteria: `C1: 각 문장에 주어가 명시적으로 있는가
C2: 각 문장에 서술어가 있는가
C3: 각 문장에 육하원칙 요소가 2개 이상 포함되는가 (언제/어디서/누구와/무엇을/어떻게/왜 중 2개)
C4: 정보를 나열했을 때 문장이 자연스럽게 읽히는가`,
    pass_rule: "3문장 모두 C1·C2·C3 충족, C4 어색한 나열 없음",
    not_evaluated: "문장 부호 종류, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 1, lesson_num: 3, lesson_id: "03",
    lesson_title: "문장 부호 바르게 쓰기",
    lesson_summary: "마침표(.): 일반 문장. 물음표(?): 질문. 느낌표(!): 감탄/강한 감정. 쉼표(,): 나열/숨 쉬는 곳.",
    assignment: "가장 궁금했던 것 질문 문장 2개(?), 가장 기쁘거나 놀랐던 것 느낌 문장 2개(!) 총 4문장",
    criteria: `C1: 질문 문장 2개 끝에 물음표(?)가 있는가
C2: 느낌 문장 2개 끝에 느낌표(!)가 있는가
C3: 나열하는 부분이 있다면 쉼표(,)가 있는가
C4: 각 문장에 주어와 서술어가 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "맞춤법, 띄어쓰기",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 1, lesson_num: 4, lesson_id: "04",
    lesson_title: "맞춤법과 띄어쓰기 기초",
    lesson_summary: "됐다/됬다, 며칠/몇일, 안 했다(띄어쓰기), 오랜만에/오랫만에, 왠지/웬지",
    assignment: "어제 한 일을 4문장으로 쓰기 (맞춤법·띄어쓰기 집중)",
    criteria: `C1: "됬" → "됐" 오류 여부
C2: "몇일" → "며칠" 오류 여부
C3: "안했다", "못갔다" 등 붙여쓰기 오류 여부
C4: "오랫만에" → "오랜만에" 오류 여부
C5: "웬지" → "왠지" 오류 여부
C6: 단어와 단어 사이 기본 띄어쓰기 누락 여부`,
    pass_rule: "4문장 중 위 오류 합산 2개 이하",
    not_evaluated: "감정 표현, 육하원칙",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 1, lesson_num: 5, lesson_id: "05",
    lesson_title: "관찰 일지 쓰기",
    lesson_summary: "5감(시각·청각·후각·촉각·미각) 활용. '예쁘다' 대신 색깔·모양·소리로 구체적으로.",
    assignment: "식물, 동물, 날씨, 음식 중 자유 선택하여 관찰 일지 쓰기 (5문장 이상)",
    criteria: `C1: 5문장 이상인가
C2: 모든 문장에 주어와 서술어가 있는가
C3: 시각 외 다른 감각 표현이 1개 이상 있는가
C4: "예쁘다", "좋다"처럼 막연한 형용사에 의존하지 않고 색깔·모양·소리·냄새 등 구체적 묘사가 2개 이상 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "감정 표현, 비교 표현",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 1, lesson_num: 6, lesson_id: "06",
    lesson_title: "일기 구조 배우기",
    lesson_summary: "일기 3구성: 날짜·날씨 / 있었던 일 / 느낌·생각. 느낌·생각이 있어야 진짜 일기.",
    assignment: "일기 계획표를 바탕으로 일기 초안 쓰기 (6문장 이상)",
    criteria: `C1: 6문장 이상인가
C2: 모든 문장에 주어와 서술어가 있는가 (일기이므로 '나는/내가' 생략 가능. 다른 사람·사물이 주체인 문장은 주어 명시 필요)
C3: 있었던 일이 구체적으로 담겨 있는가 (육하원칙 요소 1개 이상)
C4: 느낌이나 생각이 담긴 문장이 1개 이상 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "감정 간접 표현(차시07에서 다룸)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 1, lesson_num: 7, lesson_id: "07",
    lesson_title: "일기 — 느낌 표현하기",
    lesson_summary: "직접 표현(Tell): '기뻤다' / 간접 표현(Show): '심장이 두근거렸다'. 간접 표현이 더 생생함.",
    assignment: "오늘 일기에서 감정이 드러나는 문장을 3개 이상 포함해 일기 쓰기",
    criteria: `C1: 모든 문장에 주어와 서술어가 있는가 (일기이므로 '나는/내가' 생략 가능. 다른 사람·사물이 주체인 문장은 주어 명시 필요)
C2: 감정을 몸의 반응이나 행동으로 표현한 문장이 1개 이상 있는가
C3: "기뻤다", "슬펐다", "좋았다" 수준의 직접 표현이 3개 이상인가 (3개 이상이면 불합격)`,
    pass_rule: "C1·C2 충족, C3 위반 없음 (직접 표현 2개 이하여야 합격)",
    not_evaluated: "맞춤법, 육하원칙",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 1, lesson_num: 8, lesson_id: "08",
    lesson_title: "일기 — 자유 일기",
    lesson_summary: "차시01~07 종합. 일기 3구성 + 감정 간접 표현(몸의 반응).",
    assignment: "자유 주제 일기 (8문장 이상). 완전한 문장, 구체성, 문장 부호, 맞춤법, 느낌 표현 모두 적용.",
    criteria: `C1: 문장 수가 8개 이상인가 — 줄 수를 세면 됩니다. 날짜·날씨 유무와 무관합니다.
C2: 모든 문장에 주어와 서술어가 있는가 — 일기이므로 '나는/내가' 생략 가능. 다른 사람·사물이 주체인 문장은 주어 명시 필요. "비가 왔다"에서 "비가"가 주어, "기분이 좋았다"에서 "기분이"가 주어입니다.
C3: 있었던 일이 구체적인가 (육하원칙 요소 2개 이상)
C4: 감정 간접 표현(몸의 반응)이 1개 이상 있는가 — 직접 표현이 일부 있어도 몸의 반응 1개 이상이면 충족
C5: 문장 부호(마침표/물음표/느낌표)가 올바르게 쓰였는가
C6: 명백한 맞춤법 오류가 3개 이하인가`,
    pass_rule: "C1~C6 모두 충족. C1은 날짜·날씨·구성 여부와 무관하게 문장 수(8개)만 셉니다.",
    not_evaluated: "없음 (차시01~07 전체 복습)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 1, lesson_num: 9, lesson_id: "09",
    lesson_title: "5감으로 관찰하기",
    lesson_summary: "차시05 심화. 5감(시각·청각·후각·촉각·미각) 중 3가지 이상. 각 감각을 구체적 표현으로.",
    assignment: "5감 중 3가지 이상을 사용한 관찰 일지 쓰기 (6문장 이상)",
    criteria: `C1: 6문장 이상인가
C2: 모든 문장에 주어와 서술어가 있는가
C3: 사용한 감각이 3가지 이상인가
C4: 각 감각 표현이 구체적인가 (좋은 예: "바스락바스락 소리가 났다" / 나쁜 예: "소리가 났다")`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "감정 표현, 비교 표현",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 1, lesson_num: 10, lesson_id: "10",
    lesson_title: "변화 관찰하기",
    lesson_summary: "같은 대상을 이틀 관찰. 비교 표현: '어제는 ~였는데, 오늘은 ~이다'",
    assignment: "같은 대상을 이틀 관찰한 내용을 비교해서 쓰기 (6문장 이상)",
    criteria: `C1: 6문장 이상인가
C2: 모든 문장에 주어와 서술어가 있는가
C3: 두 시점(어제/오늘)이 모두 구체적으로 기록되었는가
C4: "어제는 ~였는데 오늘은 ~" 같은 비교 표현이 1개 이상 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "감정 표현",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 1, lesson_num: 11, lesson_id: "11",
    lesson_title: "관찰 일지 완성",
    lesson_summary: "차시09~10 통합. 5감 3가지 이상 + 변화 비교 표현.",
    assignment: "최종 관찰 일지 (6문장 이상). 조건: 5감 3가지 이상 + 변화 비교 표현 1개 이상",
    criteria: `C1: 6문장 이상인가
C2: 모든 문장에 주어와 서술어가 있는가
C3: 5감 중 3가지 이상 사용, 각 표현이 구체적인가
C4: 비교 표현이 1개 이상 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "없음",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 1, lesson_num: 12, lesson_id: "12",
    lesson_title: "최종 과제 — 루브릭 종합 평가",
    lesson_summary: "1단계 전체 복습 후 최종 일기 작성. 루브릭 5항목 × 4점 = 20점 만점.",
    assignment: "자유 주제 일기 (8문장 이상)",
    criteria: `R1: 유창성(4점) — 8문장 이상, 자연스러운 흐름 (일기이므로 '나는/내가' 생략된 문장도 유창성 감점 없음)
R2: 구조(4점) — 날짜·날씨, 있었던 일, 느낌·생각, 마무리
R3: 내용(4점) — 육하원칙 요소 수, 구체성
R4: 어휘/표현(4점) — 감정 간접 표현, 감각 표현
R5: 관례(4점) — 맞춤법·띄어쓰기·문장부호 오류 수`,
    pass_rule: "총점 14점 이상 합격. 각 항목 점수 합 = total과 반드시 일치.",
    not_evaluated: "없음",
    model: SONNET, max_tokens: 1400, is_rubric: true,
  },
];
