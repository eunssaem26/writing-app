import "server-only";
import crypto from "node:crypto";
import {
  Answered,
  Band,
  DOMAINS,
  Item,
  Kind,
  buildAnchorSet,
  buildPhase2,
  buildWarmup,
  decideBand,
  deviationNotice,
  groupByPassage,
  isCorrect,
  judgeDomainLevel,
  overallLevel,
} from "./engine";
import { findItem, getBank, passageText } from "./bank-server";
import type {
  ClientItem,
  ClientResponse,
  FinalResult,
  Phase,
  SessionBatch,
} from "./session-types";

// 진단을 서버에서 채점·조율한다. 정답은 서버 문항은행에만 있고, 세션 상태는
// HMAC 서명된 토큰으로 클라이언트를 오간다. 토큰에는 (공개해도 되는) 출제 문항
// id·학생 응답만 담기고 정답/정오는 담기지 않으며, 서버가 매번 은행에서 재채점한다.
// → 학생이 토큰을 위·변조하면 서명이 깨지고, 정답도 알 수 없다.

type Stage = "base" | "a6" | "p2" | "done";

interface Served {
  id: string;
  phase: Phase;
}

interface SessionState {
  v: 1;
  kind: Kind;
  stage: Stage;
  served: Served[];
  responses: ClientResponse[];
  a6Ids: Record<string, string>; // domain_code → 6단계 앵커 item_id (사다리식 계획)
}

// ── 서명 ────────────────────────────────────────────────
function secret(): string {
  return (
    process.env.DIAG_SECRET ||
    process.env.SUPABASE_SECRET_KEY ||
    "dev-diagnosis-secret-change-in-prod"
  );
}

