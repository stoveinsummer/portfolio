import {getChatGPTUser} from "./chatgpt-auth";
import {getHomeOrder} from "@/lib/home-store";
import {defaultOrder} from "@/lib/home-order";
import {isOwner} from "@/lib/owner";
import {getHomeDashboard} from "@/lib/home-dashboard";
import {HomeDashboard} from "@/components/HomeDashboard";
export const dynamic="force-dynamic";
import { Dumbbell, Camera, ChartNoAxesCombined, NotebookPen, Blocks, Settings2, CalendarDays } from "lucide-react";
const apps = [{name:"운동",href:"/workout",icon:Dumbbell},{name:"사진",href:"/photo",icon:Camera},{name:"투자 기록",href:"/invest",icon:ChartNoAxesCombined},{name:"저널",href:"/journal",icon:NotebookPen},{name:"캘린더",href:"/timeline",icon:CalendarDays},{name:"도구 모음",href:"/tools",icon:Blocks},{name:"설정",href:"/settings",icon:Settings2}];
export default async function Home(){const u=await getChatGPTUser(),owner=isOwner(u);const [order,dashboard]=await Promise.all([u?getHomeOrder(u.userId):defaultOrder,owner&&u?getHomeDashboard(u.userId):null]);const sorted=order.map(key=>apps.find(a=>a.href==="/"+key)!);return <><main className={`hub-home${dashboard?" hub-home-dashboard":""}`}><section className="home-launcher" aria-label="도구 바로가기">{dashboard&&<h2>메뉴</h2>}<div className="hub-grid">{sorted.map(({name,href,icon:Icon})=><a href={href} key={href} className="hub-app"><span className="hub-icon"><Icon aria-hidden="true"/></span><span>{name}</span></a>)}</div></section>{dashboard&&<HomeDashboard data={dashboard}/>}</main><footer className="hub-footer"><span>초대된 사람들과 함께</span><span>사진 · 기록 · 도구</span></footer></>}
