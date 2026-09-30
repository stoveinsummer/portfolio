"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Maximize2, Search } from "lucide-react";
import type { PhotoItem } from "@/types/content";

const themes = ["전체", "도시의 시간", "하늘 관찰", "계절의 기록", "선과 구조"] as const;
const colors = ["전체", "따뜻한 색", "푸른색", "초록색", "노란색", "보라색", "무채색", "다채로운 색"] as const;
const srcFor = (photo: PhotoItem) => photo.imageUrl;

export function PhotoGallery({ items }: { items: PhotoItem[] }) {
  const [theme, setTheme] = useState<(typeof themes)[number]>("전체");
  const [color, setColor] = useState<(typeof colors)[number]>("전체");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const visible = useMemo(() => items.filter((item) => (theme === "전체" || item.theme === theme) && (color === "전체" || item.color === color) && [item.title,item.location,...item.tags].join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [color, items, theme, query]);

  const closeLightbox = useCallback(() => {
    setActive(null);
    window.setTimeout(() => lastTriggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const buttons = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
        const first = buttons[0], last = buttons.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") setActive((active + 1) % visible.length);
      if (event.key === "ArrowLeft") setActive((active - 1 + visible.length) % visible.length);
    };
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [active, closeLightbox, visible.length]);

  return <>
    <div className="gallery-filters" aria-label="사진 분류 필터">
      <div className="gallery-toolbar"><label className="gallery-search"><Search size={18}/><input aria-label="사진 검색" placeholder="제목, 장소, 태그 검색" value={query} onChange={e=>{setQuery(e.target.value);setActive(null);}}/></label><span className="filter-count" role="status">{visible.length}장의 사진</span></div>
      <div className="filter-row"><strong>주제</strong>{themes.map((item) => <button key={item} aria-pressed={theme === item} className={theme === item ? "active" : ""} onClick={() => { setTheme(item); setActive(null); }}>{item}</button>)}</div>
      <div className="filter-row"><strong>컬러</strong>{colors.map((item) => <button key={item} aria-pressed={color === item} className={color === item ? "active" : ""} onClick={() => { setColor(item); setActive(null); }}>{item}</button>)}</div>

    </div>
    <div className="photo-grid">
      {visible.map((photo, index) => <article className={`photo-card ${photo.orientation}`} key={photo.id}>
        <div className="photo-pin">
          <button className="photo-preview" onClick={(event) => { lastTriggerRef.current = event.currentTarget; setActive(index); }} aria-label={`${photo.title} 크게 보기`}><img src={srcFor(photo)} alt={photo.title} loading={index < 4 ? "eager" : "lazy"} width={photo.width} height={photo.height}/><span className="photo-expand" aria-hidden="true"><Maximize2 size={18}/></span></button>
          <a className="photo-record" href={`/photo/${photo.id}`} aria-label={`${photo.title} 기록 보기`}>기록 보기<ArrowUpRight size={16}/></a>
        </div>
        <div className="photo-meta"><a href={`/photo/${photo.id}`}><strong>{photo.title}</strong></a>{photo.location && <span>{photo.location}</span>}</div>
      </article>)}
    </div>
      {visible.length === 0 && <div className="gallery-empty"><p>조건에 맞는 사진이 없습니다.</p><button onClick={()=>{setQuery("");setTheme("전체");setColor("전체");}}>필터 초기화</button></div>}
    {active !== null && <div ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label="사진 크게 보기" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLightbox(); }}>
      <button ref={closeButtonRef} className="lightbox-close" onClick={closeLightbox} aria-label="닫기">×</button>
      <button className="lightbox-nav prev" onClick={() => setActive((active - 1 + visible.length) % visible.length)} aria-label="이전 사진">←</button>
      <img src={srcFor(visible[active])} alt={visible[active].title} width={visible[active].width} height={visible[active].height} />
      <div className="lightbox-caption"><span>{active + 1} / {visible.length} · {visible[active].title}</span><span>{visible[active].theme} · {visible[active].color} · ← → 이동 · ESC 닫기</span></div>
      <button className="lightbox-nav next" onClick={() => setActive((active + 1) % visible.length)} aria-label="다음 사진">→</button>
    </div>}
  </>;
}
