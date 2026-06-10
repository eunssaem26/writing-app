import type { LessonConfig } from "../types";

const HAIKU = "claude-haiku-4-5-20251001";
const SONNET = "claude-sonnet-4-6";

export const stage7Lessons: LessonConfig[] = [
  {
    stage: 7, lesson_num: 1, lesson_id: "01",
    lesson_title: "목적·독자·형식 결정하기",
    lesson_summary: "글쓰기 3축: 목적(정보 전달/설득/표현·공유/요청·제안) × 독자(누구인가) × 형식(설명문/논설문/에세이/칼럼/제안서). 세 가지가 일치할 때 좋은 글이 완성됨.",
    assignment: "내가 관심 있는 주제로 목적·독자·형식 결정하기. 3가지가 서로 일관성 있게 맞는지 확인 + 이 형식을 선택한 이유 설명.",
    criteria: `C1: 글의 목적(정보 전달/설득/표현·공유/요청·제안 중 하나)이 명확한가
C2: 독자가 구체적으로 설정되어 있는가 (누구인지)
C3: 형식(에세이/칼럼/제안서/설명문/논설문 등)이 결정되어 있는가
C4: 목적·독자·형식이 서로 일관성 있게 맞는가 (예: 설득 목적이면 논설문이나 제안서가 적절)
C5: 이 형식을 선택한 이유가 설명되어 있는가`,
    pass_rule: "C1~C5 모두 충족",
    not_evaluated: "실제 글쓰기, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 2, lesson_id: "02",
    lesson_title: "에세이 구조 배우기",
    lesson_summary: "에세이 4부 구조: ①도입 훅(독자 관심 끌기) ②경험·관찰(구체적 장면) ③의미 탐구(왜 의미 있는가) ④깨달음(통찰). 에세이 = 나를 탐구하는 글.",
    assignment: "에세이 주제 선정 + 4부 구조 계획표 작성. 주제 예: 나를 변화시킨 경험 / 내가 가진 편견 / 내가 확신하는 것.",
    criteria: `C1: 에세이 주제가 있는가 (나의 경험·생각·감정과 연관된 주제)
C2: 4부 구조(도입 훅/경험·관찰/의미 탐구/깨달음) 계획이 있는가
C3: 도입 훅에서 어떻게 독자의 관심을 끌지 계획이 있는가
C4: 의미 탐구 부분에서 경험이 왜 의미 있는지 생각이 있는가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "실제 집필 (차시03에서), 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 3, lesson_id: "03",
    lesson_title: "에세이 초안 쓰기",
    lesson_summary: "에세이 초안: 1000자 이상. Show 기법으로 경험 묘사, 진솔하고 구체적인 표현. 단순 사건 나열이 아닌 의미 탐구가 있어야 에세이.",
    assignment: "에세이 초안 쓰기 (1000자 이상). Show 기법 사용, 경험을 구체적 장면으로 묘사, 그 경험의 의미 탐구 포함.",
    criteria: `C1: 1000자 이상인가
C2: 경험이나 관찰이 구체적인 장면으로 묘사되어 있는가 (Show 기법 사용)
C3: 단순한 사건 나열이 아니라 그 경험의 의미를 탐구하는 내용이 있는가
C4: 글에서 필자의 진짜 생각이나 감정이 드러나는가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "퇴고 (차시04에서), 맞춤법",
    model: SONNET, max_tokens: 1800, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 4, lesson_id: "04",
    lesson_title: "에세이 4단계 퇴고",
    lesson_summary: "4단계 퇴고 순서: ①내용(빠진 것/불필요한 것) → ②구조(논리 순서/단락 구분) → ③문장(어색함/길이) → ④어휘(반복/더 정확한 단어). 순서대로 해야 효과적.",
    assignment: "에세이에 4단계 퇴고 직접 적용. 각 단계별 수정 내용 메모 필수. '어떤 수정이 가장 효과적이었나?' 100자 이내 성찰 작성.",
    criteria: `C1: 수정된 에세이가 있는가
C2: 4단계 퇴고 메모가 있는가 (내용/구조/문장/어휘 각 단계 확인)
C3: 수정 후 에세이가 원본보다 명확하거나 풍부해졌는가
C4: 100자 이내 성찰 글이 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "칼럼 (차시05부터)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 5, lesson_id: "05",
    lesson_title: "칼럼 초안 쓰기",
    lesson_summary: "칼럼 구조: 에피소드 도입 → 시사 이슈 연결 → 내 관점 전개 → 독자에게 제안. 논설문보다 부드러운 어조. 1000자.",
    assignment: "현재 관심 있는 사회 이슈로 칼럼 초안 쓰기 (1000자). 에피소드로 시작해 이슈와 연결, 내 관점 전개, 독자에게 제안으로 마무리.",
    criteria: `C1: 에피소드 또는 구체적 장면으로 시작하는가
C2: 시사 이슈와 연결되는가
C3: 필자의 관점이 드러나는가
C4: 독자에게 제안이나 메시지로 마무리되는가
C5: 1000자 이상인가`,
    pass_rule: "C1~C5 모두 충족",
    not_evaluated: "퇴고 (차시06에서), 맞춤법",
    model: SONNET, max_tokens: 1800, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 6, lesson_id: "06",
    lesson_title: "칼럼 퇴고",
    lesson_summary: "칼럼 퇴고 핵심: 도입이 독자를 끌어들이는가? 어조가 논설문처럼 딱딱하지 않고 칼럼답게 부드러운가? 4단계 퇴고 적용.",
    assignment: "칼럼에 4단계 퇴고 적용. 특히 '독자가 읽고 싶어지는가?' 관점에서 도입 점검. 수정 메모 포함.",
    criteria: `C1: 수정된 칼럼이 있는가
C2: 수정 메모가 있는가
C3: 수정 후 도입이 더 매력적이 되었는가
C4: 칼럼 어조(부드럽고 개인적)가 유지되는가`,
    pass_rule: "C1·C2 필수, C3·C4 확인",
    not_evaluated: "내용 (차시05에서 완료)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 7, lesson_id: "07",
    lesson_title: "칼럼 최종 완성",
    lesson_summary: "칼럼 완성본: 퇴고까지 완료. 에피소드 도입 + 이슈 연결 + 관점 전개 + 독자 제안. 포트폴리오 대표작.",
    assignment: "칼럼 최종본 완성 (1000자 이상). 수정 전/후 비교를 통해 얼마나 발전했는지 100자 이내로 성찰.",
    criteria: `C1: 칼럼 최종본이 1000자 이상인가
C2: 4부 구조(에피소드/이슈 연결/관점/제안)가 있는가
C3: 칼럼 어조가 적절한가 (너무 딱딱하거나 너무 가벼운 어조 아님)
C4: 성찰 글(100자 이내)이 있는가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 8, lesson_id: "08",
    lesson_title: "제안서 계획하기",
    lesson_summary: "제안서 4부 구조: ①문제 제시(무슨 문제가, 왜 중요한가) ②현황 분석(수치·사례 포함) ③해결책 제안(구체적으로) ④기대 효과. 결정권자를 설득하는 글.",
    assignment: "학교·지역사회·온라인 환경에서 개선이 필요한 것을 주제로 제안서 계획표 완성. 문제 + 현황 + 해결책 2가지 + 기대 효과 계획.",
    criteria: `C1: 문제가 명확하게 제시되어 있는가
C2: 현황 분석에 구체적인 수치나 사례 계획이 있는가
C3: 해결책이 2가지 이상 계획되어 있는가 (구체적이고 실현 가능한가)
C4: 기대 효과 계획이 있는가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "실제 글쓰기 (차시09-10에서)",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 9, lesson_id: "09",
    lesson_title: "제안서 초안 1 — 문제·현황",
    lesson_summary: "제안서 앞부분: 문제 제시 + 현황 분석. 수치나 사례를 포함하면 설득력이 높아짐. 600자 이상.",
    assignment: "제안서 앞부분 작성 (600자 이상): 문제 제시(어떤 문제인가, 왜 중요한가) + 현황 분석(수치·사례 포함).",
    criteria: `C1: 문제가 구체적으로 제시되어 있는가
C2: 이 문제가 왜 중요한지 설명이 있는가
C3: 현황 분석에 구체적 수치나 사례가 있는가 (없어도 '~에 따르면' 형태면 인정)
C4: 600자 이상인가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "해결책·기대 효과 (차시10에서), 맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 10, lesson_id: "10",
    lesson_title: "제안서 초안 2 — 해결책·기대 효과",
    lesson_summary: "해결책은 구체적이어야 함: '무엇을, 어떻게, 누가' 포함. 기대 효과: 이 제안이 실현되면 어떤 변화가. 전체 1200자 이상.",
    assignment: "제안서에 해결책 + 기대 효과 추가 (전체 1200자 이상). 해결책은 구체적이고 실현 가능하게.",
    criteria: `C1: 해결책이 구체적인가 (무엇을 어떻게 해야 하는지)
C2: 해결책이 현실적으로 실현 가능한가
C3: 기대 효과가 있는가 (제안이 실현되면 어떤 변화가 생기는지)
C4: 전체 1200자 이상인가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "퇴고 (차시11에서), 맞춤법",
    model: SONNET, max_tokens: 1800, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 11, lesson_id: "11",
    lesson_title: "제안서 퇴고",
    lesson_summary: "제안서 퇴고 핵심: 해결책이 구체적이고 실현 가능한가? 수치·사례가 신뢰를 주는가? 4단계 퇴고 적용.",
    assignment: "제안서에 4단계 퇴고 적용. 특히 '해결책이 구체적이고 실현 가능한가?' 확인. 수정 내용 메모 포함.",
    criteria: `C1: 수정된 제안서 최종본이 있는가
C2: 수정 메모가 있는가
C3: 수정 후 해결책이 더 구체적이 되었는가
C4: 문제 제시~기대 효과가 자연스럽게 연결되는가`,
    pass_rule: "C1·C2 필수, C3·C4 확인",
    not_evaluated: "최종 과제 (차시13부터)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 12, lesson_id: "12",
    lesson_title: "최종 과제 계획",
    lesson_summary: "7단계 종합 복습. 최종 과제: 목적·독자·형식 완전 자유 선택. 3축 결정표 + 구조 계획표 완성. 1~6단계에서 배운 기법 3가지 이상 활용 계획.",
    assignment: "최종 자유 과제 계획 완성. 목적·독자·형식 결정(이유 포함) + 구조 계획 + 1~6단계 기법 중 사용할 것 3가지 이상 표시.",
    criteria: `C1: 목적·독자·형식이 결정되어 있는가 (각각 이유 포함)
C2: 구조 계획이 있는가 (선택한 형식에 맞는 구조)
C3: 1~6단계에서 배운 기법 중 사용할 것 3가지 이상이 구체적으로 표시되어 있는가
C4: 목적·독자·형식이 서로 일관성 있게 맞는가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "실제 글쓰기 (차시13부터)",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 13, lesson_id: "13",
    lesson_title: "최종 과제 초안",
    lesson_summary: "최종 자유 과제 초안: 선택한 형식으로 1000자 이상. 1~6단계 기법 3가지 이상 적용. 퇴고 전 초안.",
    assignment: "최종 과제 초안 작성 (1000자 이상). 선택한 형식의 구조에 맞게, 1~6단계 기법 3가지 이상 적용.",
    criteria: `C1: 1000자 이상인가
C2: 선택한 형식의 구조(에세이/칼럼/제안서/논설문 등)에 맞게 쓰였는가
C3: 1~6단계 기법 중 2가지 이상이 실제로 사용되었는가 (예: Show 기법, ARE 구조, 비교·대조 설명 등)
C4: 목적·독자·형식이 일관한가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "퇴고 (차시14에서), 맞춤법",
    model: SONNET, max_tokens: 1800, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 14, lesson_id: "14",
    lesson_title: "최종 과제 4단계 퇴고",
    lesson_summary: "최종 과제 퇴고: 4단계 퇴고(내용→구조→문장→어휘) 순서대로 적용. 의미 있는 수정이 이루어졌는지 확인.",
    assignment: "최종 과제 초안에 4단계 퇴고 적용. 각 단계별 수정 내용을 메모. 수정 전/후 비교 제출.",
    criteria: `C1: 수정된 최종 과제가 있는가
C2: 4단계 퇴고 메모가 있는가 (내용/구조/문장/어휘 각 확인)
C3: 수정이 의미 있는가 (단순 맞춤법 수정만 아님)
C4: 수정 후에도 1400자 이상인가`,
    pass_rule: "C1·C2·C3 필수, C4 확인",
    not_evaluated: "루브릭 평가 (차시15에서)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 7, lesson_num: 15, lesson_id: "15",
    lesson_title: "최종 과제 제출 — 루브릭 종합 평가",
    lesson_summary: "7단계 전체 복습 후 최종 과제 제출. 루브릭 5항목 × 4점 = 20점 만점. 17점 이상 + 포트폴리오 완성 시 전 과정 이수.",
    assignment: "최종 자유 과제 제출 (1400자 이상). 목적·독자·형식 자유 선택, 4단계 퇴고 완료, 1~6단계 기법 3가지 이상 적용.",
    criteria: `R1: 3축 일치(4점) — 목적·독자·형식 완전히 일관, 선택이 적절
R2: 퇴고(4점) — 4단계 모두 적용, 의미 있는 수정 흔적 있음
R3: 완성도(4점) — 처음 읽는 독자가 이해하고 설득/공감됨
R4: 기법 통합(4점) — 이전 단계 기법 3가지 이상 명확히 적용
R5: 분량(4점) — 1400자 이상`,
    pass_rule: "총점 17점 이상 합격. 각 항목 점수 합 = total과 반드시 일치.",
    not_evaluated: "없음",
    model: SONNET, max_tokens: 2000, is_rubric: true,
  },
  {
    stage: 7, lesson_num: 16, lesson_id: "16",
    lesson_title: "포트폴리오 — 성장 성찰",
    lesson_summary: "포트폴리오: 1~7단계 각 대표작 1편씩 선정 + 각 글에 100자 이내 코멘트. 마지막: '글쓰기를 통해 달라진 것' 성장 에세이.",
    assignment: "1~7단계 각 단계별 대표작 1편씩 선정하고 각 글에 '이 글을 선택한 이유' 또는 '이 글에서 배운 것'을 100자 이내로 쓰기. 이후 '글쓰기를 통해 내가 달라진 것' 성장 에세이 (500자 이상).",
    criteria: `C1: 각 단계 대표작 선정과 코멘트(100자 이내)가 있는가 (최소 3단계 이상)
C2: 성장 에세이가 500자 이상인가
C3: 성장 에세이에서 글쓰기를 통해 달라진 점이 구체적으로 설명되어 있는가
C4: 단순히 '잘 써졌다', '재미있었다' 이상의 구체적인 성찰이 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "맞춤법",
    model: SONNET, max_tokens: 1800, is_rubric: false,
  },
];