export function signState(state: SessionState): string {
  const payload = Buffer.from(JSON.stringify(state)).toString("base64url");
  const mac = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${mac}`;
}

function verifyState(token: string): SessionState | null {
  const dot = token.indexOf(".");
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(
      Buffer.from(payload, "base64url").toString()
    ) as SessionState;
  } catch {
    return null;
  }
}

// ── 헬퍼 ────────────────────────────────────────────────
function stripItem(item: Item, phase: Phase): ClientItem {
  return {
    item_id: item.item_id,
    domain: item.domain,
    domain_code: item.domain_code,
    question_text: item.question_text,
    choices: item.choices,
    passage_id: item.passage_id,
    ordering: Array.isArray(item.answer),
    phase,
  };
}

function batchPayload(kind: Kind, items: ClientItem[]): {
  items: ClientItem[];
  passages: Record<string, string>;
} {
  const passages: Record<string, string> = {};
  for (const it of items) {
    if (it.passage_id && !passages[it.passage_id]) {
      const text = passageText(kind, it.passage_id);
      if (text) passages[it.passage_id] = text;
    }
  }
  return { items, passages };
}

function reconstructAnswered(state: SessionState): Answered[] {
  const respMap = new Map(state.responses.map((r) => [r.id, r]));
  const out: Answered[] = [];
  for (const s of state.served) {
    const item = findItem(state.kind, s.id);
    if (!item) continue;
    const r = respMap.get(s.id);
    const idk = r?.idk ?? false;
    const correct =
      !idk && r != null && r.response != null
        ? isCorrect(item, r.response as number | number[])
        : false;
    out.push({ item, correct, phase: s.phase, ...(idk ? { idk: true } : {}) });
  }
  return out;
}

function usedSets(state: SessionState) {
  const used = new Set<string>();
  const usedPassages = new Set<string>();
  for (const s of state.served) {
    used.add(s.id);
    const item = findItem(state.kind, s.id);
    if (item?.passage_id) usedPassages.add(item.passage_id);
  }
  return { used, usedPassages };
}

// ── 세션 시작: 워밍업 + 2·4단계 앵커 ───────────────────────
export function startSession(kind: Kind): SessionBatch {
  const bank = getBank(kind);
  const used = new Set<string>();
  const warmup = buildWarmup(bank, used);
  const anchors = buildAnchorSet(bank, kind, used);
  const p1Base = [...groupByPassage(anchors.a2), ...groupByPassage(anchors.a4)];

  const servedItems: { item: Item; phase: Phase }[] = [
    ...warmup.map((item) => ({ item, phase: "warmup" as Phase })),
    ...p1Base.map((item) => ({ item, phase: "p1" as Phase })),
  ];

  const a6Ids: Record<string, string> = {};
  for (const [code, it] of Object.entries(anchors.a6ByDomain)) {
    a6Ids[code] = it.item_id;
  }

  const state: SessionState = {
    v: 1,
    kind,
    stage: "base",
    served: servedItems.map((s) => ({ id: s.item.item_id, phase: s.phase })),
    responses: [],
    a6Ids,
  };

  const items = servedItems.map((s) => stripItem(s.item, s.phase));
  return { ...batchPayload(kind, items), token: signState(state) };
}

// ── 다음 배치 또는 최종 결과 ───────────────────────────────
export function advanceSession(
  token: string,
  newResponses: ClientResponse[]
): SessionBatch | null {
  const state = verifyState(token);
  if (!state || state.stage === "done") return null;

  const kind = state.kind;
  const bank = getBank(kind);

  // 새 응답 병합 (출제된, 아직 미응답 문항만 — 중복/주입 방지)
  const answeredIds = new Set(state.responses.map((r) => r.id));
  const servedIds = new Set(state.served.map((s) => s.id));
  for (const r of newResponses) {
    if (r && typeof r.id === "string" && servedIds.has(r.id) && !answeredIds.has(r.id)) {
      state.responses.push({
        id: r.id,
        response: r.response ?? null,
        idk: !!r.idk,
      });
      answeredIds.add(r.id);
    }
  }

  // base 단계: 4단계 앵커를 맞힌 영역에만 6단계 앵커 제시 (사다리식)
  if (state.stage === "base") {
    const answered = reconstructAnswered(state);
    const qualified = DOMAINS[kind]
      .filter((d) =>
        answered.some(
          (a) =>
            a.phase === "p1" &&
            a.item.domain_code === d.code &&
            a.item.level === 4 &&
            a.correct
        )
      )
      .map((d) => state.a6Ids[d.code])
      .filter(Boolean) as string[];

    if (qualified.length > 0) {
      const a6Items = qualified
        .map((id) => findItem(kind, id))
        .filter((i): i is Item => Boolean(i));
      const grouped = groupByPassage(a6Items);
      state.stage = "a6";
      for (const it of grouped) state.served.push({ id: it.item_id, phase: "p1" });
      const items = grouped.map((it) => stripItem(it, "p1"));
      return { ...batchPayload(kind, items), token: signState(state) };
    }
    // 6단계 진출 영역 없음 → 곧장 2차로 (같은 호출에서 진행)
    state.stage = "a6";
  }

  // a6 단계(또는 건너뜀): 앵커 정오 → 대역 → 2차 확인 문항
  if (state.stage === "a6") {
    const answered = reconstructAnswered(state);
    const bands: Record<string, Band> = {};
    for (const d of DOMAINS[kind]) {
      const anchors = answered.filter(
        (a) => a.phase === "p1" && a.item.domain_code === d.code
      );
      const at = (lv: number) =>
        anchors.find((a) => a.item.level === lv)?.correct ?? false;
      bands[d.code] = decideBand(at(2), at(4), at(6));
    }
    const { used, usedPassages } = usedSets(state);
    const p2 = groupByPassage(buildPhase2(bank, kind, bands, used, usedPassages));
    state.stage = "p2";
    for (const it of p2) state.served.push({ id: it.item_id, phase: "p2" });
    const items = p2.map((it) => stripItem(it, "p2"));
    return { ...batchPayload(kind, items), token: signState(state) };
  }

  // p2 단계: 채점 완료 → 최종 판정
  const answered = reconstructAnswered(state);
  const domainLevels: Record<string, number> = {};
  for (const d of DOMAINS[kind]) {
    domainLevels[d.code] = judgeDomainLevel(answered, d.code);
  }
  const overall = overallLevel(domainLevels, kind);
  const scored = answered.filter((a) => a.phase !== "warmup");
  state.stage = "done";

  const result: FinalResult = {
    kind,
    domainLevels,
    avg: overall.avg,
    level: overall.level,
    borderline: overall.borderline,
    deviation: deviationNotice(domainLevels, kind),
    correct: scored.filter((a) => a.correct).length,
    wrong: scored.filter((a) => !a.correct).length,
    detailItems: scored.map((a) => ({
      item_id: a.item.item_id,
      level: a.item.level,
      domain: a.item.domain_code,
      correct: a.correct,
      phase: a.phase,
      ...(a.idk ? { idk: true } : {}),
    })),
  };
  return { result, token: signState(state) };
}
