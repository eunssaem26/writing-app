/**
 * 모델이 JSON을 마크다운 코드 블록으로 감싸는 경우 제거
 */
export function stripJson(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  const lines = trimmed.split("\n");
  const inner = lines[lines.length - 1].trim() === "```"
    ? lines.slice(1, -1)
    : lines.slice(1);
  return inner.join("\n").trim();
}
