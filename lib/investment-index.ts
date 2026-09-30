import type {InvestmentRecord} from "@/types/content";

/** Price-only model: rebalance to each saved allocation after that snapshot. */
export function calculatePriceIndex(records:InvestmentRecord[]):Map<string,number|null>{
  const ordered=[...records].sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
  const results=new Map<string,number|null>();
  let previous:InvestmentRecord|undefined;
  let index:number|null=null;
  for(const record of ordered){
    if(!record.marketCloseDate){results.set(record.id,null);continue;}
    if(!previous){index=100;}
    else if(index!==null&&previous.marketCloseDate){
      if(record.marketCloseDate<previous.marketCloseDate)index=null;
      else if(record.marketCloseDate!==previous.marketCloseDate){
        const nextPrices=new Map(record.portfolio.map(item=>[item.symbol,item.closePriceUsd]));
        let factor=0;
        for(const item of previous.portfolio){
          if(item.symbol==='CASH'||item.symbol==='OTHER'){factor+=item.weight/100;continue;}
          const next=nextPrices.get(item.symbol);
          if(!item.closePriceUsd||!next){factor=NaN;break;}
          factor+=item.weight/100*next/item.closePriceUsd;
        }
        if(!Number.isFinite(factor)){results.set(record.id,null);continue;}
        index*=factor;
      }
    }else index=null;
    results.set(record.id,index);
    previous=record;
  }
  return results;
}
