import type { JournalEntry } from "@/types/content";
import { prepareJournals } from "@/data/archive";

export const journals: JournalEntry[] = prepareJournals([
  {
    id: "building-my-personal-archive",
    title: "포트폴리오가 아카이브가 되기까지",
    date: "2026-07-17",
    summary: "개발자 포트폴리오로 시작한 사이트에 사진, 투자 기록과 직접 만든 도구가 쌓이기 시작했다.",
    content: [
      "처음에는 개발자로서 나를 보여주는 개인 포트폴리오를 만들 생각이었다. 사진도 함께 올리고 싶어서 갤러리를 만들었고, 촬영한 사진을 정리해 워터마크와 분류를 더했다.",
      "그러다 매월 포트폴리오 비중과 투자 의견을 기록하는 페이지를 만들었다. 금액은 공개하지 않고 비중과 상대적인 변화만 남기기로 했다. 그달의 국내와 미국 증시 뉴스도 한 줄씩 정리할 예정이다.",
      "개발할 때 실제로 필요한 JSON 정렬기, 코드 비교기, 복리 계산기와 랜덤 팀 편성기도 하나씩 추가했다. 모든 도구는 서버 없이 브라우저 안에서만 동작한다.",
      "생각을 따라 기능을 더하다 보니 이곳은 결과물만 보여주는 포트폴리오보다, 내가 보고 만들고 판단한 것을 시간순으로 쌓는 개인 아카이브에 가까워졌다. 앞으로도 미래의 내가 다시 보고 싶은 기록을 기준으로 천천히 채워가려고 한다.",
    ],
    category: "프로젝트 기록",
    tags: ["개인사이트", "아카이브", "개발"],
    relatedTools: ["json-formatter", "code-diff", "compound-calculator", "team-maker"],
  },
]);
