export interface PhotoItem {
  id: string;
  title: string;
  imageUrl: string;
  takenAt: string;
  location: string;
  description: string;
  category: "거리" | "자연" | "건축" | "디테일";
  project: string;
  theme: "도시의 시간" | "하늘 관찰" | "계절의 기록" | "선과 구조";
  color: "따뜻한 색" | "푸른색" | "초록색" | "노란색" | "보라색" | "무채색" | "다채로운 색";
  tags: string[];
  orientation: "landscape" | "portrait";
}

export interface PortfolioItem {
  symbol: string;
  name: string;
  weight: number;
  returnRate: number | null;
  category: string;
}

export interface InvestmentRecord {
  id: string;
  date: string;
  title: string;
  growthIndex: number;
  portfolio: PortfolioItem[];
  decisions: string[];
  review: string;
  marketNews?: {
    korea: string;
    us: string;
  };
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string[];
  category: string;
  tags: string[];
}

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  path: string;
  status: "available" | "planned";
}
