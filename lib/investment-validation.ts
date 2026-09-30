import type {InvestmentLedger} from "@/types/investment-ledger";

export type InvestmentCheck={level:"ok"|"warning"|"error";title:string;detail:string};
export type InvestmentValidation={basis:"현금 제외"|"현금 포함"|null;recordedKrw:number;matchedKrw:number;differenceKrw:number;cashKrw:number;checks:InvestmentCheck[]};

export function validateInvestmentLedger(ledger:InvestmentLedger):InvestmentValidation{
  const latest=[...ledger.snapshots].sort((a,b)=>b.date.localeCompare(a.date))[0],fx=latest?.exchangeRate||1350;
  const value=(currency:"KRW"|"USD",amount:number)=>currency==="KRW"?amount:amount*fx;
  const cash=ledger.holdings.filter(item=>item.category==="현금"||item.symbol.startsWith("CASH-"));
  const securities=ledger.holdings.filter(item=>!cash.includes(item));
  const total=(items:typeof ledger.holdings)=>items.reduce((sum,item)=>sum+value(item.currency,item.quantity*item.currentPrice),0);
  const securitiesKrw=total(securities),cashKrw=total(cash),withCash=securitiesKrw+cashKrw,recordedKrw=latest?.totalKrw??0;
  const diffS=Math.abs(recordedKrw-securitiesKrw),diffAll=Math.abs(recordedKrw-withCash),basis=latest?(diffS<=diffAll?"현금 제외":"현금 포함"):null,matchedKrw=basis==="현금 제외"?securitiesKrw:withCash,differenceKrw=latest?recordedKrw-matchedKrw:0;
  const checks:InvestmentCheck[]=[];
  if(!latest)checks.push({level:"warning",title:"월말 스냅샷 없음",detail:"스냅샷을 추가하면 보유액과 기록값을 대조합니다."});
  else{
    const tolerance=Math.max(1000,recordedKrw*.001),abs=Math.abs(differenceKrw),ratio=recordedKrw?abs/recordedKrw:0;
    checks.push(abs<=tolerance?{level:"ok",title:"평가액 대조 정상",detail:`${basis} 기준 차이 ${Math.round(differenceKrw).toLocaleString()}원`}:{level:ratio<=.01?"warning":"error",title:"평가액 차이 확인",detail:`${basis} 기준 ${Math.round(differenceKrw).toLocaleString()}원 (${(ratio*100).toFixed(2)}%) 차이`});
    const months=new Map<string,number>();for(const item of ledger.snapshots){const month=item.date.slice(0,7);months.set(month,(months.get(month)??0)+1)}const duplicate=[...months].filter(([,count])=>count>1).map(([month])=>month);
    if(duplicate.length)checks.push({level:"warning",title:"같은 달 스냅샷 중복",detail:`${duplicate.join(", ")} 기록을 확인해 주세요.`});
  }
  const noDividendFx=ledger.dividends.filter(item=>item.currency==="USD"&&!item.exchangeRate).length;
  if(noDividendFx)checks.push({level:"warning",title:"배당 환율 누락",detail:`USD 배당 ${noDividendFx}건이 최신 환율로 다시 계산됩니다.`});
  const noCashflowFx=ledger.cashflows.filter(item=>item.currency==="USD"&&!item.exchangeRate).length;
  if(noCashflowFx)checks.push({level:"warning",title:"입출금 환율 누락",detail:`USD 입출금 ${noCashflowFx}건의 당시 환율을 입력하면 TWR이 더 정확해집니다.`});
  if(!checks.some(item=>item.level!=="ok"))checks.push({level:"ok",title:"기본 무결성 정상",detail:"중복 월 기록과 환율 누락이 없습니다."});
  return {basis,recordedKrw,matchedKrw,differenceKrw,cashKrw,checks};
}
