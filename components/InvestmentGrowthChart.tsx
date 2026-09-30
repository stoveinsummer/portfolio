"use client";

import {Area,AreaChart,CartesianGrid,ResponsiveContainer,Tooltip,XAxis,YAxis} from "recharts";

type GrowthPoint={date:string;value:number};
type GrowthMode="usd"|"index";

const usd=(value:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value);
const compactUsd=(value:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",notation:"compact",maximumFractionDigits:1}).format(value);
const index=(value:number)=>value.toFixed(1);
const month=(date:string)=>date.slice(2,7).replace("-",".");

export function InvestmentGrowthChart({points,mode}:{points:GrowthPoint[];mode:GrowthMode}){
  if(points.length<2)return <p className="tracker-empty">월말 기록이 2개 이상 쌓이면 성장 곡선이 표시됩니다.</p>;
  const first=points[0].value,last=points.at(-1)!.value,change=first>0?(last/first-1)*100:0,delta=last-first;
  const valueLabel=mode==="usd"?usd:index;
  const axisLabel=mode==="usd"?compactUsd:index;
  const description=mode==="usd"?`첫 기록 ${usd(first)}에서 최근 ${usd(last)}로 평가액 ${usd(Math.abs(delta))} ${delta>=0?"증가":"감소"}`:`첫 기록 100에서 최근 ${index(last)}로 ${Math.abs(last-100).toFixed(1)}포인트 ${last>=100?"상승":"하락"}`;
  return <div className="growth-chart" role="img" aria-label={description}>
    <div className="growth-chart-summary"><span>{mode==="usd"?"첫 기록 대비 평가액":"첫 기록 대비 지수"}</span><strong className={(mode==="usd"?delta:change)>=0?"positive":"negative"}>{mode==="usd"?(delta>=0?`+${usd(delta)}`:usd(delta)):`${change>=0?"+":""}${change.toFixed(1)}%`}</strong></div>
    <ResponsiveContainer width="100%" height={270}>
      <AreaChart data={points} margin={{top:16,right:8,bottom:0,left:4}}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5"/>
        <XAxis dataKey="date" tickFormatter={month} axisLine={false} tickLine={false} tick={{fill:"var(--muted-foreground)",fontSize:11}} minTickGap={22}/>
        <YAxis width={58} tickFormatter={axisLabel} axisLine={false} tickLine={false} tick={{fill:"var(--muted-foreground)",fontSize:10}} domain={["auto","auto"]}/>
        <Tooltip cursor={{stroke:"var(--muted-foreground)",strokeDasharray:"3 4"}} contentStyle={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"10px",color:"var(--foreground)",boxShadow:"0 12px 30px #00000018"}} labelStyle={{color:"var(--muted-foreground)",fontSize:11,marginBottom:4}} labelFormatter={label=>String(label)} formatter={value=>[valueLabel(Number(value)),mode==="usd"?"평가액":"TWR 지수"]}/>
        <Area type="monotone" dataKey="value" stroke="var(--foreground)" strokeWidth={2.5} fill="var(--foreground)" fillOpacity={0.08} dot={{r:3,fill:"var(--card)",stroke:"var(--foreground)",strokeWidth:2}} activeDot={{r:5,fill:"var(--foreground)",stroke:"var(--card)",strokeWidth:2}}/>
      </AreaChart>
    </ResponsiveContainer>
  </div>;
}
