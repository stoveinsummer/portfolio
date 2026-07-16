# JUHWAN — Personal Digital Workshop

사진, 투자 판단, 저널과 개인용 도구를 정적 파일로 관리하는 개인 기록형 웹사이트입니다.

- 공개 사이트: https://stoveinsummer.github.io/portfolio/
- 호스팅: GitHub Pages
- 구조: Next.js App Router + TypeScript + 일반 CSS
- 데이터: `data/*.ts`
- 서버·DB·로그인·외부 API 없음

## 로컬 실행

Node.js 22와 pnpm을 사용합니다.

```bash
pnpm install
pnpm dev
```

정적 내보내기 검증:

```bash
pnpm build
```

빌드 결과는 `out/`에 생성됩니다.

## 파일 구조

```text
app/
  page.tsx              홈
  photo/                사진 목록·상세
  invest/               투자 기록 목록·상세
  journal/              저널 목록·상세
  tools/                도구 목록
  about/                사이트 소개
components/             공통 화면과 차트·갤러리
data/                   직접 수정하는 정적 콘텐츠
types/                  콘텐츠 타입
public/photos/
  web/                   게시용 WebP 사진
.github/workflows/       GitHub Pages 자동 배포
```

## 사진 추가

1. 원본 사진은 `public/photos/`에 보관합니다. JPG 원본은 Git에 올라가지 않도록 설정되어 있습니다.
2. 긴 변 약 2,200px의 WebP 게시용 파일을 만들고 `public/photos/web/`에 넣습니다.
3. `data/photos.ts` 배열에 사진 정보를 추가합니다.
4. `id`는 영문 소문자와 하이픈만 사용하고 중복되지 않게 작성합니다.
5. 커밋 후 `main` 브랜치에 푸시하면 자동으로 배포됩니다.

## 투자 기록 추가

`data/investments.ts`의 `investments` 배열에 월별 기록을 추가합니다.

- 총 투자금·평가금액·수량·매수금액은 기록하지 않습니다.
- `weight` 합계는 100이 되게 작성합니다.
- 공개 가능한 비중, 수익률, 판단과 복기만 입력합니다.
- 상세 페이지는 `id`를 기준으로 빌드 시 자동 생성됩니다.

## 저널 추가

`data/journals.ts`에 항목을 추가합니다. `content`는 문단별 문자열 배열입니다. 상세 페이지는 빌드 시 자동 생성됩니다.

## 새 도구 추가

1. `data/tools.ts`에 도구 카드 정보를 먼저 추가합니다.
2. 준비 중에는 `status: "planned"`를 사용합니다.
3. 실제 구현 시 `app/tools/<도구-id>/page.tsx`를 만들고 `status: "available"`로 변경합니다.
4. 브라우저 안에서만 처리하고 입력값을 외부 서버로 전송하지 않는 도구를 우선합니다.

## GitHub Pages 배포

`.github/workflows/deploy-pages.yml`이 `main` 브랜치 푸시를 감지해 정적 사이트를 빌드하고 배포합니다. 저장소 설정의 Pages 배포 소스는 `GitHub Actions`여야 합니다.

저장소 하위 경로 `/portfolio`는 `next.config.ts`에서 CI 빌드일 때 자동 적용됩니다. 모든 상세 경로는 정적으로 생성되고 `trailingSlash`를 사용하므로 GitHub Pages에서 직접 열거나 새로고침해도 동작합니다.

## 나중에 백엔드가 필요해질 때

현재 정적 데이터 파일은 유지하면서 데이터 접근 부분만 API 또는 데이터베이스 호출로 교체할 수 있습니다. 로그인, 비공개 기록, 사진 직접 업로드, 자동 투자 데이터 수집이 실제로 필요해진 시점에 별도 2차 프로젝트로 서버 구조를 도입합니다.
