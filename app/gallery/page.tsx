import type { Metadata } from "next";
import { GalleryClient } from "./GalleryClient";
import { photos } from "./photos";

export const metadata: Metadata = { title: "Gallery", description: "거리, 풍경, 여행 그리고 작은 디테일을 기록한 사진 아카이브." };

export default function GalleryPage() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="../">YOUR NAME<span className="wordmark-dot">.</span></a>
        <nav aria-label="주요 메뉴">
          <a href="../">Home</a><a className="nav-active" href="./">Gallery</a><a href="../#work">Projects</a><a href="../#notes">Notes</a><a href="../#about">About</a>
        </nav>
      </header>
      <section className="gallery-intro">
        <p className="eyebrow">Photography archive · 2023—2026</p>
        <h1>Things I<br /><i>noticed.</i></h1>
        <p>걷다가 잠깐 멈추게 만든 빛, 표정, 거리와 풍경. 장소보다 그때의 감각을 기억하기 위해 찍습니다.</p>
      </section>
      <GalleryClient photos={photos} />
      <footer><span>© 2026 YOUR NAME</span><span>Shot with curiosity</span><a href="../">Home ↑</a></footer>
    </main>
  );
}
