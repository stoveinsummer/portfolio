import {getChatGPTUser} from "@/app/chatgpt-auth";
import {getBinding} from "@/db";
import {getHomeOrder} from "@/lib/home-store";
import {orderSchema} from "@/lib/home-order";
export async function GET(){const u=await getChatGPTUser();if(!u)return Response.json({error:"로그인이 필요합니다."},{status:401});try{return Response.json({order:await getHomeOrder(u.userId)},{headers:{"Cache-Control":"private,no-store"}})}catch(e){console.error(e);return Response.json({error:"순서를 불러오지 못했습니다."},{status:500})}}
export async function PUT(req:Request){const u=await getChatGPTUser();if(!u)return Response.json({error:"로그인이 필요합니다."},{status:401});try{const p=orderSchema.safeParse(await req.json());if(!p.success)return Response.json({error:"아이콘 순서를 확인해 주세요."},{status:400});await getBinding().prepare("INSERT INTO home_preferences(user_id,order_json) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET order_json=excluded.order_json").bind(u.userId,JSON.stringify(p.data)).run();return Response.json({saved:true})}catch(e){console.error(e);return Response.json({error:"저장하지 못했습니다."},{status:500})}}
