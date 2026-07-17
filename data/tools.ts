import type { ToolItem } from "@/types/content";

export const tools: ToolItem[] = [
  { id: "json-formatter", name: "JSON 정렬기", description: "붙여넣은 JSON을 검사하고 읽기 쉽게 정리하는 도구", path: "/tools/json-formatter", status: "available" },
  { id: "code-diff", name: "코드 비교기", description: "두 코드의 추가·삭제·변경된 줄을 나란히 비교하는 도구", path: "/tools/code-diff", status: "available" },
  { id: "compound-calculator", name: "복리 계산기", description: "초기금액과 월 적립금의 복리 성장 과정을 계산하는 도구", path: "/tools/compound-calculator", status: "available" },
  { id: "team-maker", name: "랜덤 팀 편성기", description: "이름을 입력해 원하는 팀 수나 인원으로 무작위 편성하는 도구", path: "/tools/team-maker", status: "available" },
];
