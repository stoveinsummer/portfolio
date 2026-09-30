import {InvestmentGrowthChart} from "@/components/InvestmentGrowthChart";
import type {PublicInvestmentSummary} from "@/lib/investment-public";

const index=(value:number|null)=>value===null?"—":value.toFixed(1);

export function PublicInvestmentLedger({summary}:{summary:PublicInvestmentSummary}){
  const maxDividend=Math.max(...summary.dividendTrend.map(item=>item.index),1);
  return <section className="public-ledger" aria-label="공개 투자 흐름">
    <div className="tracker-head"><div><p className="eyebrow">PUBLIC INDEX</p><h2>투자 흐름</h2><p>{summary.asOf} 기준 · 금액과 수량은 비공개</p></div><span className="public-chip">최초 기록 = 100</span></div>
    <div className="public-index-grid"><article className="public-index-main"><span>내 계좌 TWR 지수</span><strong>{index(summary.portfolioIndex)}</strong><small>입출금 영향을 제거한 {summary.snapshotCount}회 기록</small></article>{summary.benchmarks.map(item=><article key={item.label}><span>{item.label}</span><strong>{index(item.index)}</strong><small>첫 기록 대비 가격 지수</small></article>)}</div>
    <section className="tracker-card growth-card"><div className="tracker-card-head"><div><span>월간 성장 곡선</span><h3>투자 지수 추이</h3></div><b>금액 비공개</b></div><InvestmentGrowthChart mode="index" points={summary.growthTrend.map(point=>({date:point.date,value:point.index}))}/><p className="growth-chart-note">입출금 영향을 제거한 기간별 수익률을 연결했습니다. 첫 월말 기록을 100으로 환산합니다.</p></section>
    <div className="tracker-grid"><section className="tracker-card"><div className="tracker-card-head"><div><span>공개 보유 현황</span><h3>종목별 현재 비중</h3></div><b>{summary.holdings.length}개</b></div><div className="public-holdings">{summary.holdings.map(holding=><div key={holding.symbol}><div><strong>{holding.symbol}</strong><span>{holding.name} · {holding.category}</span></div><b>{holding.weight.toFixed(1)}%</b><i><span style={{width:`${holding.weight}%`}}/></i></div>)}</div></section><section className="tracker-card"><div className="tracker-card-head"><div><span>배당 흐름</span><h3>첫 배당월 = 100</h3></div><b>금액 비공개</b></div>{summary.dividendTrend.length?<div className="dividend-bars public-dividend-bars">{summary.dividendTrend.map(item=><div key={item.month}><span style={{height:`${Math.max(4,item.index/maxDividend*100)}%`}}/><small>{item.month.slice(5)}</small></div>)}</div>:<p className="tracker-empty">배당 기록이 아직 없습니다.</p>}</section></div>
    {summary.monthlyReviews.length>0&&<section className="monthly-review-list"><div className="tracker-section-head"><div><h3>월말 소감</h3><span>스냅샷 · 소감 · AI 증시 요약</span></div></div>{summary.monthlyReviews.map(review=><article key={review.date}><time>{review.date.slice(0,7)}</time>{review.reflection&&<div><span>내 소감</span><p>{review.reflection}</p></div>}{review.marketSummary&&<div><span>AI 월간 증시 요약</span><p>{review.marketSummary}</p>{review.sources.length>0&&<nav aria-label={`${review.date.slice(0,7)} 자료`}>{review.sources.map(source=><a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.title}</a>)}</nav>}</div>}</article>)}</section>}
    <p className="tracker-note">다른 로그인 사용자는 종목 비중과 기준지수, 월말 소감만 볼 수 있습니다. 평가액·수량·평균단가·입출금·배당금·환율은 서버에서 제거한 뒤 표시합니다.</p>
  </section>;
}
