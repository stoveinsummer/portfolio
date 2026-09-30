import type {InvestmentCurrency,InvestmentLedger} from "@/types/investment-ledger";

export type InvestmentGrowthPoint={date:string;usd:number;index:number};

const valueKrw=(amount:number,currency:InvestmentCurrency,rate:number|undefined,fallback:number)=>currency==="KRW"?amount:amount*(rate||fallback);

export function buildInvestmentGrowth(ledger:InvestmentLedger):InvestmentGrowthPoint[]{
  const snapshots=[...ledger.snapshots].sort((a,b)=>a.date.localeCompare(b.date));
  let factor=1;
  return snapshots.map((current,index)=>{
    if(index>0){
      const before=snapshots[index-1];
      if(before.totalKrw>0){
        const flow=ledger.cashflows
          .filter(item=>item.date>before.date&&item.date<=current.date)
          .reduce((sum,item)=>sum+(item.type==="deposit"?1:-1)*valueKrw(item.amount,item.currency,item.exchangeRate,current.exchangeRate),0);
        factor*=Math.max(0,(current.totalKrw-flow)/before.totalKrw);
      }
    }
    return {date:current.date,usd:current.exchangeRate?current.totalKrw/current.exchangeRate:0,index:factor*100};
  });
}
