import type { LessonConfig } from "../types";

const HAIKU = "claude-haiku-4-5-20251001";
const SONNET = "claude-sonnet-4-6";

export const stage5Lessons: LessonConfig[] = [
  {
    stage: 5, lesson_num: 1, lesson_id: "01",
    lesson_title: "이야기의 4막 구조",
    lesson_summary: "발단(인물·배경 소개, 사건의 씨앗) → 전개(문제 발생, 해결 시도) → 절정(가장 긴장된 순간) → 결말(해결, 인물의 변화). 이 순서가 이야기의 뼈대.",
    assignment: "내가 겪은 사건 하나를 4막 구조로 각 막을 1~2문장으로 정리하기.",
    criteria: `C1: 발단이 있는가 (인물과 상황 소개)
C2: 전개가 있는가 (문제나 갈등 발생)
C3: 절정이 있는가 (가장 긴장되거나 중요한 순간)
C4: 결말이 있는가 (해결 또는 변화)
C5: 각 막이 1문장 이상으로 설명되어 있는가`,
    pass_rule: "C1~C5 모두 충족",
    not_evaluated: "Show 기법, 대화, 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 5, lesson_num: 2, lesson_id: "02",
    lesson_title: "인물 만들기",
    lesson_summary: "입체적 인물 = 원하는 것 + 두려워하는 것 + 비밀(약점). 평면적 인물 = '착하다', '나쁘다'처럼 한 마디로 설명됨. 성격은 말과 행동으로 드러내야 함.",
    assignment: "내 이야기의 주인공 인물 카드 작성 (원하는 것/두려워하는 것/비밀 포함) + 인물의 성격을 말이나 행동으로 드러내는 소개 단락 1개 쓰기.",
    criteria: `C1: 인물 카드에 '원하는 것', '두려워하는 것', '비밀(약점)' 중 2가지 이상이 있는가
C2: 소개 단락에 인물의 성격을 보여주는 말(대화)이나 행동이 1개 이상 있는가
C3: '착하다', '나쁘다', '용감하다'처럼 성격을 직접 서술하지 않고 행동이나 대화로 드러내는가
C4: 소개 단락이 3문장 이상인가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "Show 기법(차시04에서 다룸), 맞춤법",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 5, lesson_num: 3, lesson_id: "03",
    lesson_title: "배경 묘사하기",
    lesson_summary: "배경은 장식이 아니다 — 이야기의 분위기를 만든다. 기쁠 때와 슬플 때 같은 장소도 다르게 보인다. 5감(시각/청각/후각/촉각/미각) 중 3가지 이상 사용.",
    assignment: "내 이야기의 시작 배경 묘사 단락 1개 쓰기 (5감 중 3가지 이상 사용). 시각 외에도 소리, 냄새, 촉감 등을 포함할 것.",
    criteria: `C1: 배경이 구체적으로 묘사되어 있는가 (어디인지 알 수 있는가)
C2: 5감 중 시각 외에 다른 감각 표현이 2가지 이상 있는가
C3: 감각 표현이 구체적인가 (좋은 예: '바스락바스락 소리가 났다' / 나쁜 예: '소리가 났다')
C4: 배경 묘사가 이야기의 분위기를 만드는가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "Show 기법, 맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 5, lesson_num: 4, lesson_id: "04",
    lesson_title: "Show vs Tell — Tell을 Show로 바꾸기",
    lesson_summary: "Tell(직접 서술): '화가 났다' / Show(보여주기): '주먹을 꽉 쥐고 발을 구르며 방문을 쾅 닫았다'. Show의 도구: 구체적 행동, 대화, 감각 묘사.",
    assignment: "이야기 속 절정 장면 하나를 Show 기법으로 쓰기 (150자 이상). 감정을 직접 서술하는 단어 없이 행동·대화·감각으로 표현.",
    criteria: `C1: 150자 이상인가
C2: '화가 났다', '기뻤다', '무서웠다' 같이 감정을 직접 서술하는 단어가 없는가
C3: 인물의 행동, 대화, 감각 묘사로 감정이 드러나는가
C4: 장면이 구체적이고 생생하게 묘사되어 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "대화 문장 부호(차시06에서), 맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 5, lesson_num: 5, lesson_id: "05",
    lesson_title: "Show 기법 심화",
    lesson_summary: "다양한 감정을 Show로: 두려움(몸이 굳는다, 심장이 쿵쾅거린다), 기쁨(목소리가 높아진다, 발걸음이 가벼워진다), 슬픔(목이 메인다). 감정마다 다른 몸의 반응.",
    assignment: "이야기 속 인물이 두려움을 느끼는 장면 (100자 이상) + 기쁨을 느끼는 장면 (100자 이상)을 각각 Show 기법으로 쓰기.",
    criteria: `C1: 두려움 장면이 100자 이상인가
C2: 기쁨 장면이 100자 이상인가
C3: 두려움 장면에서 감정을 직접 서술하지 않고 몸의 반응이나 행동으로 표현했는가
C4: 기쁨 장면에서 감정을 직접 서술하지 않고 몸의 반응이나 행동으로 표현했는가
C5: 두 장면의 Show 표현이 서로 달라서 구별이 되는가`,
    pass_rule: "C1~C5 모두 충족",
    not_evaluated: "대화 문장 부호, 맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 5, lesson_num: 6, lesson_id: "06",
    lesson_title: "대화 쓰기",
    lesson_summary: "대화 문장 부호: 대화는 큰따옴표(\"\")로 묶기. 대화 다음 '라고 말했다', '라고 물었다'. 좋은 대화: 인물의 성격과 감정을 보여줌.",
    assignment: "이야기 속 갈등 장면을 대화 포함해 작성 (200자 이상). 대화가 인물의 성격을 드러내도록.",
    criteria: `C1: 대화가 1개 이상 있는가
C2: 대화 문장 부호(큰따옴표)가 올바르게 사용되었는가
C3: 대화가 인물의 성격이나 상황을 보여주는가 (단순히 정보 전달 아님)
C4: 200자 이상인가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 5, lesson_num: 7, lesson_id: "07",
    lesson_title: "이야기 구성하기",
    lesson_summary: "이야기 전체 계획: 인물 카드(주인공+조연) + 4막 구성표. 4막 구성표에는 각 막의 핵심 사건을 1~2문장으로. 절정이 충분히 긴장감 있는지 확인.",
    assignment: "4막 구성표 완성 (각 막 1~2문장 요약) + 인물 카드 완성 (주인공 + 조연 1명). 이야기 전체를 한 줄로 요약해 제출.",
    criteria: `C1: 4막 구성표가 있는가 (각 막 1문장 이상)
C2: 주인공 인물 카드가 있는가 (원하는 것/두려워하는 것 포함)
C3: 조연 인물 카드 또는 소개가 있는가
C4: 4막이 논리적으로 연결되는가 (발단의 씨앗이 절정으로 이어지는가)
C5: 이야기 한 줄 요약이 있는가`,
    pass_rule: "C1~C5 모두 충족",
    not_evaluated: "실제 집필 (차시08부터)",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 5, lesson_num: 8, lesson_id: "08",
    lesson_title: "발단·전개 초안",
    lesson_summary: "발단 + 전개 초안: 배경 묘사 (5감 활용) + 인물 소개 (성격 행동으로) + 갈등 발생. 400자 이상.",
    assignment: "이야기의 발단 + 전개 초안 작성 (400자 이상). 배경 묘사 + 인물 소개 + 갈등 발생 포함.",
    criteria: `C1: 배경 묘사가 있는가 (5감 중 최소 1가지 이상)
C2: 인물이 등장하고 소개되는가
C3: 갈등이나 문제가 발생하는가 (전개 부분)
C4: 400자 이상인가`,
    pass_rule: "C1~C4 모두 충족",
    not_evaluated: "절정·결말 (차시09에서), 맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 5, lesson_num: 9, lesson_id: "09",
    lesson_title: "절정·결말 초안",
    lesson_summary: "절정: 가장 긴장된 순간 — Show 기법 반드시. 결말: 갈등이 해결되고 인물이 어떻게 변화했는가. 갑작스러운 결말 금지.",
    assignment: "이야기의 절정 + 결말 초안 작성 (400자 이상). 절정에서 Show 기법 반드시 사용. 결말에서 인물의 변화 또는 교훈 포함.",
    criteria: `C1: 절정 장면이 있는가 (가장 긴장된 순간)
C2: 절정 장면에 Show 기법이 사용되었는가 (감정 직접 서술 최소화)
C3: 결말이 있는가 (갈등 해결)
C4: 결말에서 인물의 변화나 교훈이 드러나는가
C5: 400자 이상인가`,
    pass_rule: "C1~C5 모두 충족",
    not_evaluated: "맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 5, lesson_num: 10, lesson_id: "10",
    lesson_title: "전체 흐름 점검",
    lesson_summary: "이야기 점검 질문: 지루한 부분은 없는가? / 절정이 충분히 긴장감 있는가? / 결말이 갑작스럽지 않은가? / 인물의 변화가 자연스러운가?",
    assignment: "지금까지 쓴 이야기 전체를 점검하고 수정하기. 수정한 내용과 이유를 간단히 메모해서 함께 제출.",
    criteria: `C1: 수정된 이야기가 있는가
C2: 수정 메모가 있는가 (무엇을 왜 수정했는지)
C3: 수정 후 이야기의 4막 구조가 유지되는가
C4: 수정을 통해 이야기의 흐름이나 긴장감이 개선되었는가`,
    pass_rule: "C1·C2 필수, C3·C4 중 하나 이상 개선됨",
    not_evaluated: "맞춤법 (차시11에서)",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 5, lesson_num: 11, lesson_id: "11",
    lesson_title: "맞춤법·문장 부호 최종 점검",
    lesson_summary: "이야기 글 맞춤법 점검: 대화 문장 부호, 됐다/됬다, 며칠/몇일, 안 했다(띄어쓰기). 소리 내어 읽으면 어색한 문장이 더 잘 보임.",
    assignment: "이야기 전체에서 맞춤법·문장 부호 오류를 스스로 찾아 수정하기. 오류 목록(무엇을 어떻게 수정했는지) 간단히 메모.",
    criteria: `C1: 수정된 이야기가 있는가
C2: 오류 목록이 있는가 (스스로 찾은 오류라도)
C3: 대화 문장 부호(큰따옴표)가 올바르게 쓰였는가
C4: 됐다/됩니다/며칠 등 기본 맞춤법 오류가 줄었는가`,
    pass_rule: "C1·C2 필수, C3·C4 확인",
    not_evaluated: "내용·구조 (차시10에서 완료)",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 5, lesson_num: 12, lesson_id: "12",
    lesson_title: "Show 기법 강화",
    lesson_summary: "이야기 전체를 다시 읽고 Tell 표현을 찾아 Show로 바꾸기. 수정 전/후를 나란히 보면 Show의 효과를 바로 느낄 수 있음.",
    assignment: "이야기 전체에서 Tell 표현(감정 직접 서술) 3개를 찾아 Show 기법으로 바꾸기. 수정 전/후를 나란히 제출.",
    criteria: `C1: 수정 전/후 나란히 3세트가 있는가
C2: 각 수정본에서 Tell 표현이 Show 기법(행동·대화·감각)으로 바뀌었는가
C3: 수정 후에도 장면의 의미가 유지되는가 (내용이 달라지지 않음)`,
    pass_rule: "C1·C2·C3 모두 충족",
    not_evaluated: "맞춤법",
    model: SONNET, max_tokens: 1400, is_rubric: false,
  },
  {
    stage: 5, lesson_num: 13, lesson_id: "13",
    lesson_title: "최종 과제 계획",
    lesson_summary: "5단계 종합 복습. 최종 이야기 계획: 4막 구성표 + 인물 카드 + Show 기법 사용할 장면 3곳 계획 + 대화 포함 계획.",
    assignment: "새 주제(또는 기존 이야기 완성)로 최종 이야기 계획 완성. 4막 구성표 + 인물 카드 + Show 기법 쓸 장면 3곳 표시.",
    criteria: `C1: 4막 구성표가 있는가
C2: 주인공 인물 카드가 있는가
C3: Show 기법을 쓸 장면 3곳이 계획되어 있는가
C4: 대화가 포함될 장면이 표시되어 있는가`,
    pass_rule: "C1·C2·C3·C4 모두 충족",
    not_evaluated: "실제 집필 완성도 (차시14에서 평가)",
    model: HAIKU, max_tokens: 900, is_rubric: false,
  },
  {
    stage: 5, lesson_num: 14, lesson_id: "14",
    lesson_title: "최종 과제 — 루브릭 종합 평가",
    lesson_summary: "5단계 전체 복습 후 최종 이야기 작성. 루브릭 5항목 × 4점 = 20점 만점. 15점 이상 6단계 진급.",
    assignment: "이야기 완성 (900자 이상). 조건: 4막 구조, Show 기법 3곳 이상, 대화 포함, 배경 묘사 감각 2가지 이상.",
    criteria: `R1: 구조(4점) — 4막 구조 명확, 발단-전개-절정-결말 자연스러운 흐름
R2: 인물(4점) — 행동·대화로 인물 성격 드러남, 입체적 표현
R3: Show 기법(4점) — 감정을 직접 서술하지 않고 Show로 표현한 곳 3개 이상
R4: 배경 묘사(4점) — 5감 중 2가지 이상 사용한 생생한 묘사
R5: 분량(4점) — 900자 이상`,
    pass_rule: "총점 15점 이상 합격. 각 항목 점수 합 = total과 반드시 일치.",
    not_evaluated: "없음",
    model: SONNET, max_tokens: 1800, is_rubric: true,
  },
];
