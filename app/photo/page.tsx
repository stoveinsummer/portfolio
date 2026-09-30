export const dynamic="force-dynamic";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageIntro } from "@/components/PageIntro";
import { PhotoGallery } from "@/components/PhotoGallery";
import { listContent } from "@/lib/content-store";
import {ContentActions} from "@/components/ContentActions";

export const metadata: Metadata = { title: "Photo", description: "주환이 직접 촬영한 사진과 촬영 기록." };
export default async function PhotoPage() { const photos=await listContent("photo"); const years = photos.map((photo) => photo.takenAt.slice(0, 4)); const period = years.length ? `${years.at(-1)}—${years[0]}` : "Archive"; return <main className="portfolio photo-workspace"><SiteHeader active="Photo" /><ContentActions kind="photo"/><PageIntro eyebrow={`PHOTOGRAPHY / ${period}`} title="사진" description={`${photos.length}장의 장면, 각자의 기록.`} /><PhotoGallery items={photos} /><SiteFooter /></main>; }
