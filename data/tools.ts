import type { ToolItem } from "@/types/content";

export const tools: ToolItem[] = [
  { id: "json-formatter", name: "JSON 정렬기", description: "붙여넣은 JSON을 검사하고 읽기 쉽게 정리하는 도구", path: "/tools/json-formatter", status: "available" },
  { id: "code-diff", name: "코드 비교기", description: "두 코드의 추가·삭제·변경된 줄을 나란히 비교하는 도구", path: "/tools/code-diff", status: "available" },
  { id: "date-calculator", name: "날짜 계산기", description: "두 날짜 사이의 기간과 기준일을 계산하는 도구", path: "#", status: "planned" },
  { id: "compound-calculator", name: "복리 계산기", description: "기간과 수익률에 따른 복리 변화를 비교하는 도구", path: "#", status: "planned" },
  { id: "image-info", name: "이미지 정보 보기", description: "이미지 크기와 기본 정보를 브라우저에서 확인하는 도구", path: "#", status: "planned" },
];
