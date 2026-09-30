import {getChatGPTUser} from "@/app/chatgpt-auth";
import {createGoogleOAuthState,googleOAuthConfig} from "@/lib/google-calendar";
import {isOwner} from "@/lib/owner";

export async function GET(){
  const user=await getChatGPTUser();if(!user||!isOwner(user))return new Response("권한이 없습니다.",{status:403});
  try{const config=await googleOAuthConfig(user.userId),state=await createGoogleOAuthState(user.userId),url=new URL("https://accounts.google.com/o/oauth2/v2/auth");url.search=new URLSearchParams({client_id:config.clientId,redirect_uri:config.redirectUri,response_type:"code",scope:"https://www.googleapis.com/auth/calendar.readonly",access_type:"offline",include_granted_scopes:"true",prompt:"consent",state}).toString();return Response.redirect(url,302)}catch(error){console.error(error);return new Response("Google Calendar 연결 설정이 아직 준비되지 않았습니다.",{status:503})}
}
