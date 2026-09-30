import type {InvestmentRecord} from "@/types/content";

const signed=(value:number)=>`${value>=0?"+":""}${value.toFixed(1)}%`;
const dollars=(value:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(value);

export function InvestmentDashboard({record,modelIndex,owner}:{record:InvestmentRecord;modelIndex:number|null;owner:boolean}){
  const topHolding=[...record.portfolio].sort((a,b)=>b.weight-a.weight)[0];
  const measured=record.portfolio.filter(item=>item.returnRate!==null);
  const measuredWeight=measured.reduce((sum,item)=>sum+item.weight,0);
  const weightedReturn=measuredWeight?measured.reduce((sum,item)=>sum+item.weight*(item.returnRate??0),0)/measuredWeight:0;
  const showTotal=owner&&record.totalUsd!==undefined;
  const value=showTotal?dollars(record.totalUsd!):modelIndex===null?"—":modelIndex.toFixed(1);
  return <section className="invest-dashboard" aria-label="포트폴리오 핵심 지표">
    <div className="invest-dashboard-lead">
      <p className="eyebrow">Portfolio snapshot · {record.date}</p>
      <span className="dashboard-index-label">{showTotal?"주식 평가액 · USD":"종가 기준 지수"}</span>
      <strong>{value}</strong>
      <em>{showTotal?"첨부 계좌 화면 기준":modelIndex===null?"종가 자료가 필요합니다":`${record.marketCloseDate??record.date} 종가 · 첫 기록 100`}</em>
    </div>
    <dl>
      <div><dt>보유 자산</dt><dd>{record.portfolio.length}<small>개 자산</small></dd></div>
      <div><dt>최대 비중</dt><dd>{topHolding?.weight.toFixed(1)}%<small>{topHolding?.symbol}</small></dd></div>
      {owner?<div><dt>계좌 평가 수익률</dt><dd className={record.accountReturnRate!=null&&record.accountReturnRate>=0?"positive":"negative"}>{record.accountReturnRate==null?"—":signed(record.accountReturnRate)}<small>원금 대비</small></dd></div>:<div><dt>지수 변동</dt><dd className={modelIndex!==null&&modelIndex>=100?"positive":"negative"}>{modelIndex===null?"—":signed(modelIndex-100)}<small>첫 기록 대비</small></dd></div>}
      <div><dt>가중 보유 수익률</dt><dd className={weightedReturn>=0?"positive":"negative"}>{signed(weightedReturn)}<small>종목 수익률 가중</small></dd></div>
    </dl>
  </section>;
}
