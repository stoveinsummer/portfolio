export const dynamic="force-dynamic";
import { Comments } from "@/components/Comments";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArchiveNavigation } from "@/components/ArchiveNavigation";
import { listContent } from "@/lib/content-store";
import {ContentActions} from "@/components/ContentActions";
import { tools } from "@/data/tools";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const journals=await listContent("journal"); const entry = journals.find((item) => item.id === id); return { title: entry?.title ?? "Journal", description: entry?.summary }; }

export default async function JournalDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const journals=await listContent("journal");
  const index = journals.findIndex((item) => item.id === id);
  const entry = journals[index];
  if (!entry) notFound();
  const newer = journals[index - 1];
  const older = journals[index + 1];
  const relatedTools = tools.filter((tool) => entry.relatedTools?.includes(tool.id));

  return <main className="portfolio"><SiteHeader active="Journal" /><ContentActions kind="journal" id={id}/><article className="detail prose-detail">
    <div className="detail-head"><p className="eyebrow">{entry.category} · {entry.date}</p><h1>{entry.title}</h1><p>{entry.summary}</p></div>
    <div className="prose">{entry.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    <div className="tags">{entry.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
    {relatedTools.length > 0 && <section className="related-tools"><p className="eyebrow">Related work</p><h2>글에서 만든 도구</h2><div>{relatedTools.map((tool) => <a href={tool.path} key={tool.id}><strong>{tool.name}</strong><span>{tool.coreAction} ↗</span></a>)}</div></section>}
    <ArchiveNavigation previous={older ? { href: `/journal/${older.id}`, label: older.title } : null} next={newer ? { href: `/journal/${newer.id}`, label: newer.title } : null} backHref="/journal" backLabel="저널 목록" />
  </article><Comments postKey={`journal:${id}`}/><SiteFooter /></main>;
}
