export const dynamic="force-dynamic";
import { Comments } from "@/components/Comments";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AllocationChart } from "@/components/AllocationChart";
import { ArchiveNavigation } from "@/components/ArchiveNavigation";
import { HoldingsTable } from "@/components/HoldingsTable";
import { InvestmentDashboard } from "@/components/InvestmentDashboard";
import { listContent } from "@/lib/content-store";
import {ContentActions} from "@/components/ContentActions";
import {getChatGPTUser} from "@/app/chatgpt-auth";
import {isOwner} from "@/lib/owner";
import {calculatePriceIndex} from "@/lib/investment-index";
import {ownerInvestment} from "@/lib/investment-private";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const investments=await listContent("invest"); const record = investments.find((item) => item.id === id); return { title: record?.title ?? "Invest", description: record?.review }; }

export default async function InvestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const investments=await listContent("invest");
  const index = investments.findIndex((item) => item.id === id);
  const record = investments[index];
  if (!record) notFound();
  const newer = investments[index - 1];
  const older = investments[index + 1];
  const owner=isOwner(await getChatGPTUser());
  const modelIndex=calculatePriceIndex(investments).get(record.id)??null;
  const hasQuantityRecords = owner && record.portfolio.some((item) => item.quantity);

  return <main className="portfolio"><SiteHeader active="Invest" /><ContentActions kind="invest" id={id}/><article className="detail record-detail">
    <div className="detail-head"><p className="eyebrow">Investment review · {record.date}</p><h1>{record.title}</h1><p>{record.review}</p></div>
    <div className="notice">{hasQuantityRecords ? "개인 투자 기록이며 투자 권유가 아닙니다. 보유 수량은 본인에게만 표시됩니다. 기록된 달러 평가액은 다른 방문자에게 표시되지 않습니다." : "개인 투자 기록이며 투자 권유가 아닙니다. 방문자에게는 종목별 비중과 종가 기준 지수를 보여줍니다."}</div>
    <InvestmentDashboard record={owner?ownerInvestment(record):record} modelIndex={modelIndex} owner={owner} />
    <section className="record-allocation"><div className="invest-section-head"><div><p className="eyebrow">{hasQuantityRecords ? "Holdings" : "Allocation"}</p><h2>{hasQuantityRecords ? "보유 현황" : "비중 구성"}</h2></div><p>{hasQuantityRecords ? `${record.portfolio.length}개 자산의 종목·수량 상세 기록입니다.` : "당시 남긴 자산별 비중 기록입니다."}</p></div><AllocationChart items={record.portfolio} />{hasQuantityRecords ? <HoldingsTable items={record.portfolio} owner={owner} /> : <p className="historical-holdings-note">종목별 비중을 확인할 수 있습니다.</p>}</section>
    <section className="monthly-opinion"><p className="eyebrow">Monthly thesis</p><h2>이번 달 투자 해설</h2><blockquote>{record.review}</blockquote></section>
    <section className="record-decisions"><p className="eyebrow">Decision log</p><h2>이번 달 판단</h2><ol>{record.decisions.map((decision, itemIndex) => <li key={decision}><span>{String(itemIndex + 1).padStart(2, "0")}</span>{decision}</li>)}</ol></section>
    <section className="market-news"><div className="market-news-head"><p className="eyebrow">Market context</p><h2>이번 달 시장 이슈</h2></div><article><span>KR</span><h3>국내 시장</h3><p>{record.marketNews?.korea ?? "기록되지 않음"}</p></article><article><span>US</span><h3>미국 시장</h3><p>{record.marketNews?.us ?? "기록되지 않음"}</p></article></section>
    <ArchiveNavigation previous={older ? { href: `/invest/${older.id}`, label: older.date } : null} next={newer ? { href: `/invest/${newer.id}`, label: newer.date } : null} backHref="/invest" backLabel="투자 기록 목록" />
  </article><Comments postKey={`invest:${id}`}/><SiteFooter /></main>;
}
