import type { Metadata } from "next";
import Link from "next/link";
import { CodeDiff } from "@/components/CodeDiff";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = { title: "코드 비교기", description: "두 코드의 줄 단위 차이를 브라우저에서 나란히 비교하는 도구." };

export default function CodeDiffPage() {
  return <main><SiteHeader active="Tools" /><div className="tool-detail-head"><p className="eyebrow">Tool 02 · Side by side</p><h1>Code<br /><i>difference.</i></h1><p>원본과 변경 코드를 나란히 붙여넣어 추가·삭제·변경된 줄을 빠르게 확인합니다.</p></div><div className="tool-detail-content"><CodeDiff /><Link className="back-link" href="/tools">← 도구 목록</Link></div><SiteFooter /></main>;
}
