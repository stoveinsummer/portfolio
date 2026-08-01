import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageIntro } from "@/components/PageIntro";
import { AllocationChart } from "@/components/AllocationChart";
import { InvestmentDashboard } from "@/components/InvestmentDashboard";
import { HoldingsTable } from "@/components/HoldingsTable";
import { PortfolioGrowthChart } from "@/components/PortfolioGrowthChart";
import { investments } from "@/data/investments";

export const metadata: Metadata = { title: "Invest", description: "금액을 제외한 개인 투자 판단과 비중 기록.", alternates: { canonical: "https://stoveinsummer.github.io/portfolio/invest/" } };

export default function InvestPage() {
  const latest = investments[0];
  const startIndex = investments.at(-1)?.growthIndex ?? 100;

  return <main><SiteHeader active="Invest" />
    <PageIntro eyebrow="Portfolio · Allocation · Discipline" title="Invest records." description="총액과 계좌정보는 감추고, 자산 배분과 반복 가능한 투자 규칙을 기록합니다." />
    <section className="content-section invest-page">
      <div className="notice">개인 투자 기록이며 특정 종목에 대한 투자 권유가 아닙니다. 수익률은 과거 기록으로 미래 성과를 보장하지 않습니다.</div>
      <InvestmentDashboard record={latest} startIndex={startIndex} />

      <section className="invest-section-head"><div><p className="eyebrow">Current allocation</p><h2>현재 포트폴리오.</h2></div><p>{latest.review}</p></section>
      <div className="portfolio-panel"><AllocationChart items={latest.portfolio} /><HoldingsTable items={latest.portfolio} /></div>

      <section className="strategy-panel">
        <div><p className="eyebrow">Investment discipline</p><h2>시장보다 먼저<br />규칙을 확인합니다.</h2></div>
        <div><p>가격을 예측하기보다 정해둔 적립과 비중 원칙이 실제로 지켜졌는지를 월별로 점검합니다.</p><ol>{latest.decisions.map((decision, index) => <li key={decision}><span>{String(index + 1).padStart(2, "0")}</span>{decision}</li>)}</ol></div>
      </section>

      <PortfolioGrowthChart records={investments} />

      <section className="archive-methodology"><div><p className="eyebrow">Methodology</p><h2>공개 기준</h2></div><dl><div><dt>Performance</dt><dd>첫 기록을 100으로 환산한 상대 지수</dd></div><div><dt>Holdings</dt><dd>종목별 비중·수량·보유 수익률</dd></div><div><dt>Private</dt><dd>계좌 총액·평가금액·평단가·계좌정보</dd></div><div><dt>Frequency</dt><dd>월 1회 이상, 포트폴리오 화면 기준</dd></div></dl></section>

      <div className="list-head"><p className="eyebrow">Archive</p><h2>Monthly records</h2></div>
      <div className="record-list">{investments.map((record) => <Link href={`/invest/${record.id}`} key={record.id}><time>{record.date}</time><h3>{record.title}</h3><p>{record.review}</p><strong>{record.growthIndex.toFixed(1)}</strong><span>Review ↗</span></Link>)}</div>
    </section><SiteFooter />
  </main>;
}
