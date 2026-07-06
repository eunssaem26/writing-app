// 서버 진단 세션 ↔ 클라이언트 공유 타입 (정답/해설 없음, 클라이언트 안전)
import type { Kind } from "./engine";
import type { deviationNotice } from "./engine";

export type Phase = "warmup" | "p1" | "p2";

/** 클라이언트로 내려가는 문항 — answer/explanation 제거, 순서형 여부만 boolean으로 노출 */
export interface ClientItem {
  item_id: string;
  domain: string;
  domain_code: string;
  question_text: string;
  choices: string[];
  passage_id: string | null;
  ordering: boolean;
  phase: Phase;
}

/** 학생 응답 — 정답 여부는 담기지 않는다(서버가 채점) */
export interface ClientResponse {
  id: string;
  response: number | number[] | null;
  idk: boolean;
}

export interface FinalResult {
  kind: Kind;
  domainLevels: Record<string, number>;
  avg: number;
  level: number;
  borderline: boolean;
  deviation: ReturnType<typeof deviationNotice>;
  correct: number;
  wrong: number;
  detailItems: {
    item_id: string;
    level: number;
    domain: string;
    correct: boolean;
    phase: Phase;
    idk?: boolean;
  }[];
}

/** 서버 응답 — 다음 문항 배치 또는 최종 결과 */
export interface SessionBatch {
  items?: ClientItem[];
  passages?: Record<string, string>;
  token?: string;
  result?: FinalResult;
  saved?: boolean;
}
