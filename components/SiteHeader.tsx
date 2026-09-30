import { CalendarDays, Camera, ChartNoAxesCombined, Dumbbell, NotebookPen, Wrench } from "lucide-react";
const navigation = [
  { key: "Workout", label: "운동", href: "/workout", Icon: Dumbbell },
  { key: "Photo", label: "사진", href: "/photo", Icon: Camera },
  { key: "Invest", label: "투자", href: "/invest", Icon: ChartNoAxesCombined },
  { key: "Journal", label: "저널", href: "/journal", Icon: NotebookPen },
  { key: "Timeline", label: "캘린더", href: "/timeline", Icon: CalendarDays },
  { key: "Tools", label: "도구", href: "/tools", Icon: Wrench },
];
export function SiteHeader({ active }: { active?: string }) {
  return <nav className="workspace-nav" aria-label="주요 메뉴">{navigation.map(({ key, label, href, Icon }) => <a aria-current={active === key ? "page" : undefined} href={href} key={key}><Icon size={17} strokeWidth={1.7}/><span>{label}</span></a>)}</nav>;
}
