import {getBinding} from "@/db";
import {listContent} from "@/lib/content-store";
import {buildInvestmentGrowth} from "@/lib/investment-growth";
import {investmentLedgerSchema} from "@/lib/investment-ledger";
import type {InvestmentCurrency} from "@/types/investment-ledger";

export type HomeDashboardData={
  dateLabel:string;
  workout:{weekCount:number;goal:number;latestDate:string|null;latestRoutine:string|null};
  investment:{totalUsd:number;twr:number|null;monthDividendKrw:number;growth:number[]}|null;
  photo:{id:string;title:string;takenAt:string;imageUrl:string}|null;
  journal:{id:string;title:string;date:string;summary:string}|null;
  nextAction:{title:string;detail:string;href:string};
};

const dateString=(date:Date)=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).format(date);
const labelString=(date:Date)=>new Intl.DateTimeFormat("ko-KR",{timeZone:"Asia/Seoul",month:"long",day:"numeric",weekday:"long"}).format(date);
const monthKey=(date:string)=>date.slice(0,7);
const valueKrw=(amount:number,currency:InvestmentCurrency,rate:number|undefined,fallback:number)=>currency==="KRW"?amount:amount*(rate||fallback);

function currentWeek(today:string){
  const base=new Date(`${today}T00:00:00+09:00`),calendarDate=new Date(`${today}T12:00:00Z`),mondayOffset=(calendarDate.getUTCDay()+6)%7;
  return dateString(new Date(base.getTime()-mondayOffset*86400000));
}

export async function getHomeDashboard(userId:string):Promise<HomeDashboardData>{
  const now=new Date(),today=dateString(now),weekStart=currentWeek(today),month=monthKey(today),db=getBinding();
  const [weekResult,latestWorkout,ledgerRow,photos,journals]=await Promise.all([
    db.prepare("SELECT COUNT(*) AS total FROM workout_sessions WHERE user_id=? AND workout_date BETWEEN ? AND ?").bind(userId,weekStart,today).first<{total:number}>().catch(()=>null),
    db.prepare("SELECT workout_date AS workoutDate,routine FROM workout_sessions WHERE user_id=? ORDER BY workout_date DESC,id DESC LIMIT 1").bind(userId).first<{workoutDate:string;routine:string}>().catch(()=>null),
    db.prepare("SELECT payload_json FROM investment_ledgers WHERE user_id=?").bind(userId).first<{payload_json:string}>().catch(()=>null),
    listContent("photo").catch(()=>[]),
    listContent("journal").catch(()=>[]),
  ]);
  const weekCount=Number(weekResult?.total??0),goal=3;
  let investment:HomeDashboardData["investment"]=null;
  let hasCurrentSnapshot=false;
  if(ledgerRow){
    try{
      const ledger=investmentLedgerSchema.parse(JSON.parse(ledgerRow.payload_json)),growth=buildInvestmentGrowth(ledger),latest=[...ledger.snapshots].sort((a,b)=>b.date.localeCompare(a.date))[0];
      if(latest){
        const fx=latest.exchangeRate||1;
        investment={
          totalUsd:latest.totalKrw/fx,
          twr:growth.length>1?(growth.at(-1)!.index-100):null,
          monthDividendKrw:ledger.dividends.filter(item=>monthKey(item.date)===month).reduce((sum,item)=>sum+valueKrw(item.amount,item.currency,item.exchangeRate,fx),0),
          growth:growth.map(item=>item.usd),
        };
        hasCurrentSnapshot=monthKey(latest.date)===month;
      }
    }catch(error){console.error("home dashboard investment",error)}
  }
  const remaining=Math.max(0,goal-weekCount);
  const nextAction=!hasCurrentSnapshot&&Number(today.slice(8))>=25
    ?{title:`${Number(month.slice(5))}월 월말 기록 준비`,detail:"평가액·환율·시장 소감을 확인할 시점입니다.",href:"/invest"}
    :remaining>0
      ?{title:`이번 주 운동 ${remaining}회 남음`,detail:`현재 ${weekCount}회 · 주 ${goal}회 목표`,href:"/workout"}
      :{title:"이번 주 운동 목표 달성",detail:"다음 운동은 회복 상태를 확인하고 시작하세요.",href:"/workout"};
  const photo=photos[0],journal=journals[0];
  return {
    dateLabel:labelString(now),
    workout:{weekCount,goal,latestDate:latestWorkout?.workoutDate??null,latestRoutine:latestWorkout?.routine??null},
    investment,
    photo:photo?{id:photo.id,title:photo.title,takenAt:photo.takenAt,imageUrl:photo.imageUrl}:null,
    journal:journal?{id:journal.id,title:journal.title,date:journal.date,summary:journal.summary}:null,
    nextAction,
  };
}
