import {
  buildPhase1, buildPhase2, buildWarmup, decideBand, DOMAINS,
  judgeDomainLevel, overallLevel, isCorrect,
  type Bank, type Band, type Answered, type Kind,
} from "../src/lib/diagnosis/engine.ts";
import fs from "node:fs";

function simulate(kind: Kind, trueLevel: number, bank: Bank): number {
  const used = new Set<string>();
  const usedPassages = new Set<string>();
  const answered: Answered[] = [];
  const answerAs = (item: any) => item.level <= trueLevel; // 자기 수준 이하 = 정답

  buildWarmup(bank, used); // 미반영
  const p1 = buildPhase1(bank, kind, used);
  p1.forEach((i) => { answered.push({ item: i, correct: answerAs(i), phase: "p1" }); if (i.passage_id) usedPassages.add(i.passage_id); });

  const bands: Record<string, Band> = {};
  for (const d of DOMAINS[kind]) {
    const anchors = answered.filter((a) => a.item.domain_code === d.code);
    const at = (lv: number) => anchors.find((a) => a.item.level === lv)?.correct ?? false;
    bands[d.code] = decideBand(at(2), at(4), at(6));
  }
  const p2 = buildPhase2(bank, kind, bands, used, usedPassages);
  p2.forEach((i) => answered.push({ item: i, correct: answerAs(i), phase: "p2" }));

  const domainLevels: Record<string, number> = {};
  for (const d of DOMAINS[kind]) domainLevels[d.code] = judgeDomainLevel(answered, d.code);
  return overallLevel(domainLevels, kind).level;
}

for (const kind of ["reading", "writing"] as Kind[]) {
  const bank = JSON.parse(fs.readFileSync(`src/data/diagnosis/${kind}.json`, "utf8")) as Bank;
  const results: string[] = [];
  let allOk = true;
  for (let lv = 1; lv <= 7; lv++) {
    // 무작위 출제 변동 고려해 5회 반복
    const outs = Array.from({ length: 5 }, () => simulate(kind, lv, bank));
    const ok = outs.every((o) => Math.abs(o - lv) <= 1) && outs.filter((o) => o === lv).length >= 3;
    if (!ok) allOk = false;
    results.push(`진짜${lv} → 판정 [${outs.join(",")}] ${ok ? "OK" : "❌"}`);
  }
  console.log(`=== ${kind} ===\n` + results.join("\n") + (allOk ? "\n전체 통과" : "\n⚠️ 확인 필요"));
}
