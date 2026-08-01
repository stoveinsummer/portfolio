import type { InvestmentRecord } from "@/types/content";

const signed = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

export function InvestmentDashboard({ record, startIndex }: { record: InvestmentRecord; startIndex: number }) {
  const hasQuantityRecords = record.portfolio.some((item) => item.quantity);
  const topHolding = [...record.portfolio].sort((a, b) => b.weight - a.weight)[0];
  const measured = record.portfolio.filter((item) => item.returnRate !== null);
  const measuredWeight = measured.reduce((sum, item) => sum + item.weight, 0);
  const weightedReturn = measuredWeight
    ? measured.reduce((sum, item) => sum + item.weight * (item.returnRate ?? 0), 0) / measuredWeight
    : 0;
  const indexChange = record.growthIndex - startIndex;

  return <section className="invest-dashboard" aria-label="최신 포트폴리오 핵심 지표">
    <div className="invest-dashboard-lead">
      <p className="eyebrow">Portfolio snapshot · {record.date}</p>
      <span className="dashboard-index-label">Normalized index</span>
      <strong>{record.growthIndex.toFixed(1)}</strong>
      <em className={indexChange >= 0 ? "positive" : "negative"}>{signed(indexChange)} since start</em>
    </div>
    <dl>
      <div><dt>보유 자산</dt><dd>{record.portfolio.length}<small>positions</small></dd></div>
      <div><dt>최대 비중</dt><dd>{topHolding?.weight.toFixed(1)}%<small>{topHolding?.symbol}</small></dd></div>
      <div><dt>가중 보유 수익률</dt><dd className={weightedReturn >= 0 ? "positive" : "negative"}>{signed(weightedReturn)}<small>공개 종목 기준</small></dd></div>
      <div><dt>공개 범위</dt><dd className="privacy-value">{hasQuantityRecords ? "비중·수량" : "비중"}<small>{hasQuantityRecords ? "수량 기록 2026-08 시작" : "수량 기록 시작 전"}</small></dd></div>
    </dl>
  </section>;
}
