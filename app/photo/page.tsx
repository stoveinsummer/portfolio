import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageIntro } from "@/components/PageIntro";
import { PhotoGallery } from "@/components/PhotoGallery";
import { photos } from "@/data/photos";

export const metadata: Metadata = { title: "Photo", description: "주환이 직접 촬영한 사진과 촬영 기록." };
export default function PhotoPage() { return <main><SiteHeader active="Photo" /><PageIntro eyebrow="Photography archive · 2025—2026" title="Things I noticed." description="걷다가 잠깐 멈추게 만든 빛, 구조와 계절. 장소보다 그때의 감각을 기억하기 위해 찍습니다." /><PhotoGallery items={photos} /><SiteFooter /></main>; }
