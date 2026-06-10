import type { LessonConfig } from "../types";

const HAIKU = "claude-haiku-4-5-20251001";
const SONNET = "claude-sonnet-4-6";

export const stage3Lessons: LessonConfig[] = [
  {
    stage: 3, lesson_num: 1, lesson_id: "01",
    lesson_title: "3부 구조 이해하기",
    lesson_summary: "서론-본론-결론 3부 구조. 서론 도입 방법 4가지: 질문으로 시작 / 장면 묘사 / 놀라운 사실 / 직접 주제 제시.",
    assignment: "내가 좋아하는 음식에 대해 서론 2가지 버전 쓰기. 버전 1: 질문으로 시작. 버전 2: 직접 주제 제시로 시작.",
    criteria: `C1: 서론 버전 1(질문으로 시작)이 있는가 — 물음표로 끝나는 질문 문장이 포함되어 있는가
C2: 서론 버전 2(직접 주제 제시)가 있는가 — "내가 좋아하는 음식은 ~이다" 형태의 문장이 포함되어 있는가
C3: 각 서론에서 이 글의 주제(음식)가 암시되어 있는가
C4: 각 서론이 2문장 이상인가`,
    pass_rule: "C1·C2·C3 충족, C4 각 버전이 2문장 이상",
    not_evaluated: "본론과 결론, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 3, lesson_num: 2, lesson_id: "02",
    lesson_title: "서론 — 독자의 관심 끌기",
    lesson_summary: "좋은 서론: 독자가 계속 읽고 싶어진다. 나쁜 서론: '이 글에서는 ~에 대해 쓰겠습니다'처럼 시작. 4가지 방법 중 하나 선택.",
    assignment: "내가 좋아하는 계절에 대한 서론 1개 쓰기. 4가지 도입 방법(질문/장면 묘사/놀라운 사실/직접 제시) 중 하나 선택. 선택 이유 한 줄 메모 포함.",
    criteria: `C1: 4가지 도입 방법(질문/장면 묘사/놀라운 사실/직접 제시) 중 하나가 명확히 사용되었는가
C2: 선택한 도입 방법이 제대로 구현되었는가 (질문이면 물음표, 장면이면 구체적 묘사)
C3: 서론에서 이 글의 주제(계절)가 암시되거나 제시되어 있는가
C4: 선택 이유 메모가 한 줄이라도 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "본론·결론, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 3, lesson_num: 3, lesson_id: "03",
    lesson_title: "본론 — 단락 순서 정하기",
    lesson_summary: "본론 단락 순서 기준: 시간 순서 / 중요도 순서 (중요한 것 먼저 or 나중에) / 원인→결과 순서. 순서 근거가 있어야 논리적.",
    assignment: "내가 좋아하는 계절에 대한 본론 계획 작성. 본론 단락 2개의 중심 문장을 쓰고, 이 순서로 배치한 이유(시간/중요도/원인·결과 중 하나)를 메모로 설명하기.",
    criteria: `C1: 본론 단락 2개의 계획이 있는가
C2: 각 단락에 중심 문장이 있는가
C3: 두 단락이 서로 다른 내용을 다루는가
C4: 단락 순서의 근거(시간 순서/중요도 순서/원인→결과 중 하나)가 메모로 설명되어 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "뒷받침 문장, 마무리 문장",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 3, lesson_num: 4, lesson_id: "04",
    lesson_title: "본론 2단락 쓰기",
    lesson_summary: "본론 각 단락: 중심 문장 + 뒷받침 3개 + 마무리 문장. 단락 간 접속어(그리고/하지만/그래서/또한/반면에 등)로 자연스럽게 연결.",
    assignment: "차시 3에서 계획한 본론 2단락 작성. 각 단락: 중심 문장 + 뒷받침 문장 3개 + 마무리 문장. 단락 사이에 접속어 사용.",
    criteria: `C1: 2개의 단락이 있는가
C2: 각 단락에 중심 문장이 있는가
C3: 각 단락에 뒷받침 문장이 3개 있는가
C4: 각 단락에 마무리 문장이 있는가
C5: 단락 간 접속어(그리고/하지만/그래서/또한/반면에/따라서 등)로 연결되어 있는가`,
    pass_rule: "C1~C5 모두 충족",
    not_evaluated: "서론·결론, 맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 3, lesson_num: 5, lesson_id: "05",
    lesson_title: "결론 — 여운 남기기",
    lesson_summary: "나쁜 결론 패턴: '이상으로 마치겠습니다', 본론 내용 그대로 반복. 좋은 결론: 핵심 정리 + 새로운 시각이나 독자에게 전하는 메시지.",
    assignment: "지금까지 쓴 서론+본론에 결론 추가하기. 결론에서 본론 내용을 자연스럽게 마무리하되 단순 반복 금지.",
    criteria: `C1: 결론이 있는가
C2: 결론이 본론 내용을 그대로 반복하지 않는가
C3: '이상으로 마치겠습니다', '지금까지 ~에 대해 썼습니다' 같은 상투적 표현이 없는가
C4: 결론이 글 전체 내용을 자연스럽게 마무리하는가 (핵심 정리 또는 독자에게 전하는 메시지)`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "맞춤법, 분량",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 3, lesson_num: 6, lesson_id: "06",
    lesson_title: "서론-본론-결론 한 번에 완성",
    lesson_summary: "처음부터 끝까지 3부 구조 글 완성. 서론 도입 방법 사용 + 본론 2단락 이상 + 결론 자연스러운 마무리. 400자 이상.",
    assignment: "자유 주제로 3부 구조 글 완성하기 (400자 이상). 서론 도입 방법 선택, 본론 2단락 이상 (각 단락 중심+뒷받침+마무리), 결론 마무리.",
    criteria: `C1: 서론에 도입 방법(질문/장면/사실/직접 제시 중 하나)이 사용되었는가
C2: 본론이 2개 단락 이상인가
C3: 각 단락에 중심 문장이 있는가
C4: 결론이 자연스럽게 마무리하는가 (단순 반복 아님)
C5: 단락 간 접속어로 연결되는가
C6: 400자 이상인가`,
    pass_rule: "C1~C6 모두 충족",
    not_evaluated: "맞춤법 (차시07에서 다룸)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 3, lesson_num: 7, lesson_id: "07",
    lesson_title: "독후감 구조 배우기",
    lesson_summary: "독후감 4부 구조: 책 소개 → 인상 깊은 장면 → 느낀 점 → 내 삶과의 연결. 줄거리 요약은 전체의 30% 이하.",
    assignment: "최근 읽은 책으로 독후감 초안 쓰기 (400자 이상). 4부 구조: 책 소개 + 인상 깊은 장면 + 느낀 점 + 내 삶과의 연결.",
    criteria: `C1: 책 소개(어떤 책인가?)가 있는가
C2: 인상 깊은 장면이 구체적으로 묘사되어 있는가
C3: 느낀 점이 있는가
C4: 줄거리 요약이 전체 분량의 절반 이하인가
C5: 400자 이상인가`,
    pass_rule: "C1·C2·C3·C4·C5 모두 충족",
    not_evaluated: "내 삶과의 연결 (차시09에서 완성), 맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 3, lesson_num: 8, lesson_id: "08",
    lesson_title: "독후감 — 느낀 점 깊이 쓰기",
    lesson_summary: "느낀 점을 구체적으로 표현하는 법: 1) 인물의 선택에 대한 내 판단 2) 나와 비교 3) 이 장면이 왜 기억에 남는지. '재미있었다', '좋았다'만으로 끝내지 않기.",
    assignment: "차시 7 독후감에서 느낀 점 단락을 더 풍부하게 다시 쓰기. 수정 전/후를 나란히 제출하고, 무엇을 왜 수정했는지 한 줄 메모.",
    criteria: `C1: 수정된 느낀 점 단락이 있는가
C2: 수정 메모가 있는가 (무엇을 왜 수정했는지)
C3: '재미있었다', '좋았다' 같은 막연한 표현만 쓰지 않고 구체적인 이유나 판단이 추가되었는가
C4: 수정 후 느낀 점이 원본보다 더 풍부해졌는가`,
    pass_rule: "C1·C2 필수, C3·C4 중 하나 이상 개선됨",
    not_evaluated: "맞춤법, 내 삶과의 연결",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 3, lesson_num: 9, lesson_id: "09",
    lesson_title: "독후감 최종 완성",
    lesson_summary: "최종 독후감: 책 소개 + 인상 깊은 장면 + 느낀 점 + 내 삶과의 연결. 500자 이상. 줄거리 요약 30% 이하.",
    assignment: "독후감 최종본 완성 (500자 이상). 4부 구조 완성: 책 소개 + 인상 깊은 장면 + 느낀 점 + 내 삶과의 연결.",
    criteria: `C1: 책 소개가 있는가
C2: 인상 깊은 장면과 그 이유가 구체적인가
C3: 느낀 점이 구체적인가 (단순한 '좋았다' 이상)
C4: 내 삶과의 연결(이 책이 내게 주는 의미, 나와 비교, 앞으로의 다짐 등)이 있는가
C5: 줄거리 요약이 전체의 30% 이하인가
C6: 500자 이상인가`,
    pass_rule: "C1~C6 모두 충족",
    not_evaluated: "맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 3, lesson_num: 10, lesson_id: "10",
    lesson_title: "편지 형식과 표현",
    lesson_summary: "편지 5구성: 받는 사람 + 첫인사 + 본문 + 끝인사 + 보내는 사람. 진심을 담으려면: 구체적인 사건이나 순간을 떠올려 쓰기.",
    assignment: "가족 또는 친구에게 감사 편지 쓰기. 편지 5구성 갖추기. 감사하는 이유를 구체적으로 담기.",
    criteria: `C1: 편지 5구성(받는 사람/첫인사/본문/끝인사/보내는 사람)이 있는가
C2: 본문에 감사하는 이유가 구체적으로 담겨 있는가 (막연한 '감사해요' 이상)
C3: 본문이 2문장 이상인가`,
    pass_rule: "C1·C2·C3 모두 충족",
    not_evaluated: "맞춤법, 분량",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 3, lesson_num: 11, lesson_id: "11",
    lesson_title: "편지 완성",
    lesson_summary: "편지 퇴고: '이 편지를 받는 사람은 어떤 기분일까?' 스스로 질문하며 수정. 진심이 더 잘 전달되도록.",
    assignment: "차시 10 편지를 수정하기. '이 편지를 받는 사람은 어떤 기분일까?' 스스로 질문하며 수정. 수정 전/후 나란히 제출.",
    criteria: `C1: 수정된 편지가 있는가
C2: 편지 5구성이 유지되어 있는가
C3: 원본보다 감사하는 이유나 내용이 더 풍부해졌는가
C4: 받는 사람이 읽고 기쁠 것 같은 구체적인 내용이 있는가`,
    pass_rule: "C1·C2 필수, C3·C4 중 하나 이상 개선됨",
    not_evaluated: "맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 3, lesson_num: 12, lesson_id: "12",
    lesson_title: "최종 과제 계획",
    lesson_summary: "3단계 종합 복습. 최종 과제 계획표: 주제, 서론 도입 방법, 본론 2단락 이상의 중심 문장, 결론에서 전할 것.",
    assignment: "자유 주제로 최종 과제 3부 구조 계획표 완성. 제목(가제) + 서론 도입 방법 + 본론 2단락 이상 중심 문장 + 결론 핵심 내용.",
    criteria: `C1: 제목(가제)이 있는가
C2: 서론 도입 방법(4가지 중 하나)이 결정되어 있는가
C3: 본론 단락 2개 이상의 중심 문장이 계획되어 있는가
C4: 결론에서 전할 내용이 계획되어 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "뒷받침 문장, 실제 글쓰기 완성도 (차시13에서 평가)",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 3, lesson_num: 13, lesson_id: "13",
    lesson_title: "최종 과제 — 루브릭 종합 평가",
    lesson_summary: "3단계 전체 복습 후 최종 글 작성. 루브릭 5항목 × 4점 = 20점 만점. 15점 이상 4단계 진급.",
    assignment: "자유 주제로 3부 구조 글 완성 (500자 이상). 서론에 도입 방법 사용, 본론 2단락 이상 (각 단락 중심+뒷받침+마무리), 결론 자연스러운 마무리, 단락 간 접속어 연결.",
    criteria: `R1: 서론(4점) — 도입 방법 사용(흥미로운 시작) + 주제 명확히 제시
R2: 본론 구성(4점) — 2개 이상 단락, 각 단락에 중심 문장 명확
R3: 결론(4점) — 단순 반복 아닌 자연스러운 마무리 (핵심 정리 또는 독자 메시지)
R4: 단락 연결(4점) — 접속어로 자연스럽게 연결, 모든 뒷받침이 중심 문장과 연결
R5: 분량(4점) — 500자 이상`,
    pass_rule: "총점 15점 이상 합격. 각 항목 점수 합 = total과 반드시 일치.",
    not_evaluated: "없음",
    model: SONNET, max_tokens: 1400, is_rubric: true,
  },
];
