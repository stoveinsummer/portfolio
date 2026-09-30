"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme storageKey="juhwan-theme" disableTransitionOnChange>{children}</ThemeProvider>;
}

export function ThemeControl() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!resolvedTheme) return;
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => meta.setAttribute("content", resolvedTheme === "dark" ? "#15171b" : "#f7f8fa"));
  }, [resolvedTheme]);
  const selected = mounted ? theme ?? "system" : "system";
  const Icon = selected === "dark" ? Moon : selected === "light" ? Sun : Monitor;
  const label = selected === "dark" ? "다크 모드" : selected === "light" ? "라이트 모드" : "시스템 설정";
  return <DropdownMenu><DropdownMenuTrigger asChild><button type="button" className="theme-control" aria-label={`테마 변경, 현재 ${label}`} title={`테마 변경 · ${label}`}><Icon size={20}/></button></DropdownMenuTrigger><DropdownMenuContent align="end" sideOffset={8} className="min-w-44"><DropdownMenuLabel>화면 모드</DropdownMenuLabel><DropdownMenuRadioGroup value={selected} onValueChange={setTheme}>
    <DropdownMenuRadioItem value="light" className="min-h-11 gap-2"><Sun size={16}/>라이트 모드</DropdownMenuRadioItem>
    <DropdownMenuRadioItem value="dark" className="min-h-11 gap-2"><Moon size={16}/>다크 모드</DropdownMenuRadioItem>
    <DropdownMenuRadioItem value="system" className="min-h-11 gap-2"><Monitor size={16}/>시스템 설정</DropdownMenuRadioItem>
  </DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenu>;
}
