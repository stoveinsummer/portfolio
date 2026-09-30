import type { InvestmentRecord } from "@/types/content";
import {calculatePriceIndex} from "@/lib/investment-index";

export function PortfolioGrowthChart({ records }: { records: InvestmentRecord[] }) {
  const indices=calculatePriceIndex(records);
  const points=[...records].sort((a,b)=>a.date.localeCompare(b.date)).flatMap(record=>{const index=indices.get(record.id);return index==null?[]:[{date:record.date,marketCloseDate:record.marketCloseDate,growthIndex:index}];});
  const values = points.map((point) => point.growthIndex);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const coordinates = points.map((point, index) => {
    const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100;
    const y = 88 - ((point.growthIndex - min) / range) * 64;
    return { x, y };
  });
  const lineThickness = 0.8;
  const polygon = [
    ...coordinates.map(({ x, y }) => `${x}% ${y - lineThickness}%`),
    ...[...coordinates].reverse().map(({ x, y }) => `${x}% ${y + lineThickness}%`),
  ].join(", ");
  const start = points[0]?.growthIndex ?? 100;
  const latest = points.at(-1)?.growthIndex ?? start;
  const change = latest - start;

  return (
    <section className="growth-section" aria-labelledby="growth-title">
      <div className="growth-head">
        <div>
          <p className="eyebrow">Normalized · Base 100</p>
          <h2 id="growth-title">기록의 흐름</h2>
        </div>
        <div className="growth-summary">
          <strong>{latest.toFixed(1)}</strong>
          <span>{change >= 0 ? "+" : ""}{change.toFixed(1)}p · {points.at(-1)?.marketCloseDate} 종가</span>
        </div>
      </div>
      <div className="growth-chart" role="img" aria-label={`포트폴리오 지수 ${points.map((point) => `${point.date} ${point.growthIndex}`).join(", ")}`}>
        <div className="growth-grid" aria-hidden="true" />
        {points.length > 1 && <div className="growth-line" style={{ clipPath: `polygon(${polygon})` }} aria-hidden="true" />}
        <div className="growth-points">
          {points.map((point, index) => {
            const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100;
            const y = 88 - ((point.growthIndex - min) / range) * 64;
            return <i key={point.date} style={{ left: `${x}%`, top: `${y}%` }} title={`${point.date} · ${point.growthIndex}`} />;
          })}
        </div>
        <div className="growth-labels">
          {points.map((point) => <span key={point.date}><b>{point.growthIndex.toFixed(1)}</b>{point.date.replace("-", ".")}</span>)}
        </div>
      </div>
      <p className="growth-note">첫 기록(2026.06.30)=100. 기록된 비중에 종가 변화를 적용한 가격 지수입니다. 현금·기타는 고정하며 분배금, 입출금, 환율은 제외합니다.</p>
    </section>
  );
}
