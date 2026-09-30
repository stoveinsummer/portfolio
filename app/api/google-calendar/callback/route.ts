import {getChatGPTUser} from "@/app/chatgpt-auth";
import {googleOAuthConfig,saveGoogleCalendarConnection,verifyGoogleOAuthState} from "@/lib/google-calendar";
import {isOwner} from "@/lib/owner";

export async function GET(request:Request){
  const user=await getChatGPTUser();if(!user||!isOwner(user))return new Response("권한이 없습니다.",{status:403});
  const url=new URL(request.url),code=url.searchParams.get("code"),state=url.searchParams.get("state");
  if(!code||!state||!await verifyGoogleOAuthState(state,user.userId))return Response.redirect(new URL("/settings?calendar=invalid",request.url),302);
  try{const config=await googleOAuthConfig(user.userId),response=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:config.clientId,client_secret:config.clientSecret,code,grant_type:"authorization_code",redirect_uri:config.redirectUri})});if(!response.ok)throw new Error(`Google token exchange failed: ${response.status}`);const token=await response.json() as {access_token?:string;refresh_token?:string};if(!token.access_token||!token.refresh_token)throw new Error("Google tokens missing");await saveGoogleCalendarConnection(user.userId,token.refresh_token,token.access_token);return Response.redirect(new URL("/settings?calendar=connected",request.url),302)}catch(error){console.error(error);return Response.redirect(new URL("/settings?calendar=failed",request.url),302)}
}
