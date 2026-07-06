import test from "node:test";
import assert from "node:assert/strict";
import {
  decideBand,
  deviationNotice,
  isCorrect,
  judgeDomainLevel,
  overallLevel,
  type Answered,
  type Item,
} from "./engine.ts";

// 진단 엔진의 결정적 판정 로직 회귀 테스트.
// (문항 선발 build* 함수는 무작위라 여기서는 채점·판정만 검증한다.)

function item(partial: Partial<Item>): Item {
  return {
    item_id: "X",
    level: 1,
    domain: "d",
    domain_code: "VOC",
    item_type: "multiple_choice",
    question_text: "",
    choices: ["a", "b", "c", "d"],
    answer: 0,
    explanation: "",
    passage_id: null,
    difficulty_tier: "medium",
    ...partial,
  };
}

function ans(domain: string, level: number, correct: boolean): Answered {
  return { item: item({ domain_code: domain, level }), correct, phase: "p1" };
}

test("isCorrect — 객관식", () => {
  assert.equal(isCorrect(item({ answer: 2 }), 2), true);
  assert.equal(isCorrect(item({ answer: 2 }), 1), false);
});

test("isCorrect — 순서배열형", () => {
  const it = item({ answer: [0, 1, 2] });
  assert.equal(isCorrect(it, [0, 1, 2]), true);
  assert.equal(isCorrect(it, [2, 1, 0]), false);
  assert.equal(isCorrect(it, [0, 1]), false); // 길이 불일치
});

test("decideBand — 앵커 정오 전수표", () => {
  assert.equal(decideBand(false, false, false), "1-2");
  assert.equal(decideBand(false, false, true), "1-2"); // 이상반응
  assert.equal(decideBand(true, false, false), "2-3");
  assert.equal(decideBand(true, false, true), "3-4"); // 이상반응 보수
  assert.equal(decideBand(false, true, false), "3-4"); // 이상반응 보수
  assert.equal(decideBand(true, true, false), "4-5");
  assert.equal(decideBand(true, true, true), "5-7");
  assert.equal(decideBand(false, true, true), "5-7"); // 이상반응
});

test("judgeDomainLevel — 안정 통과 최상위 단계, 첫 미통과서 중단", () => {
  // 1·2단계 통과(정답비율 ≥0.6), 3단계 미통과 → 2단계
  const answered: Answered[] = [
    ans("VOC", 1, true),
    ans("VOC", 2, true),
    ans("VOC", 3, false),
    ans("VOC", 4, true), // 3단계서 끊겨 무시돼야 함
  ];
  assert.equal(judgeDomainLevel(answered, "VOC"), 2);
});

test("judgeDomainLevel — 1단계부터 미통과면 1", () => {
  assert.equal(judgeDomainLevel([ans("VOC", 1, false)], "VOC"), 1);
});

test("judgeDomainLevel — 워밍업은 증거에서 제외", () => {
  const answered: Answered[] = [
    { item: item({ domain_code: "VOC", level: 5 }), correct: true, phase: "warmup" },
    ans("VOC", 1, true),
  ];
  assert.equal(judgeDomainLevel(answered, "VOC"), 1); // warmup 5단계 무시
});

test("overallLevel — 가중평균 → 종합 단계", () => {
  const all4 = { VOC: 4, LIT: 4, INF: 4, CRT: 4, STR: 4 };
  const r = overallLevel(all4, "reading");
  assert.equal(r.avg, 4);
  assert.equal(r.level, 4);

  const all1 = { VOC: 1, LIT: 1, INF: 1, CRT: 1, STR: 1 };
  assert.equal(overallLevel(all1, "reading").level, 1);
});

test("deviationNotice — 최대-최소 ≥3단계면 알림", () => {
  const dev = deviationNotice({ VOC: 6, LIT: 2, INF: 2, CRT: 2, STR: 2 }, "reading");
  assert.ok(dev);
  assert.equal(dev!.strong.level, 6);
  assert.equal(dev!.weak.level, 2);

  const none = deviationNotice({ VOC: 3, LIT: 3, INF: 3, CRT: 3, STR: 3 }, "reading");
  assert.equal(none, null);
});
