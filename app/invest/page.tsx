import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageIntro } from "@/components/PageIntro";
import { AllocationChart } from "@/components/AllocationChart";
import { PortfolioGrowthChart } from "@/components/PortfolioGrowthChart";
import { investments } from "@/data/investments";

export const metadata: Metadata = { title: "Invest", description: "금액을 제외한 개인 투자 판단과 비중 기록.", alternates: { canonical: "https://stoveinsummer.github.io/portfolio/invest/" } };
export default function InvestPage() { const latest = investments[0]; return <main><SiteHeader active="Invest" /><PageIntro eyebrow="Allocation, decisions, review" title="Invest records." description="규모나 계좌 정보는 공개하지 않고, 비중과 판단 과정만 기록합니다." /><section className="content-section"><div className="notice">이 페이지는 개인 투자 기록이며 특정 종목에 대한 투자 권유가 아닙니다.</div><section className="invest-method"><div><p className="eyebrow">Monthly archive · Every 25th</p><h2>숫자는 감추고,<br />흐름은 기록합니다.</h2></div><div className="invest-method-copy"><p>매월 25일 포트폴리오 화면을 기준으로 기록합니다. 계좌 잔액, 평가금액, 매수금액, 수량은 공개하지 않습니다.</p><ol><li><span>01</span>종목별 비중 구성</li><li><span>02</span>기준값 100의 상대 추이</li><li><span>03</span>그달의 투자 의견 한 줄</li><li><span>04</span>국내·미국 주요 뉴스 요약</li></ol></div></section><div className="feature-record"><div><p className="eyebrow">Latest · {latest.date}</p><h2>{latest.title}</h2><p>{latest.review}</p><Link href={`/invest/${latest.id}`}>전체 기록 보기 ↗</Link></div><AllocationChart items={latest.portfolio} /></div><PortfolioGrowthChart records={investments} /><div className="list-head"><h2>Monthly records</h2></div><div className="record-list">{investments.map((record) => <Link href={`/invest/${record.id}`} key={record.id}><time>{record.date}</time><h3>{record.title}</h3><p>{record.review}</p><span>보기 ↗</span></Link>)}</div></section><SiteFooter /></main>; }
