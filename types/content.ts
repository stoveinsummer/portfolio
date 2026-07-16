export interface PhotoItem {
  id: string;
  title: string;
  imageUrl: string;
  takenAt: string;
  location: string;
  description: string;
  category: "거리" | "자연" | "건축" | "디테일";
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
  portfolio: PortfolioItem[];
  decisions: string[];
  review: string;
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
