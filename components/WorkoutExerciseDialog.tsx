"use client";

import {useEffect,useMemo,useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle} from "@/components/ui/dialog";
import {kinds,type Exercise,type Plan} from "@/lib/workout";

type Props={open:boolean;mode:"add"|"edit";plans:Plan[];currentKeys:string[];initial?:Exercise;onOpenChange:(open:boolean)=>void;onSubmit:(exercise:Exercise)=>void};
const blank=():Exercise=>({key:crypto.randomUUID(),name:"",type:"weight",setCount:3,equipment:"",variation:"",targetReps:"",notes:""});

export function WorkoutExerciseDialog({open,mode,plans,currentKeys,initial,onOpenChange,onSubmit}:Props){
  const presets=useMemo(()=>{const map=new Map<string,Exercise>();for(const plan of plans)for(const exercise of plan.exercises)map.set(exercise.key,exercise);return [...map.values()]},[plans]);
  const [draft,setDraft]=useState<Exercise>(()=>initial?{...initial}:blank());
  useEffect(()=>{if(open)setDraft(initial?{...initial}:blank())},[open,initial]);
  function choose(key:string){const preset=presets.find(item=>item.key===key);if(preset)setDraft({...preset})}
  const duplicate=currentKeys.includes(draft.key)&&draft.key!==initial?.key;
  const valid=draft.name.trim().length>0&&draft.setCount>=1&&draft.setCount<=20&&!duplicate;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
    <DialogHeader><DialogTitle>{mode==="add"?"오늘 운동 추가":"오늘 운동 변경"}</DialogTitle><DialogDescription>현재 기록에만 적용됩니다. 루틴 프리셋은 바뀌지 않습니다.</DialogDescription></DialogHeader>
    <div className="space-y-4">
      <label className="editor-field">프리셋에서 선택<select value={presets.some(item=>item.key===draft.key)?draft.key:""} onChange={e=>choose(e.target.value)}><option value="">직접 입력</option>{presets.map(item=><option key={item.key} value={item.key} disabled={currentKeys.includes(item.key)&&item.key!==initial?.key}>{item.name}{item.equipment?` · ${item.equipment}`:""}</option>)}</select></label>
      <div className="editor-grid">
        <label className="editor-field">운동 이름<Input autoFocus maxLength={80} value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label>
        <label className="editor-field">기록 방식<select value={draft.type} onChange={e=>setDraft({...draft,type:e.target.value as Exercise["type"]})}>{Object.entries(kinds).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
        <label className="editor-field">기구 <small>선택</small><Input list="workout-equipment-options" maxLength={60} value={draft.equipment??""} onChange={e=>setDraft({...draft,equipment:e.target.value})}/></label>
        <label className="editor-field">운동 변형 <small>선택</small><Input maxLength={80} value={draft.variation??""} onChange={e=>setDraft({...draft,variation:e.target.value})}/></label>
        <label className="editor-field">세트 수<Input type="number" min={1} max={20} value={draft.setCount} onChange={e=>setDraft({...draft,setCount:Number(e.target.value)})}/></label>
        {(draft.type==="weight"||draft.type==="bodyweight")&&<label className="editor-field">목표 반복 <small>선택</small><Input maxLength={40} placeholder="예: 8~12" value={draft.targetReps??""} onChange={e=>setDraft({...draft,targetReps:e.target.value})}/></label>}
      </div>
      <label className="editor-field">메모 <small>선택</small><Input maxLength={300} value={draft.notes??""} onChange={e=>setDraft({...draft,notes:e.target.value})}/></label>
      {duplicate&&<p role="alert" className="text-sm text-destructive">이미 오늘 목록에 있는 운동입니다.</p>}
    </div>
    <DialogFooter><Button variant="ghost" onClick={()=>onOpenChange(false)}>취소</Button><Button disabled={!valid} onClick={()=>onSubmit({...draft,name:draft.name.trim()})}>{mode==="add"?"운동 추가":"변경 적용"}</Button></DialogFooter>
    <datalist id="workout-equipment-options">{["바벨","덤벨","케틀벨","케이블","스미스 머신","머신","밴드","맨몸","러닝머신","사이클"].map(x=><option key={x} value={x}/>)}</datalist>
  </DialogContent></Dialog>
}
