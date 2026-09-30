import type { ChatGPTUser } from "@/app/chatgpt-auth";
export function isOwner(user:ChatGPTUser|null){return user?.email.toLowerCase()==="wnlth96@gmail.com";}
