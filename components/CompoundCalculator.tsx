"use client";

import { useMemo, useState } from "react";

type YearResult = { year: number; principal: number; interest: number; balance: number };

const won = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 });

function safeNumber(value: string, min: number, max: number) {
  const parsed = Number(value.replaceAll(",", ""));
  if (!Number.isFinite(parsed)) return min;
  return Math.min(Math.max(parsed, min), max);
}

function formatCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function CompoundCalculator() {
  const [initial, setInitial] = useState("10,000,000");
  const [monthly, setMonthly] = useState("500,000");
  const [annualRate, setAnnualRate] = useState("7");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const startingAmount = safeNumber(initial, 0, 1_000_000_000_000);
    const monthlyContribution = safeNumber(monthly, 0, 10_000_000_000);
    const rate = safeNumber(annualRate, -99, 100) / 100 / 12;
    const duration = Math.round(safeNumber(years, 1, 50));
    let balance = startingAmount;
    let principal = startingAmount;
    const history: YearResult[] = [];

    for (let month = 1; month <= duration * 12; month += 1) {
      balance *= 1 + rate;
      balance += monthlyContribution;
      principal += monthlyContribution;
      if (month % 12 === 0) history.push({ year: month / 12, principal, interest: balance - principal, balance });
    }
    return { balance, principal, interest: balance - principal, history, duration };
  }, [initial, monthly, annualRate, years]);

  const maxBalance = Math.max(...result.history.map((item) => item.balance), 1);
  const visibleHistory = result.history.length > 20
    ? result.history.filter((item) => item.year === 1 || item.year === result.duration || item.year % 5 === 0)
    : result.history;

  return (
    <section className="compound-tool" aria-label="복리 계산기">
      <div className="compound-layout">
        <div className="compound-inputs">
          <p className="eyebrow">Input</p>
          <label><span>초기 투자금</span><div><input inputMode="numeric" value={initial} onChange={(event) => setInitial(formatCurrencyInput(event.target.value))} aria-label="초기 투자금" /><em>원</em></div></label>
          <label><span>매월 추가 투자금</span><div><input inputMode="numeric" value={monthly} onChange={(event) => setMonthly(formatCurrencyInput(event.target.value))} aria-label="매월 추가 투자금" /><em>원</em></div></label>
          <label><span>예상 연 수익률</span><div><input inputMode="decimal" value={annualRate} onChange={(event) => setAnnualRate(event.target.value)} aria-label="예상 연 수익률" /><em>%</em></div></label>
          <label><span>투자 기간</span><div><input inputMode="numeric" value={years} onChange={(event) => setYears(event.target.value)} aria-label="투자 기간" /><em>년</em></div></label>
          <button type="button" onClick={() => { setInitial("10,000,000"); setMonthly("500,000"); setAnnualRate("7"); setYears("10"); }}>기본값으로 초기화</button>
        </div>
        <div className="compound-result">
          <p className="eyebrow">Estimated result · Monthly compounding</p>
          <span>{result.duration}년 후 예상금액</span>
          <strong>{won.format(result.balance)}</strong>
          <dl><div><dt>총 납입원금</dt><dd>{won.format(result.principal)}</dd></div><div><dt>예상 수익금</dt><dd className={result.interest >= 0 ? "positive" : "negative"}>{result.interest >= 0 ? "+" : ""}{won.format(result.interest)}</dd></div><div><dt>원금 대비</dt><dd>{result.principal ? `${((result.balance / result.principal - 1) * 100).toFixed(1)}%` : "0.0%"}</dd></div></dl>
        </div>
      </div>
      <div className="compound-chart">
        <div className="compound-chart-head"><div><p className="eyebrow">Growth by year</p><h2>시간이 만드는 차이.</h2></div><div className="compound-legend"><span><i className="principal" />납입원금</span><span><i className="interest" />복리수익</span></div></div>
        <div className="compound-bars" role="img" aria-label={`${result.duration}년 동안의 원금과 복리 수익 변화`}>
          {visibleHistory.map((item) => <div className="compound-bar-column" key={item.year}><div className="compound-bar-value">{item.year === result.duration || item.year === 1 ? won.format(item.balance) : ""}</div><div className="compound-bar" style={{ height: `${Math.max((item.balance / maxBalance) * 100, 2)}%` }} title={`${item.year}년 · ${won.format(item.balance)}`}><i className="interest" style={{ height: `${Math.max((item.interest / item.balance) * 100, 0)}%` }} /><i className="principal" style={{ height: `${Math.min((item.principal / item.balance) * 100, 100)}%` }} /></div><span>{item.year}Y</span></div>)}
        </div>
      </div>
      <div className="compound-table-wrap"><table><thead><tr><th>연차</th><th>납입원금</th><th>복리수익</th><th>예상금액</th></tr></thead><tbody>{result.history.map((item) => <tr key={item.year}><td>{item.year}년</td><td>{won.format(item.principal)}</td><td className={item.interest >= 0 ? "positive" : "negative"}>{won.format(item.interest)}</td><td>{won.format(item.balance)}</td></tr>)}</tbody></table></div>
      <p className="compound-note">월말에 추가 투자하고 월 단위로 복리 계산한 단순 예상치입니다. 세금·수수료·물가·수익률 변동은 반영하지 않으며 투자 권유가 아닙니다.</p>
    </section>
  );
}
