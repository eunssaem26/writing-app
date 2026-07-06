import test from "node:test";
import assert from "node:assert/strict";
import { parseDiagDetail, parseFeedback } from "./report.ts";

// DB에 저장된 진단 detail / 수업 feedback(jsonb)을 방어적으로 파싱하는지 검증.

test("parseDiagDetail — 정상 detail", () => {
  const r = parseDiagDetail({
    domain_levels: { VOC: 3, LIT: 4, INF: 2 },
    weighted_avg: 3.1,
    borderline: true,
  });
  assert.deepEqual(r.domainLevels, { VOC: 3, LIT: 4, INF: 2 });
  assert.equal(r.weightedAvg, 3.1);
  assert.equal(r.borderline, true);
});

test("parseDiagDetail — 누락·이상 데이터도 안전", () => {
  assert.deepEqual(parseDiagDetail(null).domainLevels, {});
  assert.deepEqual(parseDiagDetail(undefined).domainLevels, {});
  assert.deepEqual(parseDiagDetail("junk").domainLevels, {});
  const r = parseDiagDetail({ domain_levels: { VOC: "x", LIT: 3 } });
  assert.deepEqual(r.domainLevels, { LIT: 3 }); // 숫자 아닌 값 제외
  assert.equal(r.weightedAvg, null);
  assert.equal(r.borderline, false);
});

test("parseFeedback — 정상 + 누락", () => {
  const ok = parseFeedback({ pass: true, score: { total: 8 }, result_label: "합격" });
  assert.equal(ok.pass, true);
  assert.equal(ok.scoreTotal, 8);
  assert.equal(ok.resultLabel, "합격");

  const partial = parseFeedback({ pass: false });
  assert.equal(partial.pass, false);
  assert.equal(partial.scoreTotal, null);

  const empty = parseFeedback(null);
  assert.equal(empty.pass, null);
  assert.equal(empty.scoreTotal, null);
  assert.equal(empty.resultLabel, "");
});
