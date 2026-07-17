import Link from "next/link";

type ArchiveLink = { href: string; label: string } | null;

export function ArchiveNavigation({ previous, next, backHref, backLabel }: { previous: ArchiveLink; next: ArchiveLink; backHref: string; backLabel: string }) {
  return <nav className="archive-navigation" aria-label="기록 사이 이동">
    <div>{previous ? <Link href={previous.href}><span>이전 기록</span><strong>← {previous.label}</strong></Link> : <span className="archive-navigation-empty">첫 기록입니다</span>}</div>
    <Link className="archive-navigation-back" href={backHref}>{backLabel}</Link>
    <div>{next ? <Link href={next.href}><span>다음 기록</span><strong>{next.label} →</strong></Link> : <span className="archive-navigation-empty">마지막 기록입니다</span>}</div>
  </nav>;
}
