import type { LessonConfig } from "../types";

const HAIKU = "claude-haiku-4-5-20251001";
const SONNET = "claude-sonnet-4-6";

export const stage4Lessons: LessonConfig[] = [
  {
    stage: 4, lesson_num: 1, lesson_id: "01",
    lesson_title: "설명문이란 무엇인가",
    lesson_summary: "설명문 = 사실 정보 전달. 주장문 = 설득. 설명문에는 '나는 생각한다', '해야 한다' 같은 의견 표현 없음. 어조: 객관적, 중립적.",
    assignment: "내가 잘 아는 것(게임, 요리, 운동, 취미 등) 하나를 설명하는 문장 5개 쓰기. 내 의견 없이 사실만 전달.",
    criteria: `C1: 5개의 문장이 있는가
C2: '나는 생각한다', '~해야 한다', '~이 좋다' 같은 주관적 표현이 없는가
C3: 모든 문장이 사실 정보를 담고 있는가 (의견, 감정 아님)
C4: 각 문장에 주어와 서술어가 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "설명 방법, 단락 구조, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 4, lesson_num: 2, lesson_id: "02",
    lesson_title: "설명 방법 — 정의와 예시",
    lesson_summary: "정의 설명: '~란 ~이다', '~를 ~라고 한다'. 예시 설명: '예를 들어', '대표적으로'. 좋은 설명문은 정의 + 예시를 함께 사용.",
    assignment: "내 친구에게 설명한다고 생각하고 '○○이란 무엇인가' 주제로 1단락 쓰기. 정의 문장 1개 이상 + 예시 1개 이상 포함.",
    criteria: `C1: 정의 문장('~란 ~이다' 또는 '~를 ~라고 한다' 형태)이 1개 이상 있는가
C2: 예시 설명('예를 들어', '대표적으로' 등 신호어 사용 또는 예시가 명확함)이 1개 이상 있는가
C3: 정의와 예시가 자연스럽게 연결되어 있는가
C4: 주관적 표현('나는 좋아한다', '해야 한다' 등)이 없는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "단락 구조, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 4, lesson_num: 3, lesson_id: "03",
    lesson_title: "설명 방법 — 비교·대조",
    lesson_summary: "비교: 공통점 설명 ('공통적으로', '~와 마찬가지로'). 대조: 차이점 설명 ('~와 달리', '반면에'). 두 대상이 균형 있게 다루어져야 함.",
    assignment: "자유 주제로 비교·대조 단락 1개 쓰기. 공통점 1개 이상 + 차이점 2개 이상. 신호어(~와 달리/반면에/공통적으로 등) 사용 필수.",
    criteria: `C1: 두 대상이 비교·대조되고 있는가
C2: 공통점이 1개 이상 설명되어 있는가
C3: 차이점이 2개 이상 설명되어 있는가
C4: '~와 달리', '반면에', '공통적으로' 등 비교·대조 신호어가 1개 이상 사용되었는가
C5: 두 대상이 균형 있게 (한쪽만 편중되지 않게) 다루어졌는가`,
    pass_rule: "C1~C5 모두 충족",
    not_evaluated: "단락 구조, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 4, lesson_num: 4, lesson_id: "04",
    lesson_title: "설명 방법 — 원인·결과",
    lesson_summary: "원인 신호어: '왜냐하면', '~때문에'. 결과 신호어: '그 결과', '따라서', '그래서'. 원인과 결과가 논리적으로 연결되어야 함.",
    assignment: "원인·결과 구조로 설명하는 단락 1개 쓰기. 예: 미세먼지의 원인과 영향, 규칙적 운동의 효과, 수면 부족의 결과 등.",
    criteria: `C1: 원인 신호어('왜냐하면', '~때문에', '~의 원인은' 등)가 1개 이상 있는가
C2: 결과 신호어('그 결과', '따라서', '그래서', '~하게 된다' 등)가 1개 이상 있는가
C3: 원인과 결과가 논리적으로 연결되어 있는가 (원인이 그 결과를 타당하게 설명하는가)
C4: 주관적 의견 없이 사실 정보로 설명하는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "단락 구조, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 4, lesson_num: 5, lesson_id: "05",
    lesson_title: "설명 방법 — 순서·절차",
    lesson_summary: "순서 신호어: '먼저', '다음으로', '그 다음', '마지막으로'. 절차 글은 단계가 정확한 순서대로 있어야 함. 빠진 단계 없는지 확인.",
    assignment: "내가 좋아하는 음식 만드는 법을 절차 설명으로 쓰기 (5단계 이상). '먼저', '다음으로', '마지막으로' 등 순서 신호어 반드시 사용.",
    criteria: `C1: 5단계 이상의 절차가 있는가
C2: '먼저', '다음으로', '마지막으로' 등 순서 신호어가 3개 이상 사용되었는가
C3: 단계들이 논리적 순서로 배열되어 있는가 (빠진 중요한 단계가 없는가)
C4: 각 단계가 구체적인 행동으로 설명되어 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 4, lesson_num: 6, lesson_id: "06",
    lesson_title: "설명 방법 혼합하기",
    lesson_summary: "좋은 설명문은 여러 방법을 혼합한다. 5가지 방법(정의/예시/비교·대조/원인·결과/순서·절차) 중 2가지 이상 혼합. 각 방법의 신호어 사용.",
    assignment: "자유 주제로 설명 방법 2가지 이상 혼합한 단락 2개 작성. 어떤 방법을 사용했는지 각 단락 아래에 한 줄씩 메모.",
    criteria: `C1: 2개의 단락이 있는가
C2: 전체에서 설명 방법이 2가지 이상 사용되었는가 (정의/예시/비교·대조/원인·결과/순서·절차 중)
C3: 각 방법에 해당하는 신호어가 1개 이상 사용되었는가
C4: 사용한 설명 방법을 표시한 메모가 있는가
C5: 주관적 의견 없이 사실 정보로 설명하는가`,
    pass_rule: "C1~C5 모두 충족",
    not_evaluated: "출처 표기, 맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 4, lesson_num: 7, lesson_id: "07",
    lesson_title: "전문 용어 쉽게 쓰기",
    lesson_summary: "전문 용어를 모르는 독자를 위해 쉽게 풀어써야 함. 방법: 정의 삽입 ('~란 ~이다') 또는 괄호 설명 ('~(쉬운 말로)'). 어려운 말이 있으면 설명이 실패.",
    assignment: "지금까지 쓴 설명 단락 중 하나를 골라 전문 용어나 어려운 단어를 모두 찾아 쉽게 풀어쓰기. 수정 전/후 나란히 제출.",
    criteria: `C1: 수정된 단락이 제출되었는가
C2: 전문 용어나 어려운 단어를 쉽게 풀어쓴 부분이 1개 이상 있는가
C3: 풀어쓰기 방법으로 정의 삽입('~란 ~이다') 또는 괄호 설명이 사용되었는가
C4: 수정 후에도 원래 설명 내용의 정확성이 유지되는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 4, lesson_num: 8, lesson_id: "08",
    lesson_title: "조사하고 인용하기",
    lesson_summary: "출처 표기 형식: '책 제목, 저자, 연도' 또는 '출처: ~'. 패러프레이징: 원문의 의미를 유지하면서 자신의 말로 바꾸어 쓰기. 그대로 옮기면 표절.",
    assignment: "관심 주제 하나를 조사하고 출처 1개 이상을 포함한 설명 단락 쓰기. 원문을 그대로 옮기지 않고 자신의 말로 바꾸어 쓰기.",
    criteria: `C1: 출처 표기가 1개 이상 있는가 (출처: ~, 또는 책/사이트 이름이라도 있는가)
C2: 출처가 있는 내용이 그대로 복사하지 않고 자신의 말로 바꾸어 쓰였는가
C3: 설명 내용이 사실 정보를 담고 있는가
C4: 전체적으로 설명문 어조를 유지하는가 (주관적 의견 최소화)`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "출처 형식의 완벽성 (책 이름 정도면 충분), 맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 4, lesson_num: 9, lesson_id: "09",
    lesson_title: "조사 보고서 계획",
    lesson_summary: "설명문 전체 계획: 주제 → 3부 구조 → 각 부분에서 사용할 설명 방법 → 조사할 내용. 계획이 탄탄하면 글쓰기가 쉬워진다.",
    assignment: "설명문 전체 계획표 완성. 주제 선정 + 조사할 내용 3가지 + 각 내용에 사용할 설명 방법 + 출처 계획.",
    criteria: `C1: 설명문 주제가 있는가
C2: 조사할 내용이 3가지 있는가
C3: 각 내용에 사용할 설명 방법(정의/예시/비교·대조/원인·결과/순서·절차)이 결정되어 있는가
C4: 출처를 어디서 찾을지 계획이 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "실제 글쓰기 (차시10에서 작성)",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 4, lesson_num: 10, lesson_id: "10",
    lesson_title: "설명문 초안 쓰기",
    lesson_summary: "설명문 초안: 서론-본론-결론 3부 구조. 설명 방법 2가지 이상 혼합. 출처 1개 이상 포함. 600자 이상.",
    assignment: "설명문 초안 쓰기 (600자 이상). 3부 구조(서론+본론+결론) + 설명 방법 2가지 이상 + 출처 1개 이상.",
    criteria: `C1: 서론-본론-결론 3부 구조가 있는가
C2: 설명 방법이 2가지 이상 사용되었는가
C3: 출처 표기가 1개 이상 있는가
C4: 주관적 의견 없이 사실 정보 전달 위주인가
C5: 600자 이상인가`,
    pass_rule: "C1~C5 모두 충족",
    not_evaluated: "전문 용어 풀이 점검 (차시11에서 퇴고)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 4, lesson_num: 11, lesson_id: "11",
    lesson_title: "설명문 퇴고하기",
    lesson_summary: "설명문 퇴고 체크포인트: 의견이 사실처럼 쓰인 곳 없는가 / 전문 용어가 풀어졌는가 / 단락 간 연결이 자연스러운가 / 출처가 있는가.",
    assignment: "설명문 초안을 스스로 점검하고 수정하기. AI 피드백 + 자기 점검 기반으로 수정본 제출. 수정 전/후 비교 메모 (무엇을 왜 수정했는지) 필수.",
    criteria: `C1: 수정된 설명문이 있는가
C2: 수정 메모가 있는가
C3: 수정 후 주관적 의견이 줄거나 제거되었는가
C4: 수정 후 전문 용어 풀이 또는 설명이 개선되었는가`,
    pass_rule: "C1·C2 필수, C3·C4 중 하나 이상 개선됨",
    not_evaluated: "완성도 (차시13 최종 과제에서 평가)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 4, lesson_num: 12, lesson_id: "12",
    lesson_title: "최종 과제 계획",
    lesson_summary: "4단계 종합 복습. 최종 설명문 계획표: 주제, 독자, 3부 구조, 설명 방법 2가지 이상, 출처 계획.",
    assignment: "자유 주제로 최종 설명문 계획표 완성. 주제 + 독자 설정 + 3부 구조 계획 + 사용할 설명 방법 2가지 이상 + 출처 계획.",
    criteria: `C1: 주제와 독자(누구에게 설명할 것인가)가 있는가
C2: 3부 구조(서론/본론/결론) 계획이 있는가
C3: 사용할 설명 방법이 2가지 이상 계획되어 있는가
C4: 출처 계획(어디서 정보를 얻을지)이 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "실제 글쓰기 완성도 (차시13에서 평가)",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 4, lesson_num: 13, lesson_id: "13",
    lesson_title: "최종 과제 — 루브릭 종합 평가",
    lesson_summary: "4단계 전체 복습 후 최종 설명문 작성. 루브릭 5항목 × 4점 = 20점 만점. 15점 이상 5단계 진급.",
    assignment: "자유 주제로 설명문 완성 (700자 이상). 3부 구조 + 설명 방법 2가지 이상 혼합 + 전문 용어 풀이 + 출처 1개 이상.",
    criteria: `R1: 객관성(4점) — 사실 정보 전달, 의견·감정 최소화
R2: 설명 방법(4점) — 5가지 중 2가지 이상 적절히 혼합, 신호어 사용
R3: 정보 신뢰성(4점) — 출처 표기 있음, 내용이 사실 기반
R4: 독자 고려(4점) — 전문 용어를 쉽게 풀어썼는가, 독자 수준 맞춤
R5: 분량·구조(4점) — 700자 이상, 3부 구조 명확`,
    pass_rule: "총점 15점 이상 합격. 각 항목 점수 합 = total과 반드시 일치.",
    not_evaluated: "없음",
    model: SONNET, max_tokens: 1400, is_rubric: true,
  },
];
