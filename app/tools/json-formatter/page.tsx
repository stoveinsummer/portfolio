import type { Metadata } from "next";
import Link from "next/link";
import { JsonFormatter } from "@/components/JsonFormatter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = { title: "JSON 정렬기", description: "브라우저에서 안전하게 JSON을 검사하고 정렬하는 도구." };

export default function JsonFormatterPage() {
  return <main><SiteHeader active="Tools" /><div className="tool-detail-head"><p className="eyebrow">Tool 01 · Local only</p><h1>JSON<br /><i>formatter.</i></h1><p>JSON을 붙여넣어 문법을 확인하고, 읽기 좋은 형태로 정렬하거나 한 줄로 압축합니다.</p></div><div className="tool-detail-content"><JsonFormatter /><Link className="back-link" href="/tools">← 도구 목록</Link></div><SiteFooter /></main>;
}
