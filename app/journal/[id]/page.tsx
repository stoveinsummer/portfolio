import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArchiveNavigation } from "@/components/ArchiveNavigation";
import { journals } from "@/data/journals";
import { tools } from "@/data/tools";

export function generateStaticParams() { return journals.map(({ id }) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const entry = journals.find((item) => item.id === id); return { title: entry?.title ?? "Journal", description: entry?.summary, alternates: { canonical: `https://stoveinsummer.github.io/portfolio/journal/${id}/` } }; }

export default async function JournalDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = journals.findIndex((item) => item.id === id);
  const entry = journals[index];
  if (!entry) notFound();
  const newer = journals[index - 1];
  const older = journals[index + 1];
  const relatedTools = tools.filter((tool) => entry.relatedTools?.includes(tool.id));

  return <main><SiteHeader active="Journal" /><article className="detail prose-detail">
    <div className="detail-head"><p className="eyebrow">{entry.category} · {entry.date}</p><h1>{entry.title}</h1><p>{entry.summary}</p></div>
    <div className="prose">{entry.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    <div className="tags">{entry.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
    {relatedTools.length > 0 && <section className="related-tools"><p className="eyebrow">Related work</p><h2>글에서 만든 도구</h2><div>{relatedTools.map((tool) => <Link href={tool.path} key={tool.id}><strong>{tool.name}</strong><span>{tool.coreAction} ↗</span></Link>)}</div></section>}
    <ArchiveNavigation previous={older ? { href: `/journal/${older.id}`, label: older.title } : null} next={newer ? { href: `/journal/${newer.id}`, label: newer.title } : null} backHref="/journal" backLabel="저널 목록" />
  </article><SiteFooter /></main>;
}
