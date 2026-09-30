import {getChatGPTUser} from "@/app/chatgpt-auth";
import {revokeGoogleCalendarConnection} from "@/lib/google-calendar";
import {isOwner} from "@/lib/owner";

export async function POST(request:Request){const user=await getChatGPTUser();if(!user||!isOwner(user))return new Response("권한이 없습니다.",{status:403});await revokeGoogleCalendarConnection(user.userId);return Response.redirect(new URL("/settings?calendar=disconnected",request.url),303)}
