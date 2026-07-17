import type { InvestmentRecord } from "@/types/content";
import { prepareInvestments } from "@/data/archive";

export const investments: InvestmentRecord[] = prepareInvestments([
  {
    id: "2026-07",
    date: "2026-07",
    growthIndex: 102.8,
    title: "비중을 지키는 달",
    portfolio: [
      { symbol: "QQQI", name: "나스닥 인컴", weight: 45, returnRate: 8.2, category: "인컴" },
      { symbol: "QLD", name: "나스닥 2배", weight: 30, returnRate: 24.1, category: "성장" },
      { symbol: "CASH", name: "현금", weight: 15, returnRate: null, category: "현금" },
      { symbol: "OTHER", name: "기타", weight: 10, returnRate: null, category: "기타" },
    ],
    decisions: ["QLD 비중은 추가로 높이지 않음", "현금흐름 확보를 위해 QQQI 적립 유지", "시장 급등 시 신규 매수 속도 조절"],
    review: "수익률보다 계획한 비중을 지켰는지가 중요했다.",
  },
  {
    id: "2026-06",
    date: "2026-06",
    growthIndex: 100,
    title: "속도보다 규칙",
    portfolio: [
      { symbol: "QQQI", name: "나스닥 인컴", weight: 42, returnRate: 6.4, category: "인컴" },
      { symbol: "QLD", name: "나스닥 2배", weight: 28, returnRate: 18.6, category: "성장" },
      { symbol: "CASH", name: "현금", weight: 20, returnRate: null, category: "현금" },
      { symbol: "OTHER", name: "기타", weight: 10, returnRate: null, category: "기타" },
    ],
    decisions: ["정해둔 날짜 외 충동 매수하지 않음", "현금 비중을 급하게 낮추지 않음"],
    review: "상승장에서 조급해지지 않는 연습이 필요했다.",
  },
]);
