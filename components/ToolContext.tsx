import type { ToolItem } from "@/types/content";

export function ToolContext({ tool }: { tool: ToolItem }) {
  return <section className="tool-context" aria-label="도구 제작 정보">
    <article><span>Why</span><h2>만든 이유</h2><p>{tool.reason}</p></article>
    <article><span>How</span><h2>핵심 동작</h2><p>{tool.coreAction}</p></article>
    <article><span>Privacy</span><h2>데이터 처리</h2><p>{tool.dataHandling}</p></article>
  </section>;
}
