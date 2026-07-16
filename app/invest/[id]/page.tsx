import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AllocationChart } from "@/components/AllocationChart";
import { investments } from "@/data/investments";

export function generateStaticParams() { return investments.map(({ id }) => ({ id })); }
export default async function InvestDetail({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const record = investments.find((item) => item.id === id); if (!record) notFound(); return <main><SiteHeader active="Invest" /><article className="detail record-detail"><div className="detail-head"><p className="eyebrow">Investment review · {record.date}</p><h1>{record.title}</h1><p>{record.review}</p></div><div className="notice">개인 투자 기록이며 투자 권유가 아닙니다. 총액·수량·매수금액은 기록하지 않습니다.</div><AllocationChart items={record.portfolio} /><section><h2>이번 달 판단</h2><ol>{record.decisions.map((decision) => <li key={decision}>{decision}</li>)}</ol></section><Link className="back-link" href="/invest">← 투자 기록 목록</Link></article><SiteFooter /></main>; }
