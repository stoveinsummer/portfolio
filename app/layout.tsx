import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stoveinsummer.github.io"),
  title: {
    default: "JUHWAN — Developer & Photographer",
    template: "%s — JUHWAN",
  },
  description: "코드로 만들고 카메라로 기록하는 개발자 주환의 개인 작업 아카이브.",
  icons: { icon: "/portfolio/favicon.svg" },
  openGraph: { type: "website", locale: "ko_KR", siteName: "JUHWAN", title: "JUHWAN — Developer & Photographer", description: "사진, 투자 판단, 개발 메모와 직접 만든 도구를 쌓아가는 개인 기록 공간.", images: [{ url: "/portfolio/photos/web/sun-rays-after-storm.webp", alt: "구름 사이로 비치는 빛을 촬영한 사진" }] },
  twitter: { card: "summary_large_image", title: "JUHWAN — Developer & Photographer", description: "사진, 투자 판단, 개발 메모와 직접 만든 도구를 쌓아가는 개인 기록 공간.", images: ["/portfolio/photos/web/sun-rays-after-storm.webp"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
