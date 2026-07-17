import Link from "next/link";

const navigation = [
  ["Home", "/"], ["Photo", "/photo"], ["Invest", "/invest"],
  ["Journal", "/journal"], ["Tools", "/tools"], ["About", "/about"],
] as const;

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="홈으로 이동">JUHWAN<span className="wordmark-dot">.</span></Link>
      <nav aria-label="주요 메뉴">
        {navigation.map(([label, href]) => <Link className={active === label ? "nav-active" : ""} aria-current={active === label ? "page" : undefined} href={href} key={label}>{label}</Link>)}
      </nav>
    </header>
  );
}
