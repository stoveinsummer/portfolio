import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AllocationChart } from "@/components/AllocationChart";
import { ArchiveNavigation } from "@/components/ArchiveNavigation";
import { HoldingsTable } from "@/components/HoldingsTable";
import { InvestmentDashboard } from "@/components/InvestmentDashboard";
import { investments } from "@/data/investments";

export function generateStaticParams() { return investments.map(({ id }) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const record = investments.find((item) => item.id === id); return { title: record?.title ?? "Invest", description: record?.review, alternates: { canonical: `https://stoveinsummer.github.io/portfolio/invest/${id}/` } }; }

export default async function InvestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = investments.findIndex((item) => item.id === id);
  const record = investments[index];
  if (!record) notFound();
  const newer = investments[index - 1];
  const older = investments[index + 1];
  const startIndex = investments.at(-1)?.growthIndex ?? 100;
  const hasQuantityRecords = record.portfolio.some((item) => item.quantity);

  return <main><SiteHeader active="Invest" /><article className="detail record-detail">
    <div className="detail-head"><p className="eyebrow">Investment review · {record.date}</p><h1>{record.title}</h1><p>{record.review}</p></div>
    <div className="notice">{hasQuantityRecords ? "개인 투자 기록이며 투자 권유가 아닙니다. 총액·평단가·계좌정보는 공개하지 않고 종목별 비중과 수량만 기록합니다." : "개인 투자 기록이며 투자 권유가 아닙니다. 이 시점에는 비중만 기록했으며 종목별 수량 상세 기록은 2026년 8월부터 시작했습니다."}</div>
    <InvestmentDashboard record={record} startIndex={startIndex} />
    <section className="record-allocation"><div className="invest-section-head"><div><p className="eyebrow">{hasQuantityRecords ? "Holdings" : "Allocation"}</p><h2>{hasQuantityRecords ? "보유 현황" : "비중 구성"}</h2></div><p>{hasQuantityRecords ? `${record.portfolio.length}개 자산의 종목·수량 상세 기록입니다.` : "당시 남긴 자산별 비중 기록입니다."}</p></div><AllocationChart items={record.portfolio} />{hasQuantityRecords ? <HoldingsTable items={record.portfolio} /> : <p className="historical-holdings-note">종목별 수량 상세 기록은 2026년 8월부터 확인할 수 있습니다.</p>}</section>
    <section className="monthly-opinion"><p className="eyebrow">Monthly thesis</p><h2>이번 달 투자 해설</h2><blockquote>{record.review}</blockquote></section>
    <section className="record-decisions"><p className="eyebrow">Decision log</p><h2>이번 달 판단</h2><ol>{record.decisions.map((decision, itemIndex) => <li key={decision}><span>{String(itemIndex + 1).padStart(2, "0")}</span>{decision}</li>)}</ol></section>
    <section className="market-news"><div className="market-news-head"><p className="eyebrow">Market context</p><h2>이번 달 시장 이슈</h2></div><article><span>KR</span><h3>국내 시장</h3><p>{record.marketNews?.korea ?? "기록되지 않음"}</p></article><article><span>US</span><h3>미국 시장</h3><p>{record.marketNews?.us ?? "기록되지 않음"}</p></article></section>
    <ArchiveNavigation previous={older ? { href: `/invest/${older.id}`, label: older.date } : null} next={newer ? { href: `/invest/${newer.id}`, label: newer.date } : null} backHref="/invest" backLabel="투자 기록 목록" />
  </article><SiteFooter /></main>;
}
