import {getChatGPTUser} from "@/app/chatgpt-auth";
import {saveGoogleCalendarOAuthSettings} from "@/lib/google-calendar";
import {isOwner} from "@/lib/owner";

export async function POST(request:Request){const user=await getChatGPTUser();if(!user||!isOwner(user))return new Response("권한이 없습니다.",{status:403});try{const form=await request.formData(),clientId=String(form.get("clientId")||""),clientSecret=String(form.get("clientSecret")||"");await saveGoogleCalendarOAuthSettings(user.userId,clientId,clientSecret);return Response.redirect(new URL("/settings?calendar=configured",request.url),303)}catch(error){console.error(error);return Response.redirect(new URL("/settings?calendar=config-failed",request.url),303)}}
