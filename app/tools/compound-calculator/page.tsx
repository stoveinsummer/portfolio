import type { Metadata } from "next";
import Link from "next/link";
import { CompoundCalculator } from "@/components/CompoundCalculator";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = { title: "복리 계산기", description: "초기 투자금과 월 적립금의 복리 성장 과정을 계산하는 도구." };

export default function CompoundCalculatorPage() {
  return <main><SiteHeader active="Tools" /><div className="tool-detail-head"><p className="eyebrow">Tool 03 · Time & compound</p><h1>Compound<br /><i>calculator.</i></h1><p>초기금액과 월 적립금, 예상 수익률을 입력해 시간이 만드는 복리 성장 과정을 확인합니다.</p></div><div className="tool-detail-content"><CompoundCalculator /><Link className="back-link" href="/tools">← 도구 목록</Link></div><SiteFooter /></main>;
}
