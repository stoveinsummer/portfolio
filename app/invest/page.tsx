import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageIntro } from "@/components/PageIntro";
import { AllocationChart } from "@/components/AllocationChart";
import { PortfolioGrowthChart } from "@/components/PortfolioGrowthChart";
import { investments } from "@/data/investments";

export const metadata: Metadata = { title: "Invest", description: "금액을 제외한 개인 투자 판단과 비중 기록." };
export default function InvestPage() { const latest = investments[0]; return <main><SiteHeader active="Invest" /><PageIntro eyebrow="Allocation, decisions, review" title="Invest records." description="규모나 계좌 정보는 공개하지 않고, 비중과 판단 과정만 기록합니다." /><section className="content-section"><div className="notice">이 페이지는 개인 투자 기록이며 특정 종목에 대한 투자 권유가 아닙니다.</div><div className="feature-record"><div><p className="eyebrow">Latest · {latest.date}</p><h2>{latest.title}</h2><p>{latest.review}</p><Link href={`/invest/${latest.id}`}>전체 기록 보기 ↗</Link></div><AllocationChart items={latest.portfolio} /></div><PortfolioGrowthChart records={investments} /><div className="list-head"><h2>Monthly records</h2></div><div className="record-list">{investments.map((record) => <Link href={`/invest/${record.id}`} key={record.id}><time>{record.date}</time><h3>{record.title}</h3><p>{record.review}</p><span>보기 ↗</span></Link>)}</div></section><SiteFooter /></main>; }
