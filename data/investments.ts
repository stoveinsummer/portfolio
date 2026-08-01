import type { InvestmentRecord } from "@/types/content";
import { prepareInvestments } from "@/data/archive";

export const investments: InvestmentRecord[] = prepareInvestments([
  {
    id: "2026-08-01",
    date: "2026-08-01",
    growthIndex: 105.3,
    title: "두 종목의 역할을 선명하게",
    portfolio: [
      { symbol: "QQQI", name: "나스닥 인컴", quantity: "137.022816주", weight: 76.6, returnRate: 2.8, category: "인컴" },
      { symbol: "QLD", name: "나스닥 2배", quantity: "26.471057주", weight: 23.4, returnRate: 14.5, category: "성장" },
    ],
    decisions: ["QLD 5달러 자동매수 유지", "QQQI 5달러 자동매수 유지", "시장과 환율 변동에도 정해둔 적립 규칙을 이어가기"],
    review: "지난 7월 미국 나스닥과 원·달러 환율이 모두 내려 심리적으로 조금 위축됐지만, QLD와 QQQI의 5달러 자동매수는 계속 유지한다.",
    marketNews: {
      korea: "7월 원·달러 환율 하락이 해외자산의 원화 환산 흐름에 부담으로 작용했다.",
      us: "7월 나스닥 하락으로 성장주 투자 심리가 위축됐다.",
    },
  },
  {
    id: "2026-07",
    date: "2026-07",
    growthIndex: 102.8,
    title: "비중은 지키는 중",
    portfolio: [
      { symbol: "QQQI", name: "나스닥 인컴", quantity: "137.022816주", weight: 45, returnRate: 8.2, category: "인컴" },
      { symbol: "QLD", name: "나스닥 2배", quantity: "26.471057주", weight: 30, returnRate: 24.1, category: "성장" },
      { symbol: "CASH", name: "현금", weight: 15, returnRate: null, category: "현금" },
      { symbol: "OTHER", name: "기타", weight: 10, returnRate: null, category: "기타" },
    ],
    decisions: ["QLD 비중은 추가로 늘리지 않음", "현금 비중 확보를 위해 QQQI 중심 유지", "시장 급등 구간에서 매수 속도는 조절"],
    review: "수익률보다 비중과 리듬을 우선하면서 포트폴리오를 관리했다.",
  },
  {
    id: "2026-06",
    date: "2026-06",
    growthIndex: 100,
    title: "속도보다 규칙",
    portfolio: [
      { symbol: "QQQI", name: "나스닥 인컴", quantity: "130주", weight: 42, returnRate: 6.4, category: "인컴" },
      { symbol: "QLD", name: "나스닥 2배", quantity: "24주", weight: 28, returnRate: 18.6, category: "성장" },
      { symbol: "CASH", name: "현금", weight: 20, returnRate: null, category: "현금" },
      { symbol: "OTHER", name: "기타", weight: 10, returnRate: null, category: "기타" },
    ],
    decisions: ["정해둔 비중 안에서만 추가 매수", "현금 비중을 급하게 줄이지 않음"],
    review: "상승장에도 기준을 유지하는 연습이 필요했다.",
  },
]);
