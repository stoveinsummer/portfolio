import {getBinding} from "@/db";
import {defaultOrder,orderSchema,type AppKey} from "./home-order";
export async function getHomeOrder(userId:string):Promise<AppKey[]>{const row=await getBinding().prepare("SELECT order_json FROM home_preferences WHERE user_id=?").bind(userId).first<{order_json:string}>();if(!row)return [...defaultOrder];try{const saved=JSON.parse(row.order_json) as string[];const merged=[...saved.filter(key=>defaultOrder.includes(key as AppKey)),...defaultOrder.filter(key=>!saved.includes(key))];return orderSchema.parse(merged)}catch{return [...defaultOrder]}}
