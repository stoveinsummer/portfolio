import type { PhotoItem } from "@/types/content";
import { preparePhotos } from "@/data/archive";

const rawPhotos: Omit<PhotoItem, "project" | "theme" | "color">[] = [
  { id: "seoul-sunset-traffic", title: "퇴근길의 노을", imageUrl: "../photos/web/seoul-sunset-traffic.webp", takenAt: "2025-03-28", location: "Seoul", description: "도시의 불빛이 켜지기 시작한 순간, 차선 끝에 남은 주황빛을 기록했다.", category: "거리", tags: ["노을", "도시", "퇴근길"], orientation: "portrait" },
  { id: "moon-over-power-lines", title: "전선 사이의 달", imageUrl: "../photos/web/moon-over-power-lines.webp", takenAt: "2025-05-07", location: "Seoul", description: "복잡하게 겹친 전선과 작게 떠 있는 달의 대비.", category: "디테일", tags: ["달", "전선", "푸른시간"], orientation: "portrait" },
  { id: "summer-clouds-and-wires", title: "여름 구름", imageUrl: "../photos/web/summer-clouds-and-wires.webp", takenAt: "2025-07-27", location: "Seoul", description: "전선이 프레임을 가르는 한낮의 큰 구름.", category: "자연", tags: ["구름", "여름", "하늘"], orientation: "portrait" },
  { id: "sun-rays-after-storm", title: "비구름 뒤의 빛", imageUrl: "../photos/web/sun-rays-after-storm.webp", takenAt: "2025-08-25", location: "Seoul", description: "짙은 비구름 사이로 잠깐 열린 빛의 통로.", category: "자연", tags: ["빛", "구름", "도시"], orientation: "landscape" },
  { id: "autumn-ginkgo-canopy", title: "은행나무 사이의 하늘", imageUrl: "../photos/web/autumn-ginkgo-canopy.webp", takenAt: "2025-11-09", location: "Seoul", description: "노란 잎이 둘러싼 가을 하늘의 빈 공간.", category: "자연", tags: ["은행나무", "가을", "하늘"], orientation: "portrait" },
  { id: "snow-covered-trees-at-night", title: "눈 내린 밤", imageUrl: "../photos/web/snow-covered-trees-at-night.webp", takenAt: "2026-01-23", location: "Seoul", description: "가로등에 드러난 눈 덮인 가지와 조용한 밤.", category: "자연", tags: ["눈", "겨울", "야경"], orientation: "landscape" },
  { id: "seoul-evening-traffic", title: "보랏빛 교차로", imageUrl: "../photos/web/seoul-evening-traffic.webp", takenAt: "2025-09-12", location: "Seoul", description: "해가 진 뒤 건물과 차량 사이에 남은 보랏빛.", category: "거리", tags: ["교차로", "야경", "도시"], orientation: "portrait" },
  { id: "red-brick-and-reflection", title: "붉은 벽과 수면", imageUrl: "../photos/web/red-brick-and-reflection.webp", takenAt: "2025-09-20", location: "Seoul", description: "오래된 벽돌의 질감과 얕은 물 위의 반영.", category: "건축", tags: ["벽돌", "반영", "건축"], orientation: "portrait" },
  { id: "colorful-glass-dome", title: "색유리 돔", imageUrl: "../photos/web/colorful-glass-dome.webp", takenAt: "2025-09-21", location: "Seoul", description: "구름의 움직임과 투명한 색판이 겹친 구조물.", category: "건축", tags: ["색", "구조", "하늘"], orientation: "landscape" },
  { id: "silver-grass-under-sky", title: "억새와 넓은 하늘", imageUrl: "../photos/web/silver-grass-under-sky.webp", takenAt: "2025-10-05", location: "Seoul", description: "가을빛 풀 위로 크게 열린 연한 하늘.", category: "자연", tags: ["억새", "가을", "풍경"], orientation: "portrait" },
  { id: "traditional-eaves-monochrome", title: "처마의 대칭 — 흑백", imageUrl: "../photos/web/traditional-eaves-monochrome.webp", takenAt: "2025-10-18", location: "Seoul", description: "단청의 색을 덜어내고 구조와 반복에 집중했다.", category: "디테일", tags: ["처마", "대칭", "흑백"], orientation: "portrait" },
  { id: "traditional-eaves-color", title: "처마의 대칭 — 컬러", imageUrl: "../photos/web/traditional-eaves-color.webp", takenAt: "2025-10-18", location: "Seoul", description: "초록 단청과 목재의 선이 중앙에서 만나는 장면.", category: "건축", tags: ["단청", "대칭", "전통건축"], orientation: "portrait" },
];

const projects: Record<string, string> = {
  "seoul-sunset-traffic": "City after work",
  "seoul-evening-traffic": "City after work",
  "moon-over-power-lines": "Looking up",
  "summer-clouds-and-wires": "Looking up",
  "sun-rays-after-storm": "Looking up",
  "autumn-ginkgo-canopy": "Seasons in Seoul",
  "snow-covered-trees-at-night": "Seasons in Seoul",
  "silver-grass-under-sky": "Seasons in Seoul",
  "red-brick-and-reflection": "Lines and surfaces",
  "colorful-glass-dome": "Lines and surfaces",
  "traditional-eaves-monochrome": "Lines and surfaces",
  "traditional-eaves-color": "Lines and surfaces",
};

const themes: Record<string, PhotoItem["theme"]> = {
  "seoul-sunset-traffic": "도시의 시간", "seoul-evening-traffic": "도시의 시간",
  "moon-over-power-lines": "하늘 관찰", "summer-clouds-and-wires": "하늘 관찰", "sun-rays-after-storm": "하늘 관찰",
  "autumn-ginkgo-canopy": "계절의 기록", "snow-covered-trees-at-night": "계절의 기록", "silver-grass-under-sky": "계절의 기록",
  "red-brick-and-reflection": "선과 구조", "colorful-glass-dome": "선과 구조", "traditional-eaves-monochrome": "선과 구조", "traditional-eaves-color": "선과 구조",
};

const colors: Record<string, PhotoItem["color"]> = {
  "seoul-sunset-traffic": "따뜻한 색", "moon-over-power-lines": "푸른색", "summer-clouds-and-wires": "푸른색",
  "sun-rays-after-storm": "푸른색", "autumn-ginkgo-canopy": "노란색", "snow-covered-trees-at-night": "무채색",
  "seoul-evening-traffic": "보라색", "red-brick-and-reflection": "따뜻한 색", "colorful-glass-dome": "다채로운 색",
  "silver-grass-under-sky": "초록색", "traditional-eaves-monochrome": "무채색", "traditional-eaves-color": "초록색",
};

export const photos: PhotoItem[] = preparePhotos(rawPhotos.map((photo) => ({ ...photo, project: projects[photo.id], theme: themes[photo.id], color: colors[photo.id] })));
