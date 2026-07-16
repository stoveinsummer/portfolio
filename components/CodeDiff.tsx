"use client";

import { useMemo, useState } from "react";

type DiffRow = {
  left: string | null;
  right: string | null;
  leftNumber: number | null;
  rightNumber: number | null;
  type: "same" | "removed" | "added" | "changed";
};

const originalSample = `function greet(name) {
  const message = "Hello, " + name;
  console.log(message);
  return true;
}`;

const changedSample = `function greet(name = "developer") {
  const message = \`Hello, \${name}!\`;
  console.info(message);
  return message;
}`;

function buildDiff(leftText: string, rightText: string): DiffRow[] {
  const left = leftText.replace(/\r\n/g, "\n").split("\n");
  const right = rightText.replace(/\r\n/g, "\n").split("\n");
  const table = Array.from({ length: left.length + 1 }, () => new Uint32Array(right.length + 1));

  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      table[i][j] = left[i] === right[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }

  const raw: DiffRow[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length || j < right.length) {
    if (i < left.length && j < right.length && left[i] === right[j]) {
      raw.push({ left: left[i], right: right[j], leftNumber: i + 1, rightNumber: j + 1, type: "same" });
      i += 1;
      j += 1;
    } else if (j < right.length && (i === left.length || table[i][j + 1] >= table[i + 1][j])) {
      raw.push({ left: null, right: right[j], leftNumber: null, rightNumber: j + 1, type: "added" });
      j += 1;
    } else {
      raw.push({ left: left[i], right: null, leftNumber: i + 1, rightNumber: null, type: "removed" });
      i += 1;
    }
  }

  const rows: DiffRow[] = [];
  for (let index = 0; index < raw.length; index += 1) {
    const current = raw[index];
    const next = raw[index + 1];
    if (current.type === "removed" && next?.type === "added") {
      rows.push({ ...current, right: next.right, rightNumber: next.rightNumber, type: "changed" });
      index += 1;
    } else if (current.type === "added" && next?.type === "removed") {
      rows.push({ ...current, left: next.left, leftNumber: next.leftNumber, type: "changed" });
      index += 1;
    } else {
      rows.push(current);
    }
  }
  return rows;
}

export function CodeDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [compared, setCompared] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [swapCount, setSwapCount] = useState(0);

  const normalizedLeft = ignoreWhitespace ? left.split("\n").map((line) => line.trim()).join("\n") : left;
  const normalizedRight = ignoreWhitespace ? right.split("\n").map((line) => line.trim()).join("\n") : right;
  const rows = useMemo(() => compared ? buildDiff(normalizedLeft, normalizedRight) : [], [compared, normalizedLeft, normalizedRight, swapCount]);
  const stats = rows.reduce((result, row) => {
    if (row.type !== "same") result[row.type] += 1;
    return result;
  }, { added: 0, removed: 0, changed: 0 });

  const compare = () => setCompared(true);
  const clear = () => { setLeft(""); setRight(""); setCompared(false); };
  const swap = () => { setLeft(right); setRight(left); setSwapCount((value) => value + 1); };
  const sample = () => { setLeft(originalSample); setRight(changedSample); setCompared(true); };

  return (
    <section className="diff-tool" aria-label="코드 비교기">
      <div className="diff-toolbar">
        <label><input type="checkbox" checked={ignoreWhitespace} onChange={(event) => setIgnoreWhitespace(event.target.checked)} /> 앞뒤 공백 무시</label>
        <button onClick={sample} type="button">예시 불러오기</button>
        <button onClick={swap} type="button">좌우 바꾸기 ⇄</button>
        <button onClick={clear} type="button">모두 지우기</button>
      </div>
      <div className="diff-inputs">
        <div className="diff-input-pane"><div><label htmlFor="diff-original">Original</label><span>{left.split("\n").length} lines</span></div><textarea id="diff-original" value={left} onChange={(event) => { setLeft(event.target.value); setCompared(false); }} placeholder="원본 코드를 붙여넣으세요." spellCheck={false} /></div>
        <div className="diff-input-pane"><div><label htmlFor="diff-changed">Changed</label><span>{right.split("\n").length} lines</span></div><textarea id="diff-changed" value={right} onChange={(event) => { setRight(event.target.value); setCompared(false); }} placeholder="비교할 코드를 붙여넣으세요." spellCheck={false} /></div>
      </div>
      <button className="diff-submit" onClick={compare} disabled={!left && !right} type="button">차이 비교하기</button>
      {compared && <div className="diff-result">
        <div className="diff-summary"><strong>{stats.changed + stats.added + stats.removed} differences</strong><span className="changed">~ {stats.changed} changed</span><span className="added">+ {stats.added} added</span><span className="removed">− {stats.removed} removed</span></div>
        <div className="diff-table" role="table" aria-label="코드 비교 결과">
          <div className="diff-table-head" role="row"><span>Original</span><span>Changed</span></div>
          {rows.map((row, index) => <div className={`diff-row ${row.type}`} role="row" key={`${index}-${row.leftNumber}-${row.rightNumber}`}><div role="cell"><i>{row.leftNumber ?? ""}</i><b>{row.type === "added" ? "" : row.type === "same" ? " " : "−"}</b><code>{row.left ?? ""}</code></div><div role="cell"><i>{row.rightNumber ?? ""}</i><b>{row.type === "removed" ? "" : row.type === "same" ? " " : "+"}</b><code>{row.right ?? ""}</code></div></div>)}
        </div>
      </div>}
      <p className="diff-privacy">입력한 코드는 이 브라우저 안에서만 비교되며 서버로 전송되지 않습니다.</p>
    </section>
  );
}
