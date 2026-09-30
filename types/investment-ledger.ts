export type InvestmentCurrency = "KRW" | "USD";

export interface InvestmentAccount {
  id: string;
  name: string;
  type: "일반" | "ISA" | "연금저축" | "IRP" | "퇴직연금" | "기타";
  broker: string;
}

export interface InvestmentHolding {
  id: string;
  accountId: string;
  symbol: string;
  name: string;
  category: string;
  currency: InvestmentCurrency;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
}

export interface InvestmentCashflow {
  id: string;
  date: string;
  accountId: string;
  type: "deposit" | "withdrawal";
  amount: number;
  currency: InvestmentCurrency;
  exchangeRate?: number;
  note: string;
}

export interface InvestmentDividend {
  id: string;
  date: string;
  accountId: string;
  symbol: string;
  amount: number;
  currency: InvestmentCurrency;
  exchangeRate?: number;
  note: string;
}

export interface InvestmentSnapshot {
  id: string;
  date: string;
  totalKrw: number;
  exchangeRate: number;
  kospi?: number;
  sp500?: number;
  nasdaq?: number;
  note: string;
  marketSummary?: string;
  marketSources?: {title:string;url:string}[];
}

export interface InvestmentLedger {
  accounts: InvestmentAccount[];
  holdings: InvestmentHolding[];
  cashflows: InvestmentCashflow[];
  dividends: InvestmentDividend[];
  snapshots: InvestmentSnapshot[];
  settings: {
    monthlyBillsKrw: number;
    monthlyDividendTargetKrw: number;
    retirementAge: number;
    expectedAnnualDividendGrowthPercent: number;
  };
}
