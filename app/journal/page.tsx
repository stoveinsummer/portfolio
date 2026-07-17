import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageIntro } from "@/components/PageIntro";
import { journals } from "@/data/journals";

export const metadata: Metadata = { title: "Journal", description: "생각과 개발 메모, 프로젝트 회고.", alternates: { canonical: "https://stoveinsummer.github.io/portfolio/journal/" } };
export default function JournalPage() { return <main><SiteHeader active="Journal" /><PageIntro eyebrow="Notes, learning, retrospectives" title="Journal." description="사진과 투자에 속하지 않는 생각, 개발 메모와 배운 것을 정리합니다." /><section className="content-section"><div className="journal-list">{journals.map((entry) => <Link href={`/journal/${entry.id}`} key={entry.id}><div><time>{entry.date}</time><span>{entry.category}</span></div><h2>{entry.title}</h2><p>{entry.summary}</p><em>{entry.tags.join(" · ")} ↗</em></Link>)}</div></section><SiteFooter /></main>; }
