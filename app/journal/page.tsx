export const dynamic="force-dynamic";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageIntro } from "@/components/PageIntro";
import { listContent } from "@/lib/content-store";
import {ContentActions} from "@/components/ContentActions";

export const metadata: Metadata = { title: "Journal", description: "생각과 개발 메모, 프로젝트 회고." };
export default async function JournalPage() { const journals=await listContent("journal"); return <main className="portfolio"><SiteHeader active="Journal" /><ContentActions kind="journal"/><PageIntro eyebrow="JOURNAL" title="저널" description="만들고, 배우고, 다시 생각한 것들." /><section className="content-section"><div className="journal-list">{journals.map((entry) => <a href={`/journal/${entry.id}`} key={entry.id}><div><time>{entry.date}</time><span>{entry.category}</span></div><h2>{entry.title}</h2><p>{entry.summary}</p><em>{entry.tags.join(" · ")} ↗</em></a>)}</div></section><SiteFooter /></main>; }
