import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageIntro } from "@/components/PageIntro";
import { tools } from "@/data/tools";

export const metadata: Metadata = { title: "Tools", description: "직접 만들어 추가할 개인용 웹 도구 목록." };
export default function ToolsPage() { return <main><SiteHeader active="Tools" /><PageIntro eyebrow="Small utilities · Built when needed" title="Tools." description="반복해서 쓰는 작은 기능을 직접 만들어 하나씩 추가할 공간입니다." /><section className="content-section"><div className="tool-grid">{tools.map((tool, index) => <article key={tool.id}><span>{String(index + 1).padStart(2, "0")}</span><div><p className="eyebrow">{tool.status === "available" ? "Available" : "Planned"}</p><h2>{tool.name}</h2><p>{tool.description}</p></div><em>{tool.status === "available" ? "Open ↗" : "준비 중"}</em></article>)}</div><div className="notice tools-note">도구는 브라우저 안에서만 동작하며, 입력한 내용은 서버로 전송하거나 저장하지 않는 방향으로 만듭니다.</div></section><SiteFooter /></main>; }
