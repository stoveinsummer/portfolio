import {getBinding} from "@/db";
import {investmentLedgerSchema} from "@/lib/investment-ledger";
import {buildInvestmentGrowth} from "@/lib/investment-growth";
import type {InvestmentCurrency,InvestmentLedger} from "@/types/investment-ledger";

export type PublicInvestmentSummary={asOf:string;snapshotCount:number;portfolioIndex:number|null;growthTrend:{date:string;index:number}[];benchmarks:{label:string;index:number|null}[];holdings:{symbol:string;name:string;category:string;weight:number}[];dividendTrend:{month:string;index:number}[];monthlyReviews:{date:string;reflection:string;marketSummary:string;sources:{title:string;url:string}[]}[]};
const valueKrw=(amount:number,currency:InvestmentCurrency,rate:number|undefined,fallback:number)=>currency==="KRW"?amount:amount*(rate||fallback);

export function summarizeInvestmentLedger(ledger:InvestmentLedger):PublicInvestmentSummary|null{
  const snapshots=[...ledger.snapshots].sort((a,b)=>a.date.localeCompare(b.date)),latest=snapshots.at(-1);
  if(!latest)return null;
  const fx=latest.exchangeRate||1,values=ledger.holdings.map(h=>({...h,value:valueKrw(h.quantity*h.currentPrice,h.currency,undefined,fx)})),total=values.reduce((sum,h)=>sum+h.value,0);
  const holdings=values.map(h=>({symbol:h.symbol,name:h.name,category:h.category,weight:total?h.value/total*100:0})).sort((a,b)=>b.weight-a.weight);
  const growth=buildInvestmentGrowth(ledger);
  const first=snapshots[0],benchmark=(key:"kospi"|"sp500"|"nasdaq")=>first[key]&&latest[key]?latest[key]!/first[key]!*100:null;
  const monthly=new Map<string,number>();for(const d of ledger.dividends){const month=d.date.slice(0,7);monthly.set(month,(monthly.get(month)??0)+valueKrw(d.amount,d.currency,d.exchangeRate,fx));}
  const ordered=[...monthly.entries()].filter(([,v])=>v>0).sort(([a],[b])=>a.localeCompare(b)),base=ordered[0]?.[1]??0;
  const monthlyReviews=[...snapshots].reverse().filter(x=>x.note||x.marketSummary).map(x=>({date:x.date,reflection:x.note,marketSummary:x.marketSummary??"",sources:x.marketSources??[]}));
  return {asOf:latest.date,snapshotCount:snapshots.length,portfolioIndex:snapshots.length>1?growth.at(-1)!.index:null,growthTrend:growth.map(point=>({date:point.date,index:point.index})),benchmarks:[{label:"KOSPI",index:benchmark("kospi")},{label:"S&P 500",index:benchmark("sp500")},{label:"NASDAQ",index:benchmark("nasdaq")}],holdings,dividendTrend:ordered.slice(-12).map(([month,value])=>({month,index:base?value/base*100:0})),monthlyReviews};
}

export async function getPublicInvestmentSummary(){try{const row=await getBinding().prepare("SELECT payload_json FROM investment_ledgers ORDER BY updated_at DESC LIMIT 1").first<{payload_json:string}>();return row?summarizeInvestmentLedger(investmentLedgerSchema.parse(JSON.parse(row.payload_json))):null;}catch(error){console.error("public investment summary",error);return null;}}
