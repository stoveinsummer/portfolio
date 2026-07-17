import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AllocationChart } from "@/components/AllocationChart";
import { ArchiveNavigation } from "@/components/ArchiveNavigation";
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

  return <main><SiteHeader active="Invest" /><article className="detail record-detail">
    <div className="detail-head"><p className="eyebrow">Investment review · {record.date}</p><h1>{record.title}</h1><p>{record.review}</p></div>
    <div className="notice">개인 투자 기록이며 투자 권유가 아닙니다. 총액·수량·매수금액은 기록하거나 공개하지 않습니다.</div>
    <AllocationChart items={record.portfolio} />
    <section className="monthly-opinion"><p className="eyebrow">One-line opinion</p><h2>이번 달 투자 의견</h2><blockquote>{record.review}</blockquote></section>
    <section className="market-news"><div className="market-news-head"><p className="eyebrow">Market context</p><h2>이달의 시장 뉴스</h2></div><article><span>KR</span><h3>국내 증시</h3><p>{record.marketNews?.korea ?? "기록하지 않음"}</p></article><article><span>US</span><h3>미국 증시</h3><p>{record.marketNews?.us ?? "기록하지 않음"}</p></article></section>
    <section><h2>이번 달 판단</h2><ol>{record.decisions.map((decision) => <li key={decision}>{decision}</li>)}</ol></section>
    <ArchiveNavigation previous={older ? { href: `/invest/${older.id}`, label: older.date } : null} next={newer ? { href: `/invest/${newer.id}`, label: newer.date } : null} backHref="/invest" backLabel="투자 기록 목록" />
  </article><SiteFooter /></main>;
}
