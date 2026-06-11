// 진단 엔진 — 별쌤-평가준거틀 6장 + 통합-검사-조립-규칙 v1.0 구현
// 흐름: 워밍업(미반영) → 1차 라우팅(영역별 2·4·6단계 앵커) → 후보 대역 → 2차 확인 → 영역 단계 판정 → 가중평균 → 종합 단계

export type Kind = "reading" | "writing";

export interface Item {
  item_id: string;
  level: number;
  domain: string;
  domain_code: string;
  item_type: string;
  question_text: string;
  choices: string[];
  answer: number | number[];
  explanation: string;
  passage_id: string | null;
  difficulty_tier: "easy" | "medium" | "hard";
  is_warmup?: boolean;
}

export interface Passage {
  passage_id: string;
  level: number;
  text: string;
  genre?: string;
  topic?: string;
}

export interface Bank {
  items: Item[];
  passages: Passage[];
}

export const DOMAINS: Record<Kind, { code: string; name: string; weight: number }[]> = {
  reading: [
    { code: "VOC", name: "어휘력", weight: 0.15 },
    { code: "LIT", name: "사실적 이해", weight: 0.25 },
    { code: "INF", name: "추론적 이해", weight: 0.25 },
    { code: "CRT", name: "비판적 이해", weight: 0.2 },
    { code: "STR", name: "구조 파악", weight: 0.15 },
  ],
  writing: [
    { code: "IDE", name: "내용 생성", weight: 0.25 },
    { code: "ORG", name: "글 조직", weight: 0.25 },
    { code: "EXP", name: "표현", weight: 0.2 },
    { code: "CVN", name: "어법과 규범", weight: 0.15 },
    { code: "REV", name: "고쳐쓰기", weight: 0.15 },
  ],
};

const ANCHOR_LEVELS = [2, 4, 6];

export type Band = "1-2" | "2-3" | "3-4" | "4-5" | "5-7";

