import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { journals } from "@/data/journals";

export function generateStaticParams() { return journals.map(({ id }) => ({ id })); }
export default async function JournalDetail({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const entry = journals.find((item) => item.id === id); if (!entry) notFound(); return <main><SiteHeader active="Journal" /><article className="detail prose-detail"><div className="detail-head"><p className="eyebrow">{entry.category} · {entry.date}</p><h1>{entry.title}</h1><p>{entry.summary}</p></div><div className="prose">{entry.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="tags">{entry.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><Link className="back-link" href="/journal">← 저널 목록</Link></article><SiteFooter /></main>; }
