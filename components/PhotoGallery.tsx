"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PhotoItem } from "@/types/content";

const categories = ["전체", "거리", "자연", "건축", "디테일"] as const;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const srcFor = (photo: PhotoItem) => `${basePath}/photos/web/${photo.imageUrl.split("/").pop()}`;

export function PhotoGallery({ items }: { items: PhotoItem[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("전체");
  const [active, setActive] = useState<number | null>(null);
  const visible = useMemo(() => category === "전체" ? items : items.filter((item) => item.category === category), [category, items]);

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
    <div className="gallery-filters" aria-label="사진 카테고리">
      {categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => { setCategory(item); setActive(null); }}>{item}</button>)}
    </div>
    <div className="photo-grid">
      {visible.map((photo, index) => <article className={`photo-card ${photo.orientation}`} key={photo.id}>
        <button onClick={() => setActive(index)} aria-label={`${photo.title} 크게 보기`}><img src={srcFor(photo)} alt={photo.title} loading="lazy" /></button>
        <div className="photo-meta"><div><strong>{photo.title}</strong><span>{photo.location} · {photo.takenAt}</span></div><Link href={`/photo/${photo.id}`}>기록 보기 ↗</Link></div>
      </article>)}
    </div>
    {active !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="사진 크게 보기">
      <button className="lightbox-close" onClick={() => setActive(null)} aria-label="닫기">×</button>
      <button className="lightbox-nav prev" onClick={() => setActive((active - 1 + visible.length) % visible.length)} aria-label="이전 사진">←</button>
      <img src={srcFor(visible[active])} alt={visible[active].title} />
      <div className="lightbox-caption"><span>{visible[active].title}</span><span>{visible[active].category} · {visible[active].takenAt}</span></div>
      <button className="lightbox-nav next" onClick={() => setActive((active + 1) % visible.length)} aria-label="다음 사진">→</button>
    </div>}
  </>;
}
