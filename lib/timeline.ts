import {getBinding} from "@/db";
import {listContent} from "@/lib/content-store";
import {investmentLedgerSchema} from "@/lib/investment-ledger";

export type TimelineEventType="workout"|"investment"|"photo"|"journal"|"google";
export type TimelineEvent={
  id:string;
  date:string;
  type:TimelineEventType;
  title:string;
  detail:string;
  href:string;
  external?:boolean;
};

type WorkoutRow={id:number;workoutDate:string;routine:string;setCount:number;exerciseCount:number;totalVolume:number};

const money=(amount:number,currency:"KRW"|"USD")=>new Intl.NumberFormat(currency==="KRW"?"ko-KR":"en-US",{style:"currency",currency,maximumFractionDigits:currency==="KRW"?0:2}).format(amount);

export async function getIntegratedTimeline(userId:string|null):Promise<TimelineEvent[]>{
  const db=getBinding();
  const [photos,journals,workouts,ledgerRow]=await Promise.all([
    listContent("photo").catch(()=>[]),
    listContent("journal").catch(()=>[]),
    userId?db.prepare(`SELECT s.id,s.workout_date AS workoutDate,s.routine,COUNT(ws.id) AS setCount,COUNT(DISTINCT ws.exercise_key) AS exerciseCount,COALESCE(SUM(CASE WHEN ws.exercise_type='weight' THEN ws.weight*ws.reps ELSE 0 END),0) AS totalVolume FROM workout_sessions s LEFT JOIN workout_sets ws ON ws.session_id=s.id WHERE s.user_id=? GROUP BY s.id ORDER BY s.workout_date DESC,s.id DESC`).bind(userId).all<WorkoutRow>().catch(()=>({results:[]})):Promise.resolve({results:[]} as {results:WorkoutRow[]}),
    userId?db.prepare("SELECT payload_json FROM investment_ledgers WHERE user_id=?").bind(userId).first<{payload_json:string}>().catch(()=>null):Promise.resolve(null),
  ]);

  const events:TimelineEvent[]=[
    ...photos.map(photo=>({id:`photo-${photo.id}`,date:photo.takenAt,type:"photo" as const,title:photo.title,detail:`${photo.location} · ${photo.category}`,href:`/photo/${photo.id}`})),
    ...journals.map(journal=>({id:`journal-${journal.id}`,date:journal.date,type:"journal" as const,title:journal.title,detail:journal.category,href:`/journal/${journal.id}`})),
    ...workouts.results.map(workout=>({id:`workout-${workout.id}`,date:workout.workoutDate,type:"workout" as const,title:workout.routine,detail:`${workout.exerciseCount}종목 · ${workout.setCount}세트${workout.totalVolume>0?` · ${Math.round(workout.totalVolume).toLocaleString("ko-KR")}kg`:""}`,href:"/workout"})),
  ];

  if(ledgerRow){
    try{
      const ledger=investmentLedgerSchema.parse(JSON.parse(ledgerRow.payload_json));
      events.push(
        ...ledger.snapshots.map(item=>({id:`snapshot-${item.id}`,date:item.date,type:"investment" as const,title:"포트폴리오 스냅샷",detail:`총 평가액 ${money(item.totalKrw,"KRW")} · 환율 ${item.exchangeRate.toLocaleString("ko-KR")}원`,href:"/invest"})),
        ...ledger.dividends.map(item=>({id:`dividend-${item.id}`,date:item.date,type:"investment" as const,title:`${item.symbol} 배당`,detail:`배당 ${money(item.amount,item.currency)}`,href:"/invest"})),
        ...ledger.cashflows.map(item=>({id:`cashflow-${item.id}`,date:item.date,type:"investment" as const,title:item.type==="deposit"?"투자금 입금":"투자금 출금",detail:`${money(item.amount,item.currency)}${item.note?` · ${item.note}`:""}`,href:"/invest"})),
      );
    }catch(error){console.error("timeline investment",error)}
  }

  if(userId){
    const {listGoogleCalendarEvents}=await import("@/lib/google-calendar");
    events.push(...await listGoogleCalendarEvents(userId));
  }

  return events.sort((a,b)=>b.date.localeCompare(a.date)||a.type.localeCompare(b.type)||a.id.localeCompare(b.id));
}
