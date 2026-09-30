import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import ServiceWorkerRegistration from "./service-worker-registration";
import "./portfolio.css";
import "./globals.css";
import { SiteThemeProvider, ThemeControl } from "@/components/ThemeControls";
import { Home, Settings2 } from "lucide-react";

export const metadata: Metadata = {
  title: "JUHWAN",
  description: "사진, 저널, 투자 기록과 개인 도구를 한곳에서.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/app-icon.svg" },
};

export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#fbfcfe" }, { media: "(prefers-color-scheme: dark)", color: "#16191f" }], colorScheme: "light dark", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko" suppressHydrationWarning><body className="antialiased"><SiteThemeProvider><header className="hub-header"><a className="hub-wordmark" href="/">JUHWAN</a><nav className="hub-account"><a href="/" aria-label="도구 홈"><Home size={20}/></a><a href="/settings" aria-label="설정"><Settings2 size={20}/></a><ThemeControl/></nav></header>{children}<Toaster position="top-center" richColors /><ServiceWorkerRegistration /></SiteThemeProvider></body></html>;
}
