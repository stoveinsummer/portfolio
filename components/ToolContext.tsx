import type { ToolItem } from "@/types/content";
export function ToolContext({ tool }: { tool: ToolItem }) {
  return <details className="tool-context"><summary>사용 방법과 데이터 처리</summary><div><article><h2>만든 이유</h2><p>{tool.reason}</p></article><article><h2>사용 방법</h2><p>{tool.coreAction}</p></article><article><h2>데이터 처리</h2><p>{tool.dataHandling}</p></article></div></details>;
}
