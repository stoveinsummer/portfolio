import type { Metadata } from "next";
import { Braces, GitCompareArrows, Calculator, Users, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { PageIntro } from "@/components/PageIntro";
import { SiteFooter } from "@/components/SiteFooter";
import { tools } from "@/data/tools";
export const metadata: Metadata = { title: "도구 | JUHWAN" };
const icons = [Braces, GitCompareArrows, Calculator, Users];
export default function ToolsPage() {
  return <main className="portfolio"><SiteHeader active="Tools"/><PageIntro eyebrow="UTILITIES" title="도구" description="자주 쓰는 기능을 가볍게, 바로."/><section className="content-section"><div className="tool-grid">{tools.map((tool, index) => { const Icon = icons[index % icons.length]; return <a className="tool-card" href={tool.path} key={tool.id}><span className="tool-icon"><Icon size={26} strokeWidth={1.6}/></span><ArrowUpRight className="tool-arrow" size={20}/><div><h2>{tool.name}</h2><p>{tool.description}</p></div><small>{tool.coreAction}</small></a>; })}</div><p className="tools-note">입력한 내용은 브라우저에서만 처리됩니다.</p></section><SiteFooter/></main>;
}
