import type { MetadataRoute } from "next";
import { investments } from "@/data/investments";
import { journals } from "@/data/journals";
import { photos } from "@/data/photos";
import { tools } from "@/data/tools";

const origin = "https://stoveinsummer.github.io/portfolio";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/photo", "/invest", "/journal", "/tools", "/about"];
  return [
    ...staticPaths.map((path) => ({ url: `${origin}${path}/`, changeFrequency: "monthly" as const })),
    ...photos.map((item) => ({ url: `${origin}/photo/${item.id}/`, lastModified: item.takenAt, changeFrequency: "yearly" as const })),
    ...investments.map((item) => ({ url: `${origin}/invest/${item.id}/`, lastModified: `${item.date}-25`, changeFrequency: "yearly" as const })),
    ...journals.map((item) => ({ url: `${origin}/journal/${item.id}/`, lastModified: item.date, changeFrequency: "yearly" as const })),
    ...tools.filter((item) => item.status === "available").map((item) => ({ url: `${origin}${item.path}/`, changeFrequency: "monthly" as const })),
  ];
}
