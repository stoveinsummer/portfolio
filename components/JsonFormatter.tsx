"use client";

import { useState } from "react";

const sample = '{"name":"JUHWAN","interests":["development","photography"],"active":true}';

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const transform = (compact = false, value = input) => {
    if (!value.trim()) {
      setOutput("");
      setError("JSON을 입력해 주세요.");
      return;
    }
    try {
      const parsed: unknown = JSON.parse(value);
      setOutput(JSON.stringify(parsed, null, compact ? 0 : indent));
      setError("");
      setCopied(false);
    } catch (reason) {
      setOutput("");
      setError(reason instanceof SyntaxError ? reason.message : "올바른 JSON인지 확인해 주세요.");
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  const loadSample = () => {
    setInput(sample);
    transform(false, sample);
  };

  return (
    <section className="json-tool" aria-label="JSON 정렬기">
      <div className="json-toolbar">
        <div className="indent-control">
          <span>Indent</span>
          {[2, 4].map((size) => <button className={indent === size ? "active" : ""} onClick={() => setIndent(size)} key={size} type="button">{size} spaces</button>)}
        </div>
        <button className="text-action" onClick={loadSample} type="button">예시 불러오기</button>
        <button className="text-action" onClick={clear} type="button">모두 지우기</button>
      </div>
      <div className="json-editors">
        <div className="json-pane">
          <div className="json-pane-head"><label htmlFor="json-input">Input</label><span>{input.length.toLocaleString()} chars</span></div>
          <textarea id="json-input" value={input} onChange={(event) => { setInput(event.target.value); setError(""); }} placeholder='{"key":"value"}' spellCheck={false} />
        </div>
        <div className="json-pane output-pane">
          <div className="json-pane-head"><label htmlFor="json-output">Output</label><button onClick={copy} disabled={!output} type="button">{copied ? "복사됨 ✓" : "복사"}</button></div>
          <textarea id="json-output" value={output} readOnly placeholder="정렬된 JSON이 여기에 표시됩니다." spellCheck={false} />
        </div>
      </div>
      <div className={`json-status ${error ? "error" : output ? "valid" : ""}`} aria-live="polite">
        {error ? `Invalid JSON · ${error}` : output ? "Valid JSON · 브라우저 안에서 처리되었습니다." : "입력한 데이터는 서버로 전송되지 않습니다."}
      </div>
      <div className="json-actions">
        <button onClick={() => transform(false)} type="button">정렬하기</button>
        <button onClick={() => transform(true)} type="button">한 줄로 압축</button>
      </div>
    </section>
  );
}
