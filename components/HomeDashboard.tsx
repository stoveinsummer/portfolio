import {ArrowUpRight,BookOpen,CalendarCheck2,Camera,ChartNoAxesCombined,Dumbbell} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import type {HomeDashboardData} from "@/lib/home-dashboard";

const usd=(value:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value);
const krw=(value:number)=>new Intl.NumberFormat("ko-KR",{style:"currency",currency:"KRW",maximumFractionDigits:0}).format(value);
const pct=(value:number)=>`${value>=0?"+":""}${value.toFixed(1)}%`;

function Sparkline({values}:{values:number[]}){
  if(values.length<2)return <div className="home-sparkline-empty">월말 기록을 추가하면 추이가 표시됩니다.</div>;
  const width=320,height=82,min=Math.min(...values),max=Math.max(...values),range=Math.max(max-min,1);
  const points=values.map((value,index)=>`${index/(values.length-1)*width},${height-(value-min)/range*(height-10)-5}`).join(" ");
  return <svg className="home-sparkline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round"/></svg>;
}

export function HomeDashboard({data}:{data:HomeDashboardData}){
  const workoutProgress=Math.min(data.workout.weekCount/data.workout.goal*100,100);
  return <section className="home-dashboard" aria-label="개인 대시보드">
    <div className="home-dashboard-head"><div><p>{data.dateLabel}</p><h1>오늘</h1></div><nav aria-label="빠른 기록"><a href="/workout"><Dumbbell/>운동 기록</a><a href="/invest"><ChartNoAxesCombined/>월말 기록</a></nav></div>
    <div className="home-dashboard-grid">
      <a className="home-dashboard-card home-workout-card" href="/workout"><div className="home-card-head"><span><Dumbbell/>이번 주 운동</span><ArrowUpRight/></div><strong>{data.workout.weekCount}<small> / {data.workout.goal}회</small></strong><Progress value={workoutProgress} aria-label={`이번 주 운동 목표 ${workoutProgress.toFixed(0)}%`}/><p>{data.workout.latestDate?`최근 ${data.workout.latestDate} · ${data.workout.latestRoutine}`:"첫 운동을 기록해 보세요."}</p></a>
      <a className="home-dashboard-card home-invest-card" href="/invest"><div className="home-card-head"><span><ChartNoAxesCombined/>투자</span><ArrowUpRight/></div>{data.investment?<><div className="home-invest-value"><strong>{usd(data.investment.totalUsd)}</strong><span className={data.investment.twr!==null&&data.investment.twr>=0?"positive":"negative"}>{data.investment.twr===null?"TWR —":`TWR ${pct(data.investment.twr)}`}</span></div><Sparkline values={data.investment.growth}/><p>이번 달 배당 {krw(data.investment.monthDividendKrw)}</p></>:<p className="home-card-empty">월말 투자 기록을 추가하면 자산 흐름을 볼 수 있습니다.</p>}</a>
      <a className="home-dashboard-card home-photo-card" href={data.photo?`/photo/${data.photo.id}`:"/photo"}><div className="home-photo-copy"><div className="home-card-head"><span><Camera/>최근 사진</span><ArrowUpRight/></div>{data.photo?<><strong>{data.photo.title}</strong><p>{data.photo.takenAt}</p></>:<p className="home-card-empty">등록된 사진이 없습니다.</p>}</div>{data.photo&&<img src={data.photo.imageUrl} alt=""/>}</a>
      <a className="home-dashboard-card home-journal-card" href={data.journal?`/journal/${data.journal.id}`:"/journal"}><div className="home-card-head"><span><BookOpen/>최근 저널</span><ArrowUpRight/></div>{data.journal?<><strong>{data.journal.title}</strong><p>{data.journal.summary}</p><time>{data.journal.date}</time></>:<p className="home-card-empty">등록된 저널이 없습니다.</p>}</a>
      <a className="home-dashboard-card home-next-card" href={data.nextAction.href}><div className="home-card-head"><span><CalendarCheck2/>다음 할 일</span><ArrowUpRight/></div><strong>{data.nextAction.title}</strong><p>{data.nextAction.detail}</p></a>
    </div>
  </section>;
}
