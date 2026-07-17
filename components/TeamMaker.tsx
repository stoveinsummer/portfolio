"use client";

import { useMemo, useState } from "react";

type DivideMode = "team-count" | "team-size";

const sampleNames = "주환\n민준\n서연\n지우\n도윤\n하린\n현우\n수빈\n예준\n유나\n건우\n채원";

function parseNames(value: string) {
  return value.split(/[\n,]/).map((name) => name.trim()).filter(Boolean);
}

function secureShuffle<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    const target = random[0] % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function TeamMaker() {
  const [namesText, setNamesText] = useState("");
  const [mode, setMode] = useState<DivideMode>("team-count");
  const [amount, setAmount] = useState("3");
  const [teams, setTeams] = useState<string[][]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const names = useMemo(() => parseNames(namesText), [namesText]);

  const makeTeams = () => {
    const requested = Math.max(1, Math.floor(Number(amount) || 1));
    if (names.length < 2) {
      setError("두 명 이상의 이름을 입력해 주세요.");
      setTeams([]);
      return;
    }
    const teamCount = mode === "team-count" ? Math.min(requested, names.length) : Math.ceil(names.length / requested);
    const nextTeams = Array.from({ length: teamCount }, () => [] as string[]);
    secureShuffle(names).forEach((name, index) => nextTeams[index % teamCount].push(name));
    setTeams(nextTeams);
    setError("");
    setCopied(false);
  };

  const clear = () => {
    setNamesText("");
    setTeams([]);
    setError("");
    setCopied(false);
  };

  const copy = async () => {
    if (!teams.length) return;
    const text = teams.map((team, index) => `TEAM ${String(index + 1).padStart(2, "0")}\n${team.map((name) => `- ${name}`).join("\n")}`).join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const loadSample = () => {
    setNamesText(sampleNames);
    setTeams([]);
    setError("");
  };

  return (
    <section className="team-tool" aria-label="랜덤 팀 편성기">
      <div className="team-layout">
        <div className="team-setup">
          <div className="team-setup-head"><div><p className="eyebrow">Members</p><h2>이름 입력</h2></div><span>{names.length} people</span></div>
          <textarea value={namesText} onChange={(event) => { setNamesText(event.target.value); setTeams([]); setError(""); }} placeholder={'이름을 한 줄에 한 명씩 입력하세요.\n쉼표로 구분해도 됩니다.'} spellCheck={false} aria-label="팀원 이름 목록" />
          <div className="team-text-actions"><button onClick={loadSample} type="button">예시 불러오기</button><button onClick={clear} type="button">모두 지우기</button></div>
        </div>
        <div className="team-options">
          <p className="eyebrow">Divide options</p>
          <h2>어떻게 나눌까요?</h2>
          <div className="team-mode" role="group" aria-label="팀 나누기 방식"><button className={mode === "team-count" ? "active" : ""} onClick={() => { setMode("team-count"); setTeams([]); }} type="button"><span>팀 개수</span><em>몇 개의 팀을 만들지 선택</em></button><button className={mode === "team-size" ? "active" : ""} onClick={() => { setMode("team-size"); setTeams([]); }} type="button"><span>팀당 인원</span><em>한 팀의 최대 인원 선택</em></button></div>
          <label><span>{mode === "team-count" ? "만들 팀 개수" : "팀당 최대 인원"}</span><div><input type="number" min="1" max="100" value={amount} onChange={(event) => { setAmount(event.target.value); setTeams([]); }} /><em>{mode === "team-count" ? "Teams" : "People"}</em></div></label>
          <div className="team-preview"><span>예상 결과</span><strong>{names.length ? mode === "team-count" ? `${Math.min(Math.max(Number(amount) || 1, 1), names.length)}팀` : `${Math.ceil(names.length / Math.max(Number(amount) || 1, 1))}팀` : "—"}</strong><small>인원 차이는 최대 1명으로 균등하게 배정됩니다.</small></div>
          <button className="team-submit" onClick={makeTeams} type="button">무작위 팀 만들기</button>
        </div>
      </div>
      {error && <div className="team-error" role="alert">{error}</div>}
      {teams.length > 0 && <div className="team-results"><div className="team-results-head"><div><p className="eyebrow">Random result</p><h2>{teams.length} teams ready.</h2></div><div><button onClick={makeTeams} type="button">다시 섞기 ↻</button><button onClick={copy} type="button">{copied ? "복사됨 ✓" : "결과 복사"}</button></div></div><div className="team-grid">{teams.map((team, teamIndex) => <article key={`${teamIndex}-${team.join("-")}`}><span>Team {String(teamIndex + 1).padStart(2, "0")}</span><strong>{team.length} people</strong><ol>{team.map((name, index) => <li key={`${name}-${index}`}><i>{String(index + 1).padStart(2, "0")}</i>{name}</li>)}</ol></article>)}</div></div>}
      <p className="team-privacy">입력한 이름과 편성 결과는 서버로 전송하거나 저장하지 않습니다.</p>
    </section>
  );
}
