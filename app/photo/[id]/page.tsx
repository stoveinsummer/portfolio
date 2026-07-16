import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { photos } from "@/data/photos";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export function generateStaticParams() { return photos.map(({ id }) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const photo = photos.find((item) => item.id === id); return { title: photo?.title ?? "Photo" }; }
export default async function PhotoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const photo = photos.find((item) => item.id === id); if (!photo) notFound();
  const src = `${basePath}/photos/web/${photo.imageUrl.split("/").pop()}`;
  return <main><SiteHeader active="Photo" /><article className="detail photo-detail"><div className="detail-head"><p className="eyebrow">{photo.category} · {photo.takenAt}</p><h1>{photo.title}</h1><p>{photo.description}</p></div><img src={src} alt={photo.title} /><dl><div><dt>Location</dt><dd>{photo.location}</dd></div><div><dt>Date</dt><dd>{photo.takenAt}</dd></div><div><dt>Tags</dt><dd>{photo.tags.join(" · ")}</dd></div></dl><Link className="back-link" href="/photo">← 사진 목록</Link></article><SiteFooter /></main>;
}
