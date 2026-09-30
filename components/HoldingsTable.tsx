import type { PortfolioItem } from "@/types/content";

export function HoldingsTable({ items, owner }: { items: PortfolioItem[]; owner: boolean }) {
  return <div className="holdings-table-wrap">
    <table className="holdings-table">
      <thead><tr><th>자산</th><th>분류</th>{owner && <th>수량</th>}<th>비중</th><th>수익률</th><th>가중 기여도</th></tr></thead>
      <tbody>{items.map((item) => {
        const contribution = item.returnRate === null ? null : item.weight * item.returnRate / 100;
        return <tr key={item.symbol}>
          <td><strong>{item.symbol}</strong><span>{item.name}</span></td>
          <td>{item.category}</td>
          {owner && <td>{item.quantity ?? "—"}</td>}
          <td><div className="allocation-cell"><span style={{ width: `${item.weight}%` }} /><b>{item.weight.toFixed(1)}%</b></div></td>
          <td className={item.returnRate !== null && item.returnRate >= 0 ? "positive" : item.returnRate !== null ? "negative" : ""}>{item.returnRate === null ? "—" : `${item.returnRate >= 0 ? "+" : ""}${item.returnRate.toFixed(1)}%`}</td>
          <td className={contribution !== null && contribution >= 0 ? "positive" : contribution !== null ? "negative" : ""}>{contribution === null ? "—" : `${contribution >= 0 ? "+" : ""}${contribution.toFixed(2)}%p`}</td>
        </tr>;
      })}</tbody>
    </table>
  </div>;
}
