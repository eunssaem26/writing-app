import type { LessonConfig } from "../types";

const HAIKU = "claude-haiku-4-5-20251001";
const SONNET = "claude-sonnet-4-6";

export const stage6Lessons: LessonConfig[] = [
  {
    stage: 6, lesson_num: 1, lesson_id: "01",
    lesson_title: "주장과 의견의 차이",
    lesson_summary: "의견: '나는 고양이가 좋다' (반박 불필요). 주장: '학교에서 동물을 키워야 한다' (근거 필요, 반박 가능). 주장은 반박 가능한 구체적인 하나의 입장.",
    assignment: "내가 강하게 믿는 것 3가지를 주장 형태로 쓰기. 각 주장이 반박 가능한 형태인지 확인 (모든 사람이 동의하면 주장 아님).",
    criteria: `C1: 3가지 주장이 있는가
C2: 각 주장이 하나의 구체적인 입장을 담고 있는가
C3: 각 주장이 반박 가능한 형태인가 (누군가 반대할 수 있는 주장인가)
C4: '~해야 한다', '~이 중요하다', '~이 옳다' 등 주장 형태의 표현이 사용되었는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "근거, 증거, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 6, lesson_num: 2, lesson_id: "02",
    lesson_title: "근거 찾기와 평가하기",
    lesson_summary: "좋은 근거의 3조건: 타당성(주장과 연결), 신뢰성(믿을 수 있는 출처), 관련성(맥락에 맞음). 좋은 근거: 통계/연구/전문가/실제 사례. 나쁜 근거: '내 친구도 그렇다', '다들 그렇게 한다'.",
    assignment: "차시 1에서 쓴 주장 중 하나를 골라 근거 3개 찾기. 각 근거 옆에 강도 평가 (강/보통/약) + 강도 이유를 한 줄씩 메모.",
    criteria: `C1: 주장이 명확한가
C2: 근거가 3개 있는가
C3: 각 근거에 강도 평가와 이유 메모가 있는가
C4: 3개 근거 중 통계, 연구 결과, 실제 사례 중 1개 이상이 포함되어 있는가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "ARE 단락 구조 (차시03에서), 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 6, lesson_num: 3, lesson_id: "03",
    lesson_title: "ARE 단락 구조",
    lesson_summary: "ARE 모델: A(Assertion 주장) → R(Reason 이유) → E(Evidence 증거). 이 순서로 한 단락을 쓰면 논거 단락이 완성됨.",
    assignment: "ARE 구조로 근거 단락 1개 작성. 주장 문장 + 이유 문장 + 증거(통계/사례/전문가 의견).",
    criteria: `C1: A(주장) 문장이 있는가
C2: R(이유) 문장이 있는가
C3: E(증거) — 통계, 사례, 또는 구체적 예시가 있는가
C4: A-R-E가 논리적으로 연결되는가 (이유가 주장을 뒷받침하고, 증거가 이유를 뒷받침하는가)`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "반박 고려(차시05에서), 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 6, lesson_num: 4, lesson_id: "04",
    lesson_title: "ARE 단락 심화",
    lesson_summary: "증거의 종류: 통계·연구 결과 (가장 강함), 전문가 의견, 실제 사례, 역사적 사실. 근거 단락은 2개가 기본 — 더 다양한 증거로 설득력을 높인다.",
    assignment: "ARE 구조로 근거 단락 2개 작성. 단락 1: 통계 또는 연구 결과 사용. 단락 2: 실제 사례 또는 경험 사용.",
    criteria: `C1: 2개의 ARE 단락이 있는가
C2: 단락 1에 통계 또는 연구 결과가 포함되어 있는가 (구체적 수치 없어도 '연구에 따르면' 형태면 인정)
C3: 단락 2에 실제 사례 또는 경험이 포함되어 있는가
C4: 각 단락에서 A-R-E 흐름이 자연스럽게 연결되는가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "반박 고려, 맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 6, lesson_num: 5, lesson_id: "05",
    lesson_title: "반박 고려하기",
    lesson_summary: "반박 고려 구조: '비록 ~라는 주장도 있다. 그러나 ~때문에 ~이다.' 반대 의견을 일부러 약하게 만들면 오히려 신뢰를 잃음. 공정하게 인정 후 재반박.",
    assignment: "반박 고려 단락 작성. '비록 ~ 측 주장처럼 ~ 이지만, ~ 때문에 ~이다' 구조 사용. 반대 의견을 공정하게 제시하고 구체적인 이유로 재반박.",
    criteria: `C1: 반대 측 주장이 공정하게 제시되어 있는가 (일부러 약하게 만들지 않았는가)
C2: '비록 ~ 이지만', '그러나', '하지만' 등 양보-반박 구조가 사용되었는가
C3: 재반박에 구체적인 이유나 증거가 포함되어 있는가
C4: 재반박이 원래 주장과 연결되는가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "논리적 오류(차시06에서), 맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 6, lesson_num: 6, lesson_id: "06",
    lesson_title: "논리적 오류 피하기",
    lesson_summary: "피해야 할 논리적 오류 4가지: ①일반화 오류('내 친구가 그러니 모두 그렇다') ②거짓 선택지('이 법을 안 지지하면 환경 파괴자') ③감정 호소(논리 없이) ④권위에 호소('유명인이 말했으니').",
    assignment: "지금까지 쓴 글에서 논리적 오류가 있는지 스스로 점검하고 수정하기. 발견한 오류 유형 이름과 수정 내용을 나란히 제출.",
    criteria: `C1: 수정된 글이 있는가
C2: 발견한 오류 유형 이름(일반화/거짓 선택지/감정 호소/권위 호소 중)이 표시되어 있는가
C3: 수정 후 논리적 오류가 없거나 줄었는가
C4: 수정 후에도 원래 주장의 의미가 유지되는가`,
    pass_rule: "C1·C2 필수, C3·C4 확인",
    not_evaluated: "맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 6, lesson_num: 7, lesson_id: "07",
    lesson_title: "논설문 계획하기",
    lesson_summary: "5단 논증 구조: 1도입(이슈+입장) → 2근거1(ARE, 가장 강한 것) → 3근거2(ARE) → 4반박 고려 → 5결론(주장 재확인+행동 촉구).",
    assignment: "논설문 주제 선정 후 5단 구조 계획표 완성. 주장 한 문장 + 근거 2개(통계·사례 포함 계획) + 반박 고려 + 결론 핵심.",
    criteria: `C1: 주장이 한 문장으로 명확하게 있는가
C2: 근거 2개가 계획되어 있는가 (각각 어떤 증거를 사용할지)
C3: 반박 고려 계획이 있는가 (어떤 반대 의견을 다룰지)
C4: 결론에서 무엇을 할지 계획이 있는가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "실제 글쓰기 (차시08부터)",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 6, lesson_num: 8, lesson_id: "08",
    lesson_title: "논설문 초안 1 — 도입·근거",
    lesson_summary: "도입부: 이슈 제시 + 내 입장 선언. 근거 단락: ARE 구조. 600자 이상.",
    assignment: "논설문 초안 1부 작성 (600자 이상): 도입(이슈+입장 선언) + 근거 단락 2개(ARE 구조).",
    criteria: `C1: 도입에 이슈 제시와 내 입장 선언이 있는가
C2: 근거 단락 2개가 있는가
C3: 각 근거 단락에 ARE(주장-이유-증거) 흐름이 있는가
C4: 600자 이상인가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "반박 고려·결론 (차시09에서), 맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 6, lesson_num: 9, lesson_id: "09",
    lesson_title: "논설문 초안 2 — 반박·결론",
    lesson_summary: "반박 고려 단락 + 결론 추가. 결론: 주장 재확인 + 독자에게 행동 촉구. 전체 1000자 이상.",
    assignment: "도입·근거에 반박 고려 단락과 결론 추가해 논설문 전체 완성 (전체 1000자 이상). 결론에서 주장을 재확인하고 독자에게 요청.",
    criteria: `C1: 반박 고려 단락이 있는가 (반대 의견 + 재반박)
C2: 결론이 있는가
C3: 결론에서 주장이 재확인되고 독자에게 행동 촉구 또는 메시지가 있는가
C4: 전체 1000자 이상인가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "맞춤법 (차시11에서)",
    model: SONNET, max_tokens: 1800, is_rubric: false,
  },
  {
    stage: 6, lesson_num: 10, lesson_id: "10",
    lesson_title: "논설문 퇴고 — 논리 점검",
    lesson_summary: "논설문 논리 퇴고 체크포인트: 주장이 처음부터 끝까지 일관한가? / 근거에 증거가 있는가? / 반박 고려가 공정한가? / 논리적 오류가 없는가?",
    assignment: "논설문의 논리를 스스로 점검하고 수정하기. 점검 질문 4가지를 체크하고 수정 내용을 메모해서 함께 제출.",
    criteria: `C1: 수정된 논설문이 있는가
C2: 점검 메모가 있는가 (논리 점검 4가지 중 확인한 것들)
C3: 수정 후 주장이 일관한가 (도입과 결론의 주장이 같은가)
C4: 수정 후 논리적 오류가 없거나 줄었는가`,
    pass_rule: "C1·C2 필수, C3·C4 확인",
    not_evaluated: "맞춤법·어휘 (차시11에서)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 6, lesson_num: 11, lesson_id: "11",
    lesson_title: "논설문 퇴고 — 문장·어휘",
    lesson_summary: "논증 신호어 점검: '왜냐하면', '따라서', '그 결과', '비록 ~ 이지만', '그러므로'. 신호어가 자연스럽지 않으면 논증 흐름이 끊김.",
    assignment: "논설문에서 논증 신호어가 자연스럽게 쓰였는지 점검하고 어색한 문장을 수정하기. 수정 전/후 나란히 제출.",
    criteria: `C1: 수정된 논설문이 있는가
C2: 논증 신호어(왜냐하면/따라서/비록~이지만/그러므로 등)가 적절히 사용되었는가
C3: 어색하게 읽히는 문장이 수정되었는가
C4: 수정 후에도 주장의 의미가 유지되는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "내용·논리 (차시10에서 완료)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 6, lesson_num: 12, lesson_id: "12",
    lesson_title: "최종 과제 계획",
    lesson_summary: "6단계 종합 복습. 최종 논설문 계획: 주장 + 5단 구조 + ARE 근거 2개 + 반박 고려 + 증거 출처 계획.",
    assignment: "자유 주제로 최종 논설문 계획표 완성. 주장(한 문장) + 5단 구조 계획 + 근거 2개(사용할 증거 유형 결정) + 반박 고려 계획.",
    criteria: `C1: 주장이 한 문장으로 명확하게 있는가 (반박 가능한 형태)
C2: 5단 구조(도입/근거1/근거2/반박고려/결론) 계획이 있는가
C3: 근거 2개에 각각 사용할 증거 유형(통계/사례/전문가 중)이 결정되어 있는가
C4: 반박 고려에서 어떤 반대 의견을 다룰지 계획이 있는가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "실제 글쓰기 완성도 (차시13에서 평가)",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 6, lesson_num: 13, lesson_id: "13",
    lesson_title: "최종 과제 — 루브릭 종합 평가",
    lesson_summary: "6단계 전체 복습 후 최종 논설문 작성. 루브릭 5항목 × 4점 = 20점 만점. 16점 이상 7단계 진급.",
    assignment: "자유 주제로 논설문 완성 (1100자 이상). 조건: 5단 구조, ARE 구조 근거 2개, 반박 고려 포함, 논리적 오류 없음.",
    criteria: `R1: 주장 명확성(4점) — 처음부터 끝까지 일관된 명확한 주장
R2: 근거의 질(4점) — 근거 2개, 각각 통계·사례·전문가 등 증거 포함
R3: 반박 고려(4점) — 공정한 반대 의견 제시 + 효과적 재반박
R4: 논리 오류(4점) — 오류 없음(4점) / 1개(3점) / 2개(2점) / 3개 이상(1점)
R5: 분량·구조(4점) — 1100자 이상, 5단 구조 완성`,
    pass_rule: "총점 16점 이상 합격. 각 항목 점수 합 = total과 반드시 일치.",
    not_evaluated: "없음",
    model: SONNET, max_tokens: 1800, is_rubric: true,
  },
];
