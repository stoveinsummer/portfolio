import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "JUHWAN — Developer & Photographer",
    template: "%s — JUHWAN",
  },
  description: "코드로 만들고 카메라로 기록하는 개발자 주환의 개인 작업 아카이브.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
