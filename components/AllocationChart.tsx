import type { PortfolioItem } from "@/types/content";

const colors = ["#d9ff43", "#8b4f33", "#9cb7aa", "#c8c2b5", "#687c92"];

export function AllocationChart({ items }: { items: PortfolioItem[] }) {
  let cursor = 0;
  const stops = items.map((item, index) => { const start = cursor; cursor += item.weight; return `${colors[index % colors.length]} ${start}% ${cursor}%`; }).join(", ");
  return <div className="allocation"><div className="donut" style={{ background: `conic-gradient(${stops})` }} aria-label={items.map((item) => `${item.symbol} ${item.weight}%`).join(", ")} /><ul>{items.map((item, index) => <li key={item.symbol}><i style={{ background: colors[index % colors.length] }} /><strong>{item.symbol}</strong><span>{item.weight}%</span><em>{item.returnRate === null ? "—" : `${item.returnRate > 0 ? "+" : ""}${item.returnRate}%`}</em></li>)}</ul></div>;
}
