import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { photos } from "@/data/photos";
import { investments } from "@/data/investments";
import { journals } from "@/data/journals";
import { tools } from "@/data/tools";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const photoSrc = (filename: string) => `${basePath}/photos/web/${filename}`;

export default function Home() {
  const recentPhotos = photos.slice(0, 3);
  const availableTools = tools.filter((tool) => tool.status === "available");
  return <main>
    <SiteHeader active="Home" />
    <section className="hero" id="top">
      <div className="hero-kicker">A personal digital workshop · Seoul</div>
      <h1>I observe, decide,<span>and make things.</span></h1>
      <div className="hero-bottom"><p>사진, 투자 판단, 개발 메모와 직접 만든 작은 도구를 쌓아가는 개인 기록 공간입니다. 완성된 결과보다 계속 보고 생각하는 과정을 남깁니다.</p><Link className="circle-link" href="/photo" aria-label="최근 사진 보기">↓</Link></div>
    </section>
    <section className="home-section home-photos">
      <div className="section-head"><h2>Recent photos</h2><Link href="/photo">All photos ↗</Link></div>
      <div className="home-photo-grid">{recentPhotos.map((photo) => <Link href={`/photo/${photo.id}`} key={photo.id}><img src={photoSrc(photo.imageUrl.split("/").pop()!)} alt={photo.title} width={photo.orientation === "portrait" ? 1200 : 1600} height={photo.orientation === "portrait" ? 1600 : 1200} /><span>{photo.title}<em>{photo.takenAt}</em></span></Link>)}</div>
    </section>
    <section className="home-section record-preview">
      <div className="section-head"><h2>Current records</h2><span>Static files · Updated by hand</span></div>
      <div className="record-cards">
        <Link href={`/invest/${investments[0].id}`}><p className="eyebrow">Invest · {investments[0].date}</p><h3>{investments[0].title}</h3><p>{investments[0].review}</p><span>투자 기록 보기 ↗</span></Link>
        <Link href={`/journal/${journals[0].id}`}><p className="eyebrow">Journal · {journals[0].date}</p><h3>{journals[0].title}</h3><p>{journals[0].summary}</p><span>글 읽기 ↗</span></Link>
        <Link href="/tools"><p className="eyebrow">Tools · {availableTools.length} available</p><h3>필요한 것을 직접 만듭니다.</h3><p>반복해서 쓰는 작은 기능을 직접 설계하고 브라우저 안에서 동작하도록 만들었습니다.</p><span>도구 목록 보기 ↗</span></Link>
      </div>
    </section>
    <section className="about home-about"><p className="eyebrow">About this place</p><div><h2>보고, 생각하고,<br />기록합니다.</h2><div className="about-copy"><p>낮에는 제품과 시스템을 만드는 개발자입니다. 카메라로 일상의 빛과 구조를 관찰하고, 투자에서는 금액보다 판단 과정과 규칙을 기록합니다.</p><Link href="/about">이 공간에 대해 더 보기 ↗</Link></div></div></section>
    <SiteFooter />
  </main>;
}
