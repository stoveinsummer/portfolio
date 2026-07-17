import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArchiveNavigation } from "@/components/ArchiveNavigation";
import { photos } from "@/data/photos";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export function generateStaticParams() { return photos.map(({ id }) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const photo = photos.find((item) => item.id === id); const filename = photo?.imageUrl.split("/").pop(); return { title: photo?.title ?? "Photo", description: photo?.description, alternates: { canonical: `https://stoveinsummer.github.io/portfolio/photo/${id}/` }, openGraph: filename ? { images: [`/portfolio/photos/web/${filename}`] } : undefined }; }

export default async function PhotoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = photos.findIndex((item) => item.id === id);
  const photo = photos[index];
  if (!photo) notFound();
  const newer = photos[index - 1];
  const older = photos[index + 1];
  const src = `${basePath}/photos/web/${photo.imageUrl.split("/").pop()}`;

  return <main><SiteHeader active="Photo" /><article className="detail photo-detail">
    <div className="detail-head"><p className="eyebrow">{photo.category} · {photo.takenAt}</p><h1>{photo.title}</h1><p>{photo.description}</p></div>
    <img src={src} alt={photo.title} width={photo.orientation === "portrait" ? 1200 : 1600} height={photo.orientation === "portrait" ? 1600 : 1200} />
    <dl><div><dt>Location</dt><dd>{photo.location}</dd></div><div><dt>Date</dt><dd>{photo.takenAt}</dd></div><div><dt>Theme</dt><dd>{photo.theme}</dd></div><div><dt>Color</dt><dd>{photo.color}</dd></div><div><dt>Project</dt><dd>{photo.project}</dd></div><div><dt>Tags</dt><dd>{photo.tags.join(" · ")}</dd></div></dl>
    <ArchiveNavigation previous={older ? { href: `/photo/${older.id}`, label: older.title } : null} next={newer ? { href: `/photo/${newer.id}`, label: newer.title } : null} backHref="/photo" backLabel="사진 목록" />
  </article><SiteFooter /></main>;
}
