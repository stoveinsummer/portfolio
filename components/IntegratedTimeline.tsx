"use client";

import {useMemo,useState} from "react";
import {BookOpen,CalendarDays,Camera,ChartNoAxesCombined,Dumbbell} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import type {TimelineEvent,TimelineEventType} from "@/lib/timeline";

const meta:Record<TimelineEventType,{label:string;Icon:typeof Dumbbell}>={
  workout:{label:"운동",Icon:Dumbbell},investment:{label:"투자",Icon:ChartNoAxesCombined},photo:{label:"사진",Icon:Camera},journal:{label:"저널",Icon:BookOpen},
  google:{label:"Google",Icon:CalendarDays},
};
const toDate=(value:string)=>{const [year,month,day]=value.split("-").map(Number);return new Date(year,month-1,day)};
const toKey=(date:Date)=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
const longDate=(value:string)=>new Intl.DateTimeFormat("ko-KR",{year:"numeric",month:"long",day:"numeric",weekday:"short"}).format(toDate(value));

export function IntegratedTimeline({events}:{events:TimelineEvent[]}){
  const today=toKey(new Date()),initial=events.some(event=>event.date===today)?today:(events[0]?.date??today);
  const [selected,setSelected]=useState(initial);
  const eventDates=useMemo(()=>[...new Set(events.map(event=>event.date))].map(toDate),[events]);
  const selectedEvents=events.filter(event=>event.date===selected);
  const eventCountByType=useMemo(()=>events.reduce((result,event)=>({...result,[event.type]:(result[event.type]??0)+1}),{} as Partial<Record<TimelineEventType,number>>),[events]);
  return <div className="timeline-layout">
    <section className="timeline-calendar-panel" aria-label="통합 캘린더">
      <div className="timeline-panel-heading"><div><span>ALL RECORDS</span><h1>통합 캘린더</h1></div><strong>{events.length}<small> records</small></strong></div>
      <Calendar mode="single" selected={toDate(selected)} defaultMonth={toDate(initial)} onSelect={date=>date&&setSelected(toKey(date))} modifiers={{hasEvents:eventDates}} modifiersClassNames={{hasEvents:"timeline-day-has-events"}} showOutsideDays fixedWeeks className="timeline-calendar" />
      <div className="timeline-legend">{(Object.keys(meta) as TimelineEventType[]).map(type=>{const {label,Icon}=meta[type];return <span key={type}><Icon/>{label}<b>{eventCountByType[type]??0}</b></span>})}</div>
    </section>
    <section className="timeline-stream" aria-label="날짜별 타임라인">
      <header><div><span>SELECTED DATE</span><h2>{longDate(selected)}</h2></div><button type="button" onClick={()=>setSelected(today)}><CalendarDays/>오늘</button></header>
      {selectedEvents.length?<ol>{selectedEvents.map(event=>{const {label,Icon}=meta[event.type];return <li key={event.id} className={`timeline-event timeline-${event.type}`}><span className="timeline-event-icon"><Icon/></span><a href={event.href} target={event.external?"_blank":undefined} rel={event.external?"noreferrer":undefined}><small>{label}</small><strong>{event.title}</strong><p>{event.detail}</p></a></li>})}</ol>:<div className="timeline-empty"><CalendarDays/><strong>이날의 기록은 없습니다.</strong><p>기록이 있는 날짜에는 달력 아래에 점이 표시됩니다.</p></div>}
    </section>
  </div>;
}
