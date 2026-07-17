import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageIntro } from "@/components/PageIntro";
import { PhotoGallery } from "@/components/PhotoGallery";
import { photos } from "@/data/photos";

export const metadata: Metadata = { title: "Photo", description: "주환이 직접 촬영한 사진과 촬영 기록.", alternates: { canonical: "https://stoveinsummer.github.io/portfolio/photo/" } };
export default function PhotoPage() { const years = photos.map((photo) => photo.takenAt.slice(0, 4)); const period = years.length ? `${years.at(-1)}—${years[0]}` : "Archive"; return <main><SiteHeader active="Photo" /><PageIntro eyebrow={`Photography archive · ${period}`} title="Things I noticed." description="걷다가 문득 멈추게 만든 빛, 구조와 계절. 장소보다 그때의 감각을 기억하기 위해 찍습니다." /><PhotoGallery items={photos} /><SiteFooter /></main>; }
