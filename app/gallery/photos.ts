export type Photo = {
  src: string;
  alt: string;
  category: "Street" | "Landscape" | "Travel" | "Details";
  location: string;
  year: string;
  orientation: "landscape" | "portrait";
};

// 실제 사진을 public/photos/<category>/ 폴더에 넣고 src를 교체하세요.
export const photos: Photo[] = [
  { src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1800&q=88", alt: "도시의 건물과 거리", category: "Street", location: "Seoul", year: "2026", orientation: "portrait" },
  { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=88", alt: "안개 낀 산", category: "Landscape", location: "Gangwon", year: "2025", orientation: "landscape" },
  { src: "https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=1800&q=88", alt: "빛이 비치는 골목", category: "Travel", location: "Kyoto", year: "2025", orientation: "portrait" },
  { src: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=1800&q=88", alt: "도시 건축의 선", category: "Details", location: "Tokyo", year: "2024", orientation: "landscape" },
  { src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1800&q=88", alt: "해 질 무렵의 도시", category: "Street", location: "Seoul", year: "2025", orientation: "landscape" },
  { src: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1800&q=88", alt: "눈 덮인 산의 능선", category: "Landscape", location: "Hokkaido", year: "2024", orientation: "portrait" },
  { src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=88", alt: "전통 건물과 거리", category: "Travel", location: "Kyoto", year: "2024", orientation: "landscape" },
  { src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1800&q=88", alt: "건물의 반복되는 창", category: "Details", location: "Berlin", year: "2023", orientation: "portrait" },
];
