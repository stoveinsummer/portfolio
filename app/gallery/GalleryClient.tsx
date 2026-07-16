"use client";

import { useEffect, useMemo, useState } from "react";
import type { Photo } from "./photos";

const categories = ["All", "Street", "Landscape", "Travel", "Details"] as const;

export function GalleryClient({ photos }: { photos: Photo[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [active, setActive] = useState<number | null>(null);
  const visible = useMemo(() => category === "All" ? photos : photos.filter((photo) => photo.category === category), [category, photos]);

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

  return (
    <>
      <div className="gallery-filters" aria-label="사진 카테고리">
        {categories.map((item) => (
          <button key={item} className={category === item ? "active" : ""} onClick={() => { setCategory(item); setActive(null); }}>{item}</button>
        ))}
      </div>
      <div className="photo-grid">
        {visible.map((photo, index) => (
          <button className={`photo-card ${photo.orientation}`} key={`${photo.src}-${index}`} onClick={() => setActive(index)} aria-label={`${photo.alt} 크게 보기`}>
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <span><b>{photo.location}</b><em>{photo.category} · {photo.year}</em></span>
          </button>
        ))}
      </div>
      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="사진 크게 보기">
          <button className="lightbox-close" onClick={() => setActive(null)} aria-label="닫기">×</button>
          <button className="lightbox-nav prev" onClick={() => setActive((active - 1 + visible.length) % visible.length)} aria-label="이전 사진">←</button>
          <img src={visible[active].src} alt={visible[active].alt} />
          <div className="lightbox-caption"><span>{visible[active].location}</span><span>{visible[active].category} · {visible[active].year}</span></div>
          <button className="lightbox-nav next" onClick={() => setActive((active + 1) % visible.length)} aria-label="다음 사진">→</button>
        </div>
      )}
    </>
  );
}
