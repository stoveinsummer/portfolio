"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { kinds, type Exercise, type Plan } from "@/lib/workout";

type Props = { plans: Plan[]; onChange: (plans: Plan[]) => void; onSave: () => void; onReset: () => void; saving: boolean; changed: boolean; disabled: boolean };
const freshExercise = (): Exercise => ({ key: crypto.randomUUID(), name: "", type: "weight", setCount: 3, equipment: "", variation: "", notes: "", targetReps: "" });

export function PlanEditor({ plans, onChange, onSave, onReset, saving, changed, disabled }: Props) {
  const [active, setActive] = useState(plans[0]?.key);
  const plan = plans.find(p => p.key === active) ?? plans[0];
  const update = (next: Plan) => onChange(plans.map(p => p.key === plan.key ? next : p));
  const updateExercise = (key: string, patch: Partial<Exercise>) => update({ ...plan, exercises: plan.exercises.map(e => e.key === key ? { ...e, ...patch } : e) });
  function move(index: number, by: number) {
    const exercises = [...plan.exercises];
    [exercises[index], exercises[index + by]] = [exercises[index + by], exercises[index]];
    update({ ...plan, exercises });
  }
  return <fieldset disabled={disabled || saving} className="plan-editor">
    <div className="workspace-intro"><div><h2>내 운동 목록</h2><p>기구와 방식에 맞춰 종목을 만들고 루틴으로 묶어보세요.</p></div><span>{plans.length}개 루틴</span></div>
    <div className="plan-layout">
      <aside className="plan-sidebar" aria-label="편집할 루틴">
        {plans.map(p => <button type="button" key={p.key} aria-pressed={p.key === plan.key} onClick={() => setActive(p.key)}><span>{p.name || "이름 없는 루틴"}</span><small>{p.exercises.length}개 종목</small></button>)}
        <Button variant="outline" disabled={plans.length >= 20} onClick={() => { const p = { key: crypto.randomUUID(), name: "새 루틴", exercises: [] }; onChange([...plans, p]); setActive(p.key); }}><Plus size={16} />루틴 추가</Button>
      </aside>
      <section className="plan-content">
        <div className="plan-heading"><label className="editor-field">루틴 이름<Input value={plan.name} maxLength={60} onChange={e => update({ ...plan, name: e.target.value })} /></label><div className="exercise-actions">
          <Button variant="ghost" disabled={plans.length >= 20} onClick={() => { const p = { ...plan, key: crypto.randomUUID(), name: `${plan.name.slice(0, 55)} 복사`, exercises: plan.exercises.map(e => ({ ...e, key: crypto.randomUUID() })) }; onChange([...plans, p]); setActive(p.key); }}><Copy size={16} />복제</Button>
          <Button variant="ghost" disabled={plans.length <= 1} title={plans.length <= 1 ? "루틴은 하나 이상 필요합니다. 종목은 모두 삭제할 수 있습니다." : undefined} onClick={() => { if (window.confirm(`‘${plan.name}’ 루틴을 삭제할까요? 저장된 운동 기록은 남습니다.`)) onChange(plans.filter(p => p.key !== plan.key)); }}><Trash2 size={16} />삭제</Button>
        </div></div>
        {plan.exercises.length === 0 && <div className="exercise-empty"><h3>첫 종목을 추가해 보세요</h3><p>예: 벤치 프레스 / 덤벨 / 인클라인</p></div>}
        {plan.exercises.map((ex, i) => <article className="exercise-editor" key={ex.key}>
          <div className="exercise-heading"><span className="exercise-number">{String(i + 1).padStart(2, "0")}</span><strong>{ex.name || "새 운동"}</strong><div className="exercise-actions">
            <Button variant="ghost" size="icon" aria-label={`${ex.name || "새 운동"} 위로`} disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={16} /></Button>
            <Button variant="ghost" size="icon" aria-label={`${ex.name || "새 운동"} 아래로`} disabled={i === plan.exercises.length - 1} onClick={() => move(i, 1)}><ArrowDown size={16} /></Button>
            <Button variant="ghost" size="icon" aria-label={`${ex.name || "새 운동"} 복제`} disabled={plan.exercises.length >= 30} onClick={() => { const exercises = [...plan.exercises]; exercises.splice(i + 1, 0, { ...ex, key: crypto.randomUUID(), name: `${ex.name.slice(0, 75)} 복사` }); update({ ...plan, exercises }); }}><Copy size={16} /></Button>
            <Button variant="ghost" size="icon" aria-label={`${ex.name || "새 운동"} 종목 삭제`} onClick={() => { if (window.confirm(`‘${ex.name || "새 운동"}’을 목록에서 삭제할까요? 저장된 운동 기록은 남습니다.`)) update({ ...plan, exercises: plan.exercises.filter(e => e.key !== ex.key) }); }}><Trash2 size={16} /></Button>
          </div></div>
          <div className="editor-grid">
            <label className="editor-field">종목명<Input placeholder="예: 벤치 프레스" maxLength={80} value={ex.name} onChange={e => updateExercise(ex.key, { name: e.target.value })} /></label>
            <label className="editor-field">기구 <small>선택 · 직접 입력 가능</small><Input list="equipment-options" placeholder="예: 덤벨, 케이블, 스미스 머신" maxLength={60} value={ex.equipment ?? ""} onChange={e => updateExercise(ex.key, { equipment: e.target.value })} /></label>
            <label className="editor-field">운동 변형 <small>선택</small><Input placeholder="예: 인클라인, 원암, 와이드 그립" maxLength={80} value={ex.variation ?? ""} onChange={e => updateExercise(ex.key, { variation: e.target.value })} /></label>
            <div className="exercise-format"><label className="editor-field">기록 방식<select value={ex.type} onChange={e => updateExercise(ex.key, { type: e.target.value as Exercise["type"] })}>{Object.entries(kinds).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label><label className="editor-field">기본 세트<Input type="number" min={1} max={20} value={ex.setCount || ""} onChange={e => updateExercise(ex.key, { setCount: Number(e.target.value) })} /></label></div>
          </div>
          {(ex.type === "weight" || ex.type === "bodyweight") && <label className="editor-field exercise-note">목표 반복 <small>선택 · 실제 수행한 횟수는 오늘 탭에 기록</small><Input placeholder="예: 8~12" maxLength={40} value={ex.targetReps ?? ""} onChange={e => updateExercise(ex.key, { targetReps: e.target.value })} /></label>}
          <label className="editor-field exercise-note">메모 <small>선택</small><Input placeholder="예: 벤치 각도 30도, 좌석 높이 4칸" maxLength={300} value={ex.notes ?? ""} onChange={e => updateExercise(ex.key, { notes: e.target.value })} /></label>
        </article>)}
        <Button className="exercise-add" variant="outline" disabled={plan.exercises.length >= 30} onClick={() => update({ ...plan, exercises: [...plan.exercises, freshExercise()] })}><Plus size={18} />운동 종목 추가</Button>
      </section>
    </div>
    <datalist id="equipment-options">{["바벨", "덤벨", "케틀벨", "케이블", "스미스 머신", "머신", "밴드", "맨몸", "러닝머신", "사이클"].map(x => <option key={x} value={x} />)}</datalist>
    <div className="plan-savebar"><p role="status">{changed ? "저장하지 않은 변경사항이 있어요." : "저장된 루틴입니다."}</p><div><Button variant="ghost" disabled={!changed} onClick={() => { if (window.confirm("저장하지 않은 변경을 되돌릴까요?")) onReset(); }}>되돌리기</Button><Button disabled={!changed || saving} onClick={onSave}>{saving ? "저장 중…" : "변경사항 저장"}</Button></div></div>
  </fieldset>;
}
