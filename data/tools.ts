import type { ToolItem } from "@/types/content";
import { prepareTools } from "@/data/archive";

export const tools: ToolItem[] = prepareTools([
  { id: "json-formatter", name: "JSON 정렬기", description: "붙여넣은 JSON을 검사하고 읽기 쉽게 정리하는 도구", path: "/tools/json-formatter", status: "available", reason: "API 응답이나 설정 파일을 빠르게 읽고 문법 오류를 확인하려고 만들었습니다.", coreAction: "JSON 검증 · 들여쓰기 정렬 · 한 줄 압축", dataHandling: "입력한 JSON은 브라우저 안에서만 처리하며 저장하거나 전송하지 않습니다." },
  { id: "code-diff", name: "코드 비교기", description: "두 코드의 추가·삭제·변경된 줄을 나란히 비교하는 도구", path: "/tools/code-diff", status: "available", reason: "작은 코드 조각의 변경점을 별도 프로그램 없이 바로 확인하려고 만들었습니다.", coreAction: "줄 단위 비교 · 공백 무시 · 좌우 교환", dataHandling: "입력한 코드는 브라우저 메모리에서만 비교하며 저장하거나 전송하지 않습니다." },
  { id: "compound-calculator", name: "복리 계산기", description: "초기금액과 월 적립금의 복리 성장 과정을 계산하는 도구", path: "/tools/compound-calculator", status: "available", reason: "정기 적립과 시간이 결과에 만드는 차이를 직관적으로 확인하려고 만들었습니다.", coreAction: "월 복리 계산 · 연도별 추이 · 원금과 수익 분리", dataHandling: "입력한 금액과 수익률은 브라우저 안에서만 계산하며 저장하거나 전송하지 않습니다." },
  { id: "team-maker", name: "랜덤 팀 편성기", description: "이름을 입력해 원하는 팀 수나 인원으로 무작위 편성하는 도구", path: "/tools/team-maker", status: "available", reason: "모임에서 인원 차이 없이 팀을 빠르고 공정하게 나누려고 만들었습니다.", coreAction: "안전한 무작위 섞기 · 균등 배정 · 결과 복사", dataHandling: "입력한 이름과 편성 결과는 브라우저 안에서만 사용하며 저장하거나 전송하지 않습니다." },
]);