// 후보 대역 → 2차 확인 문항의 단계 구성 (조립 규칙 3.2)
const BAND_PLAN: Record<Band, number[]> = {
  "1-2": [1, 2, 2],
  "2-3": [2, 2, 3],
  "3-4": [3, 4, 4],
  "4-5": [4, 4, 5],
  "5-7": [5, 6, 7],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(pool: Item[], n: number, used: Set<string>): Item[] {
  const out: Item[] = [];
  for (const it of shuffle(pool)) {
    if (out.length >= n) break;
    if (used.has(it.item_id)) continue;
    out.push(it);
    used.add(it.item_id);
  }
  return out;
}

/** 워밍업 2문항 — 1단계, 지문 없는 독립형, 점수 미반영 */
export function buildWarmup(bank: Bank, used: Set<string>): Item[] {
  const pool = bank.items.filter(
    (i) => i.level === 1 && !i.passage_id && i.difficulty_tier === "easy"
  );
  const fallback = bank.items.filter((i) => i.level === 1 && !i.passage_id);
  const picked = pick(pool, 2, used);
  if (picked.length < 2) picked.push(...pick(fallback, 2 - picked.length, used));
  return picked;
}

export interface AnchorSet {
  a2: Item[]; // 영역별 2단계 앵커 (항상 출제)
  a4: Item[]; // 영역별 4단계 앵커 (항상 출제)
  a6ByDomain: Record<string, Item>; // 6단계 앵커 — 해당 영역 4단계 정답 시에만 출제 (사다리식)
}

/** 1차 라우팅 앵커 선발 — 영역별 2·4·6단계 (medium 우선).
 *  6단계는 사다리식: 4단계를 통과한 영역에만 제시해 어린 학생의 체감 난도를 낮춘다.
 *  6단계 미제시 = 오답 처리 — 별쌤 8케이스 표에서 해당 행은 보수 배정과 동일/유사. */
export function buildAnchorSet(bank: Bank, kind: Kind, used: Set<string>): AnchorSet {
  const pickAnchor = (domain: string, lv: number): Item | null => {
    const pool = bank.items.filter(
      (i) => i.domain_code === domain && i.level === lv
    );
    const medium = pool.filter((i) => i.difficulty_tier === "medium");
    return pick(medium.length ? medium : pool, 1, used)[0] ?? null;
  };
  const a2: Item[] = [];
  const a4: Item[] = [];
  const a6ByDomain: Record<string, Item> = {};
  for (const d of DOMAINS[kind]) {
    const i2 = pickAnchor(d.code, ANCHOR_LEVELS[0]);
    const i4 = pickAnchor(d.code, ANCHOR_LEVELS[1]);
    const i6 = pickAnchor(d.code, ANCHOR_LEVELS[2]);
    if (i2) a2.push(i2);
    if (i4) a4.push(i4);
    if (i6) a6ByDomain[d.code] = i6;
  }
  return { a2, a4, a6ByDomain };
}

/** 같은 지문을 공유하는 문항을 연속 배치 (조립 규칙 3.4 — 지문을 두 번 읽지 않게) */
export function groupByPassage(items: Item[]): Item[] {
  const out: Item[] = [];
  const taken = new Set<number>();
  items.forEach((it, i) => {
    if (taken.has(i)) return;
    out.push(it);
    taken.add(i);
    if (it.passage_id) {
      items.forEach((other, j) => {
        if (!taken.has(j) && other.passage_id === it.passage_id) {
          out.push(other);
          taken.add(j);
        }
      });
    }
  });
  return out;
}

/** 앵커 정오(2·4·6단계) → 후보 대역 (조립 규칙 3.2 전수표) */
export function decideBand(a2: boolean, a4: boolean, a6: boolean): Band {
  if (!a2 && !a4) return "1-2"; // (X,X,X), (X,X,O 이상반응)
  if (a2 && !a4 && !a6) return "2-3";
  if ((a2 && !a4 && a6) || (!a2 && a4 && !a6)) return "3-4"; // 이상반응 보수 배정
  if (a2 && a4 && !a6) return "4-5";
  return "5-7"; // (O,O,O), (X,O,O 이상반응)
}

/** 2차 확인 — 영역별 대역에 맞는 3문항 (1차와 지문 중복 회피) */
export function buildPhase2(
  bank: Bank,
  kind: Kind,
  bands: Record<string, Band>,
  used: Set<string>,
  usedPassages: Set<string>
): Item[] {
  const out: Item[] = [];
  for (const d of DOMAINS[kind]) {
    const plan = BAND_PLAN[bands[d.code]];
    for (const lv of plan) {
      const pool = bank.items.filter(
        (i) => i.domain_code === d.code && i.level === lv
      );
      const fresh = pool.filter(
        (i) => !i.passage_id || !usedPassages.has(i.passage_id)
      );
      const picked = pick(fresh.length ? fresh : pool, 1, used);
      for (const p of picked) if (p.passage_id) usedPassages.add(p.passage_id);
      out.push(...picked);
    }
  }
  return out;
}

export interface Answered {
  item: Item;
  correct: boolean;
  phase: "warmup" | "p1" | "p2";
  idk?: boolean; // "잘 모르겠어요" 응답 (오답 처리, 분석용 기록)
}

/**
 * 영역 단계 판정 — "안정적으로 통과한 최상위 단계" (준거틀 6.3)
 * 단계 통과: 해당 단계 증거 문항(앵커+2차)의 정답 비율 ≥ 0.6
 * 낮은 단계가 미통과면 그 아래에서 멈춘다 (낮은 단계 우선)
 */
export function judgeDomainLevel(answered: Answered[], domainCode: string): number {
  const evidence = answered.filter(
    (a) => a.phase !== "warmup" && a.item.domain_code === domainCode
  );
  const byLevel = new Map<number, { total: number; correct: number }>();
  for (const a of evidence) {
    const e = byLevel.get(a.item.level) ?? { total: 0, correct: 0 };
    e.total++;
    if (a.correct) e.correct++;
    byLevel.set(a.item.level, e);
  }
  const levels = [...byLevel.keys()].sort((x, y) => x - y);
  let result = 1;
  for (const lv of levels) {
    const e = byLevel.get(lv)!;
    if (e.correct / e.total >= 0.6) {
      result = lv;
    } else {
      break; // 첫 미통과 단계에서 중단
    }
  }
  return result;
}

/** 가중 평균 → 종합 단계 변환 (준거틀 6.2 기준표) */
export function overallLevel(domainLevels: Record<string, number>, kind: Kind) {
  const avg = DOMAINS[kind].reduce(
    (sum, d) => sum + (domainLevels[d.code] ?? 1) * d.weight,
    0
  );
  const TABLE: [number, number, number][] = [
    [1.0, 1.4, 1], [1.5, 2.4, 2], [2.5, 3.4, 3], [3.5, 4.4, 4],
    [4.5, 5.4, 5], [5.5, 6.4, 6], [6.5, 7.0, 7],
  ];
  let level = 1;
  for (const [lo, hi, lv] of TABLE) {
    if (avg >= lo - 0.049 && avg <= hi + 0.049) level = lv;
  }
  // 경계선: 가중 평균이 단계 경계 ±0.2 안이면 범위 표기 (준거틀 6.4)
  const boundaries = [1.45, 2.45, 3.45, 4.45, 5.45, 6.45];
  const borderline = boundaries.some((b) => Math.abs(avg - b) <= 0.2);
  return { avg: Math.round(avg * 100) / 100, level, borderline };
}

/** 영역 편차 알림 (최대-최소 ≥ 3단계) */
export function deviationNotice(domainLevels: Record<string, number>, kind: Kind) {
  const entries = DOMAINS[kind].map((d) => ({
    code: d.code,
    name: d.name,
    level: domainLevels[d.code] ?? 1,
  }));
  const max = entries.reduce((a, b) => (b.level > a.level ? b : a));
  const min = entries.reduce((a, b) => (b.level < a.level ? b : a));
  if (max.level - min.level >= 3) {
    return { strong: max, weak: min };
  }
  return null;
}

/** 정오 채점 — 객관식 + 순서 배열형 모두 지원 */
export function isCorrect(item: Item, response: number | number[]): boolean {
  if (Array.isArray(item.answer)) {
    return (
      Array.isArray(response) &&
      response.length === item.answer.length &&
      response.every((v, i) => v === (item.answer as number[])[i])
    );
  }
  return response === item.answer;
}
