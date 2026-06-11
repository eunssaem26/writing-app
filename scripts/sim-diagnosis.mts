import {
  buildAnchorSet, buildPhase2, buildWarmup, decideBand, DOMAINS,
  judgeDomainLevel, overallLevel,
  type Bank, type Band, type Answered, type Kind, type Item,
} from "../src/lib/diagnosis/engine.ts";
import fs from "node:fs";

function simulate(kind: Kind, trueLevel: number, bank: Bank) {
  const used = new Set<string>();
  const usedPassages = new Set<string>();
  const answered: Answered[] = [];
  const answerAs = (item: Item) => item.level <= trueLevel;
  let itemCount = 0;
  let maxLevelSeen = 0;

  buildWarmup(bank, used);
  const anchors = buildAnchorSet(bank, kind, used);
  for (const i of [...anchors.a2, ...anchors.a4]) {
    answered.push({ item: i, correct: answerAs(i), phase: "p1" });
    itemCount++; maxLevelSeen = Math.max(maxLevelSeen, i.level);
    if (i.passage_id) usedPassages.add(i.passage_id);
  }
  // 사다리식: 4단계 통과 영역만 6단계 앵커
  for (const d of DOMAINS[kind]) {
    const a4ok = answered.some((a) => a.item.domain_code === d.code && a.item.level === 4 && a.correct);
    const i6 = anchors.a6ByDomain[d.code];
    if (a4ok && i6) {
      answered.push({ item: i6, correct: answerAs(i6), phase: "p1" });
      itemCount++; maxLevelSeen = Math.max(maxLevelSeen, i6.level);
      if (i6.passage_id) usedPassages.add(i6.passage_id);
    }
  }
  const bands: Record<string, Band> = {};
  for (const d of DOMAINS[kind]) {
    const a = answered.filter((x) => x.item.domain_code === d.code);
    const at = (lv: number) => a.find((x) => x.item.level === lv)?.correct ?? false;
    bands[d.code] = decideBand(at(2), at(4), at(6));
  }
  const p2 = buildPhase2(bank, kind, bands, used, usedPassages);
  for (const i of p2) {
    answered.push({ item: i, correct: answerAs(i), phase: "p2" });
    itemCount++; maxLevelSeen = Math.max(maxLevelSeen, i.level);
  }
  const domainLevels: Record<string, number> = {};
  for (const d of DOMAINS[kind]) domainLevels[d.code] = judgeDomainLevel(answered, d.code);
  return { level: overallLevel(domainLevels, kind).level, itemCount, maxLevelSeen };
}

for (const kind of ["reading", "writing"] as Kind[]) {
  const bank = JSON.parse(fs.readFileSync(`src/data/diagnosis/${kind}.json`, "utf8")) as Bank;
  let allOk = true;
  const lines: string[] = [];
  for (let lv = 1; lv <= 7; lv++) {
    const runs = Array.from({ length: 5 }, () => simulate(kind, lv, bank));
    const outs = runs.map((r) => r.level);
    const ok = outs.every((o) => o === lv);
    if (!ok) allOk = false;
    lines.push(
      `진짜${lv} → 판정 [${outs.join(",")}] | 문항수 ${runs[0].itemCount} | 최고난도 ${runs[0].maxLevelSeen}단계 ${ok ? "OK" : "❌"}`
    );
  }
  console.log(`=== ${kind} ===\n` + lines.join("\n") + (allOk ? "\n전체 통과" : "\n⚠️ 확인 필요"));
}
