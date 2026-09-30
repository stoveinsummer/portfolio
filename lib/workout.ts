import { z } from "zod";
export const kinds = {weight:"웨이트",bodyweight:"맨몸",cardio:"시간·거리",timed:"시간"} as const;
export type Kind=keyof typeof kinds;
export const exerciseSchema=z.object({key:z.string().min(1).max(80),name:z.string().trim().min(1).max(80),type:z.enum(["weight","bodyweight","cardio","timed"]),setCount:z.number().int().min(1).max(20),equipment:z.string().trim().max(60).optional(),variation:z.string().trim().max(80).optional(),notes:z.string().trim().max(300).optional(),targetReps:z.string().trim().max(40).optional()});
export const planSchema=z.array(z.object({key:z.string().min(1).max(80),name:z.string().trim().min(1).max(60),exercises:z.array(exerciseSchema).max(30)})).min(1).max(20).refine(plans=>new Set(plans.map(p=>p.key)).size===plans.length&&plans.every(p=>new Set(p.exercises.map(e=>e.key)).size===p.exercises.length));
export type Exercise=z.infer<typeof exerciseSchema>;
export type Plan=z.infer<typeof planSchema>[number];
export const defaults:Plan[] = [
  {key:"A",name:"A 루틴",exercises:[
    {key:"leg-press",name:"레그프레스",type:"weight",setCount:3,targetReps:"8~12"},
    {key:"chest-press",name:"체스트프레스 머신",type:"weight",setCount:3,targetReps:"8~12"},
    {key:"lat-pulldown",name:"랫풀다운",type:"weight",setCount:3,targetReps:"8~12"},
    {key:"shoulder-press",name:"숄더프레스 머신",type:"weight",setCount:2,targetReps:"8~12"},
    {key:"cable-curl",name:"케이블 컬",type:"weight",setCount:2,targetReps:"10~15"},
  ]},
  {key:"B",name:"B 루틴",exercises:[
    {key:"leg-curl",name:"레그컬",type:"weight",setCount:3,targetReps:"10~15"},
    {key:"incline-chest-press",name:"인클라인 체스트프레스 머신",type:"weight",setCount:3,targetReps:"8~12"},
    {key:"chest-supported-row",name:"체스트 서포티드 로우",type:"weight",setCount:3,targetReps:"8~12"},
    {key:"lateral-raise",name:"레터럴 레이즈",type:"weight",setCount:2,targetReps:"12~15"},
    {key:"cable-pushdown",name:"케이블 푸시다운",type:"weight",setCount:2,targetReps:"10~15"},
  ]},
];
export const setSchema=z.object({exerciseKey:z.string().min(1).max(80),exerciseName:z.string().min(1).max(240),exerciseType:z.enum(["weight","bodyweight","cardio","timed"]),setNumber:z.number().int().min(1).max(20),weight:z.number().finite().min(0).max(2000),reps:z.number().int().min(0).max(10000),rir:z.number().int().min(0).max(10),duration:z.number().finite().min(0).max(100000),distance:z.number().finite().min(0).max(10000)}).refine(s=>s.exerciseType==="weight"?s.reps>0:s.exerciseType==="bodyweight"?s.reps>0:s.duration>0&&(s.exerciseType!=="cardio"||s.distance>0));
export const workoutSchema=z.object({requestKey:z.string().uuid(),routine:z.string().min(1).max(60),bodyWeight:z.number().finite().positive().max(500).nullable(),backCondition:z.number().int().min(1).max(5),sets:z.array(setSchema).min(1).max(300)});
export type SavedSet=z.infer<typeof setSchema>;
export type Session={id:number;workoutDate:string;routine:string;bodyWeight:number|null;backCondition:number;sets:SavedSet[];totalVolume:number};
