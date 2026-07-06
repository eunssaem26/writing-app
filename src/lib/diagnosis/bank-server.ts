import "server-only";
import readingJson from "@/data/diagnosis/reading.json";
import writingJson from "@/data/diagnosis/writing.json";
import type { Bank, Item, Kind } from "./engine";

// 정답(answer)·해설(explanation)이 포함된 원본 문항은행. 서버에서만 로드된다.
// "server-only" 임포트가 이 모듈이 클라이언트 번들에 들어가면 빌드를 실패시켜
// 정답이 브라우저로 새는 것을 구조적으로 막는다.
const BANKS: Record<Kind, Bank> = {
  reading: readingJson as unknown as Bank,
  writing: writingJson as unknown as Bank,
};

export function getBank(kind: Kind): Bank {
  return BANKS[kind];
}

export function findItem(kind: Kind, itemId: string): Item | undefined {
  return BANKS[kind].items.find((i) => i.item_id === itemId);
}

export function passageText(kind: Kind, passageId: string): string | undefined {
  return BANKS[kind].passages.find((p) => p.passage_id === passageId)?.text;
}
