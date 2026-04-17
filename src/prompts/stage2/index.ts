import type { LessonConfig } from "../types";

const HAIKU = "claude-haiku-4-5-20251001";
const SONNET = "claude-sonnet-4-6";

export const stage2Lessons: LessonConfig[] = [
  {
    stage: 2, lesson_num: 1, lesson_id: "01",
    lesson_title: "중심 문장이란 무엇인가",
    lesson_summary: "중심 문장 = 단락에서 말하고 싶은 핵심 1가지. 너무 넓거나 모호하면 중심 문장이 아님.",
    assignment: "내가 좋아하는 것(음식, 취미, 계절, 동물 등) 3가지에 대한 중심 문장을 각각 1개씩 만들기",
    criteria: `C1: 각 문장이 하나의 명확한 생각에 집중하는가 ("나는 좋은 것들이 많다" 같은 너무 넓은 문장 아닌가)
C2: 각 문장에 주어와 서술어가 있는가
C3: 3개의 중심 문장이 서로 다른 주제를 다루는가`,
    pass_rule: "3개 문장 모두 C1·C2 충족, C3 확인",
    not_evaluated: "뒷받침 문장, 마무리 문장, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 2, lesson_num: 2, lesson_id: "02",
    lesson_title: "뒷받침 문장 — 예시와 이유",
    lesson_summary: "예시 뒷받침: '예를 들어'. 이유 뒷받침: '왜냐하면'. 뒷받침 문장은 반드시 중심 문장과 연결.",
    assignment: "내 친구(또는 가족)를 소개하는 단락 쓰기. 중심 문장 1개 + 예시 또는 이유 뒷받침 3개",
    criteria: `C1: 중심 문장이 첫 번째 문장인가
C2: 뒷받침 문장이 3개 있는가
C3: 각 뒷받침 문장이 중심 문장과 연결되는가 (중심 문장에서 벗어난 뒷받침 없는가)
C4: 예시 또는 이유 뒷받침 방법이 명확하게 사용되었는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "마무리 문장, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 2, lesson_num: 3, lesson_id: "03",
    lesson_title: "뒷받침 문장 — 경험과 비교",
    lesson_summary: "경험 뒷받침: '한 번은', '내가 직접'. 비교 뒷받침: '~와 달리', '~에 비해'. 경험은 구체적인 사건이어야 함.",
    assignment: "내가 좋아하는 계절에 대한 단락 쓰기. 중심 문장 1개 + 경험 뒷받침 1개 이상 포함한 뒷받침 3개",
    criteria: `C1: 중심 문장이 명확한가
C2: 뒷받침 문장이 3개 있는가
C3: 경험 뒷받침이 1개 이상 있는가
C4: 경험 뒷받침에 '한 번은', '내가 직접' 등 신호어가 있거나 구체적인 경험 사건이 담겨 있는가
C5: 모든 뒷받침 문장이 중심 문장과 연결되는가`,
    pass_rule: "C1~C5 모두 충족",
    not_evaluated: "마무리 문장, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 2, lesson_num: 4, lesson_id: "04",
    lesson_title: "뒷받침 방법 혼합하기",
    lesson_summary: "예시·이유·경험·비교 4가지 방법을 섞으면 단락이 풍부해진다. 각 방법의 신호어 사용 권장.",
    assignment: "자유 주제로 단락 쓰기. 뒷받침 방법 2가지 이상 혼합 필수",
    criteria: `C1: 중심 문장이 명확하게 있는가
C2: 뒷받침 문장이 3개 이상 있는가
C3: 뒷받침 방법이 2가지 이상 사용되었는가 (예시/이유/경험/비교 중)
C4: 각 방법의 신호어(예를 들어, 왜냐하면, 한 번은, ~와 달리 등)가 1개 이상 사용되었는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "마무리 문장, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 2, lesson_num: 5, lesson_id: "05",
    lesson_title: "마무리 문장 쓰기",
    lesson_summary: "마무리 문장은 중심 문장의 단순 반복 금지. 의미 확장 또는 새로운 시각으로 마무리.",
    assignment: "지금까지 쓴 단락 중 하나를 골라 마무리 문장을 추가해 완성하기. 또는 새 주제로 완전한 단락(중심 문장 + 뒷받침 3개 + 마무리 문장) 쓰기",
    criteria: `C1: 마무리 문장이 있는가
C2: 마무리 문장이 중심 문장을 그대로 반복하지 않는가
C3: 마무리 문장이 단락 전체 내용을 자연스럽게 마무리하는가 (의미 확장 또는 새로운 시각)
C4: 중심 문장과 뒷받침 구조가 유지되는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "맞춤법, 접속어",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 2, lesson_num: 6, lesson_id: "06",
    lesson_title: "완전한 단락 1개 완성",
    lesson_summary: "중심 문장 + 뒷받침 3개(방법 2가지 이상) + 마무리 문장. 단락 구조의 완전한 형태.",
    assignment: "자유 주제로 완전한 단락 쓰기. 중심 문장 + 뒷받침 3개(뒷받침 방법 2가지 이상 혼합) + 마무리 문장",
    criteria: `C1: 중심 문장이 명확하고 첫 번째에 위치하는가
C2: 뒷받침 문장이 3개 있는가
C3: 뒷받침 방법이 2가지 이상 사용되었는가
C4: 마무리 문장이 단순 반복 아닌 의미 있는 마무리인가
C5: 모든 문장에 주어와 서술어가 있는가`,
    pass_rule: "C1~C5 모두 충족",
    not_evaluated: "접속어 (차시07에서 다룸)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 2, lesson_num: 7, lesson_id: "07",
    lesson_title: "접속어로 단락 연결하기",
    lesson_summary: "단락 간 접속어: 그리고, 하지만, 그래서, 또한, 반면에, 따라서. 접속어가 없으면 글이 뚝뚝 끊기는 느낌.",
    assignment: "2단락 글 쓰기. 각 단락에 중심 문장 + 뒷받침 + 마무리 포함, 단락 사이에 접속어로 자연스럽게 연결",
    criteria: `C1: 2개의 단락이 있는가
C2: 각 단락에 중심 문장이 있는가
C3: 단락 사이에 접속어(그리고/하지만/그래서/또한/반면에/따라서 등)가 사용되었는가
C4: 접속어가 두 단락의 관계(추가/대조/결과 등)와 맞는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 2, lesson_num: 8, lesson_id: "08",
    lesson_title: "소개글 계획하고 초안 쓰기",
    lesson_summary: "소개글 = 단락 원리 적용. 2~3단락 구성: 배경/취미/꿈 또는 좋아하는 것/이유/바람 등. 각 단락은 서로 다른 주제.",
    assignment: "나 자신 또는 관심 주제에 대한 소개글 초안 쓰기 (2~3단락). 각 단락에 중심 문장 + 뒷받침 + 마무리 포함",
    criteria: `C1: 2~3개의 단락이 있는가
C2: 각 단락이 서로 다른 주제를 다루는가
C3: 각 단락에 중심 문장이 있는가
C4: 각 단락에 뒷받침 문장이 있는가 (2개 이상)
C5: 단락 간 접속어가 있는가`,
    pass_rule: "C1·C2·C3·C4·C5 모두 충족",
    not_evaluated: "마무리 문장의 완성도 (차시09에서 다듬음)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 2, lesson_num: 9, lesson_id: "09",
    lesson_title: "소개글 고쳐쓰기",
    lesson_summary: "고쳐쓰기 순서: 1) 가장 약한 단락 찾기 → 2) 구체적으로 무엇이 약한지 파악 → 3) 수정. 변경 내용 메모 필수.",
    assignment: "차시 8에서 쓴 소개글을 스스로 점검하고 수정하기. 수정한 부분과 이유를 간단히 메모해서 함께 제출하기",
    criteria: `C1: 수정된 소개글이 제출되었는가
C2: 수정 메모가 있는가 (무엇을, 왜 수정했는지)
C3: 수정 후 각 단락의 중심 문장이 더 명확해졌는가
C4: 수정 후 뒷받침이 중심 문장과 더 잘 연결되는가`,
    pass_rule: "C1·C2 필수, C3·C4 중 하나 이상 개선됨",
    not_evaluated: "맞춤법 (차시10에서 최종 점검)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 2, lesson_num: 10, lesson_id: "10",
    lesson_title: "소개글 완성",
    lesson_summary: "최종 소개글: 3단락, 각 단락 중심 문장+뒷받침 2가지 이상+마무리, 단락 간 접속어 연결.",
    assignment: "최종 소개글 완성본 제출 (3단락)",
    criteria: `C1: 3개의 단락이 있는가
C2: 각 단락이 서로 다른 주제를 다루는가
C3: 각 단락에 중심 문장이 있는가
C4: 각 단락에 뒷받침 방법이 2가지 이상 사용되었는가
C5: 단락 간 접속어로 자연스럽게 이어지는가
C6: 명백한 맞춤법·문장 부호 오류가 3개 이하인가`,
    pass_rule: "C1~C6 모두 충족",
    not_evaluated: "없음",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 2, lesson_num: 11, lesson_id: "11",
    lesson_title: "복습 및 최종 과제 계획",
    lesson_summary: "2단계 종합 복습. 최종 과제 계획표 작성: 단락별 중심 문장, 뒷받침 방법, 접속어 미리 계획.",
    assignment: "최종 과제 계획표 작성: 2단락 이상의 단락별 중심 문장, 사용할 뒷받침 방법, 단락 간 접속어를 미리 계획해서 제출",
    criteria: `C1: 2단락 이상의 계획이 있는가
C2: 각 단락에 중심 문장이 계획되어 있는가
C3: 각 단락에 뒷받침 방법이 2가지 이상 계획되어 있는가
C4: 단락 간 접속어가 계획되어 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "실제 글쓰기 완성도 (차시12에서 평가)",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 2, lesson_num: 12, lesson_id: "12",
    lesson_title: "최종 과제 — 루브릭 종합 평가",
    lesson_summary: "2단계 전체 복습 후 최종 글 작성. 루브릭 5항목 × 4점 = 20점 만점. 14점 이상 3단계 진급.",
    assignment: "자유 주제로 2단락 이상 완성하기. 각 단락: 중심 문장 + 뒷받침 3개(방법 2가지 이상 혼합) + 마무리 문장. 단락 간 접속어 연결 필수.",
    criteria: `R1: 중심 문장(4점) — 명확하고 하나의 생각에 집중, 각 단락에 명시
R2: 뒷받침(4점) — 단락당 3개 이상, 2가지 이상 방법 혼합
R3: 마무리 문장(4점) — 의미 있는 마무리 (단순 반복 금지)
R4: 연결성(4점) — 모든 뒷받침이 중심 문장과 연결, 단락 간 접속어 자연스러움
R5: 관례(4점) — 맞춤법·띄어쓰기·문장부호 오류 수`,
    pass_rule: "총점 14점 이상 합격. 각 항목 점수 합 = total과 반드시 일치.",
    not_evaluated: "없음",
    model: SONNET, max_tokens: 1400, is_rubric: true,
  },
];
