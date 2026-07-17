import type { InvestmentRecord, JournalEntry, PhotoItem, ToolItem } from "@/types/content";

const datePattern = /^\d{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?$/;

function requireUniqueIds(items: { id: string }[], label: string) {
  const ids = new Set<string>();
  for (const item of items) {
    if (!item.id.trim()) throw new Error(`${label}: id가 비어 있습니다.`);
    if (ids.has(item.id)) throw new Error(`${label}: 중복 id '${item.id}'가 있습니다.`);
    ids.add(item.id);
  }
}

function requireText(value: string, label: string) {
  if (!value.trim()) throw new Error(`${label}이(가) 비어 있습니다.`);
}

export function preparePhotos(items: PhotoItem[]) {
  requireUniqueIds(items, "photos");
  items.forEach((item) => {
    if (!datePattern.test(item.takenAt)) throw new Error(`photos/${item.id}: 촬영일 형식이 올바르지 않습니다.`);
    requireText(item.title, `photos/${item.id}: 제목`);
    requireText(item.description, `photos/${item.id}: 설명`);
    requireText(item.imageUrl, `photos/${item.id}: 이미지 경로`);
  });
  return [...items].sort((a, b) => b.takenAt.localeCompare(a.takenAt));
}

export function prepareInvestments(items: InvestmentRecord[]) {
  requireUniqueIds(items, "investments");
  items.forEach((item) => {
    if (!datePattern.test(item.date)) throw new Error(`investments/${item.id}: 날짜 형식이 올바르지 않습니다.`);
    requireText(item.title, `investments/${item.id}: 제목`);
    requireText(item.review, `investments/${item.id}: 월 소감`);
    const total = item.portfolio.reduce((sum, holding) => sum + holding.weight, 0);
    if (Math.abs(total - 100) > 0.001) throw new Error(`investments/${item.id}: 비중 합계가 ${total}%입니다.`);
  });
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

export function prepareJournals(items: JournalEntry[]) {
  requireUniqueIds(items, "journals");
  items.forEach((item) => {
    if (!datePattern.test(item.date)) throw new Error(`journals/${item.id}: 날짜 형식이 올바르지 않습니다.`);
    requireText(item.title, `journals/${item.id}: 제목`);
    requireText(item.summary, `journals/${item.id}: 요약`);
    if (!item.content.length || item.content.some((paragraph) => !paragraph.trim())) throw new Error(`journals/${item.id}: 본문이 비어 있습니다.`);
  });
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

export function prepareTools(items: ToolItem[]) {
  requireUniqueIds(items, "tools");
  items.forEach((item) => {
    requireText(item.name, `tools/${item.id}: 이름`);
    requireText(item.description, `tools/${item.id}: 설명`);
    requireText(item.reason, `tools/${item.id}: 만든 이유`);
    requireText(item.coreAction, `tools/${item.id}: 핵심 동작`);
  });
  return items;
}
