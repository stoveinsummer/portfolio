"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PhotoItem } from "@/types/content";

const themes = ["전체", "도시의 시간", "하늘 관찰", "계절의 기록", "선과 구조"] as const;
const colors = ["전체", "따뜻한 색", "푸른색", "초록색", "노란색", "보라색", "무채색", "다채로운 색"] as const;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const srcFor = (photo: PhotoItem) => `${basePath}/photos/web/${photo.imageUrl.split("/").pop()}`;

export function PhotoGallery({ items }: { items: PhotoItem[] }) {
  const [theme, setTheme] = useState<(typeof themes)[number]>("전체");
  const [color, setColor] = useState<(typeof colors)[number]>("전체");
  const [active, setActive] = useState<number | null>(null);
  const visible = useMemo(() => items.filter((item) => (theme === "전체" || item.theme === theme) && (color === "전체" || item.color === color)), [color, items, theme]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((active + 1) % visible.length);
      if (event.key === "ArrowLeft") setActive((active - 1 + visible.length) % visible.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [active, visible.length]);

  return <>
    <div className="gallery-filters" aria-label="사진 분류 필터">
      <div className="filter-row"><strong>주제</strong>{themes.map((item) => <button key={item} aria-pressed={theme === item} className={theme === item ? "active" : ""} onClick={() => { setTheme(item); setActive(null); }}>{item}</button>)}</div>
      <div className="filter-row"><strong>컬러</strong>{colors.map((item) => <button key={item} aria-pressed={color === item} className={color === item ? "active" : ""} onClick={() => { setColor(item); setActive(null); }}>{item}</button>)}</div>
      <span className="filter-count">{visible.length} photos</span>
    </div>
    <div className="photo-grid">
      {visible.map((photo, index) => <article className={`photo-card ${photo.orientation}`} key={photo.id}>
        <button onClick={() => setActive(index)} aria-label={`${photo.title} 크게 보기`}><img src={srcFor(photo)} alt={photo.title} loading="lazy" /></button>
        <div className="photo-meta"><div><strong>{photo.title}</strong><span>{photo.theme} · {photo.color}</span><span>{photo.location} · {photo.takenAt}</span></div><Link href={`/photo/${photo.id}`}>기록 보기 ↗</Link></div>
      </article>)}
    </div>
    {active !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="사진 크게 보기">
      <button className="lightbox-close" onClick={() => setActive(null)} aria-label="닫기">×</button>
      <button className="lightbox-nav prev" onClick={() => setActive((active - 1 + visible.length) % visible.length)} aria-label="이전 사진">←</button>
      <img src={srcFor(visible[active])} alt={visible[active].title} />
      <div className="lightbox-caption"><span>{active + 1} / {visible.length} · {visible[active].title}</span><span>{visible[active].theme} · {visible[active].color} · ← → 이동 · ESC 닫기</span></div>
      <button className="lightbox-nav next" onClick={() => setActive((active + 1) % visible.length)} aria-label="다음 사진">→</button>
    </div>}
  </>;
}
