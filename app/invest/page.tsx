export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageIntro } from "@/components/PageIntro";
import {getChatGPTUser} from "@/app/chatgpt-auth";
import {isOwner} from "@/lib/owner";
import {InvestmentTracker} from "@/components/InvestmentTracker";
import {PublicInvestmentLedger} from "@/components/PublicInvestmentLedger";
import {getPublicInvestmentSummary} from "@/lib/investment-public";
export const metadata: Metadata = { title: "투자 | JUHWAN" };
export default async function InvestPage() {
  const owner=isOwner(await getChatGPTUser()); const publicSummary=owner?null:await getPublicInvestmentSummary();
  return <main className="portfolio"><SiteHeader active="Invest"/><PageIntro eyebrow="INVESTMENT LOG" title="투자" description="월말 스냅샷과 소감, 시장 흐름을 한곳에 기록합니다."/>
    {owner&&<div className="content-section invest-page"><InvestmentTracker/></div>}
    {!owner&&publicSummary&&<div className="content-section invest-page"><PublicInvestmentLedger summary={publicSummary}/></div>}
    {!owner&&!publicSummary&&<section className="content-section surface-panel"><p className="tracker-empty">공개할 투자 흐름이 아직 없습니다.</p></section>}<SiteFooter/></main>;
}
