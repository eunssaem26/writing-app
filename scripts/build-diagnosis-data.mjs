// item-bank의 단계별 문항·지문을 앱용 단일 JSON으로 합친다.
// 사용: node scripts/build-diagnosis-data.mjs  (item-bank 수정 후 재실행)
import fs from "node:fs";
import path from "node:path";

const ITEM_BANK = path.resolve(import.meta.dirname, "../../item-bank");
const OUT_DIR = path.resolve(import.meta.dirname, "../src/data/diagnosis");

function collect(kind) {
  const base = kind === "reading" ? ITEM_BANK : path.join(ITEM_BANK, "writing");
  const items = [];
  const passages = [];
  for (let lv = 1; lv <= 7; lv++) {
    const dir = path.join(base, `level-${lv}`);
    items.push(...JSON.parse(fs.readFileSync(path.join(dir, "items.json"))));
    try {
      passages.push(...JSON.parse(fs.readFileSync(path.join(dir, "passages.json"))));
    } catch {
      /* 지문 파일 없는 단계 허용 */
    }
  }
  return { items, passages };
}

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const kind of ["reading", "writing"]) {
  const data = collect(kind);
  fs.writeFileSync(
    path.join(OUT_DIR, `${kind}.json`),
    JSON.stringify(data) + "\n"
  );
  console.log(
    `${kind}: 문항 ${data.items.length}개, 지문 ${data.passages.length}개 → src/data/diagnosis/${kind}.json`
  );
}
