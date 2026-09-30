import type {Metadata} from "next";
import {getChatGPTUser} from "@/app/chatgpt-auth";
import {IntegratedTimeline} from "@/components/IntegratedTimeline";
import {SiteHeader} from "@/components/SiteHeader";
import {isOwner} from "@/lib/owner";
import {getIntegratedTimeline} from "@/lib/timeline";

export const dynamic="force-dynamic";
export const metadata:Metadata={title:"캘린더 | JUHWAN"};

export default async function TimelinePage(){
  const user=await getChatGPTUser(),owner=isOwner(user);
  const events=await getIntegratedTimeline(owner&&user?user.userId:null);
  return <main className="timeline-page"><SiteHeader active="Timeline"/><IntegratedTimeline events={events}/></main>;
}
