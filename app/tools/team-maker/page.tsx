import type { Metadata } from "next";
import Link from "next/link";
import { TeamMaker } from "@/components/TeamMaker";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ToolContext } from "@/components/ToolContext";
import { tools } from "@/data/tools";

export const metadata: Metadata = { title: "랜덤 팀 편성기", description: "이름을 입력해 팀 개수나 팀당 인원에 맞춰 무작위로 편성하는 도구." };
export default function TeamMakerPage() { const tool = tools.find((item) => item.id === "team-maker")!; return <main><SiteHeader active="Tools" /><div className="tool-detail-head"><p className="eyebrow">Tool 04 · Fair random teams</p><h1>Team<br /><i>maker.</i></h1><p>참여자 이름을 입력하고 원하는 기준을 선택해 인원 차이 없이 무작위로 팀을 나눕니다.</p></div><div className="tool-detail-content"><ToolContext tool={tool} /><TeamMaker /><Link className="back-link" href="/tools">← 도구 목록</Link></div><SiteFooter /></main>; }
