import {z} from "zod";
import type {InvestmentLedger} from "@/types/investment-ledger";

const text=(max:number)=>z.string().trim().min(1).max(max);
const id=text(80);
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const currency=z.enum(["KRW","USD"]);
const amount=z.number().finite().nonnegative().max(1_000_000_000_000);
const rate=z.number().finite().positive().max(100_000);

export const investmentLedgerSchema=z.object({
  accounts:z.array(z.object({id,name:text(80),type:z.enum(["일반","ISA","연금저축","IRP","퇴직연금","기타"]),broker:z.string().trim().max(80)})).min(1).max(30),
  holdings:z.array(z.object({id,accountId:id,symbol:text(30),name:text(100),category:text(50),currency,quantity:amount,averagePrice:amount,currentPrice:amount})).max(200),
  cashflows:z.array(z.object({id,date,accountId:id,type:z.enum(["deposit","withdrawal"]),amount,currency,exchangeRate:rate.optional(),note:z.string().trim().max(300)})).max(3000),
  dividends:z.array(z.object({id,date,accountId:id,symbol:text(30),amount,currency,exchangeRate:rate.optional(),note:z.string().trim().max(300)})).max(3000),
  snapshots:z.array(z.object({id,date,totalKrw:amount,exchangeRate:rate,kospi:rate.optional(),sp500:rate.optional(),nasdaq:rate.optional(),note:z.string().trim().max(1200),marketSummary:z.string().trim().max(2400).optional(),marketSources:z.array(z.object({title:text(200),url:z.string().url().max(500)})).max(8).optional()})).max(1000),
  settings:z.object({monthlyBillsKrw:amount,monthlyDividendTargetKrw:amount,retirementAge:z.number().int().min(31).max(100),expectedAnnualDividendGrowthPercent:z.number().finite().min(-100).max(100)}),
}).superRefine((ledger,ctx)=>{
  const accountIds=new Set(ledger.accounts.map(x=>x.id));
  if(accountIds.size!==ledger.accounts.length)ctx.addIssue({code:"custom",message:"계좌 ID가 중복되었습니다."});
  for(const item of [...ledger.holdings,...ledger.cashflows,...ledger.dividends])if(!accountIds.has(item.accountId))ctx.addIssue({code:"custom",message:"존재하지 않는 계좌가 연결되어 있습니다."});
  for(const list of [ledger.holdings,ledger.cashflows,ledger.dividends,ledger.snapshots])if(new Set(list.map(x=>x.id)).size!==list.length)ctx.addIssue({code:"custom",message:"기록 ID가 중복되었습니다."});
});

export const defaultInvestmentLedger:InvestmentLedger={
  accounts:[
    {id:"general",name:"일반계좌",type:"일반",broker:""},
  ],
  holdings:[],cashflows:[],dividends:[],snapshots:[],
  settings:{monthlyBillsKrw:0,monthlyDividendTargetKrw:0,retirementAge:60,expectedAnnualDividendGrowthPercent:5},
};
