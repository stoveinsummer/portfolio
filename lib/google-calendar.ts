import {env} from "cloudflare:workers";
import {getBinding} from "@/db";
import type {TimelineEvent} from "@/lib/timeline";

type ConnectionRow={encrypted_refresh_token:string;calendar_id:string;calendar_name:string;updated_at:string};
type GoogleEvent={id?:string;summary?:string;location?:string;htmlLink?:string;status?:string;start?:{date?:string;dateTime?:string};end?:{date?:string;dateTime?:string}};

const encoder=new TextEncoder(),decoder=new TextDecoder();
const runtimeConfig=()=>({clientId:env.GOOGLE_CALENDAR_CLIENT_ID,clientSecret:env.GOOGLE_CALENDAR_CLIENT_SECRET,tokenKey:env.GOOGLE_CALENDAR_TOKEN_KEY,redirectUri:env.GOOGLE_CALENDAR_REDIRECT_URI});
const bytesToBase64Url=(bytes:Uint8Array)=>{let binary="";for(const byte of bytes)binary+=String.fromCharCode(byte);return btoa(binary).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")};
const base64UrlToBytes=(value:string)=>{const base64=value.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(value.length/4)*4,"=");const binary=atob(base64);return Uint8Array.from(binary,char=>char.charCodeAt(0))};
const timingSafeEqual=(left:Uint8Array,right:Uint8Array)=>left.length===right.length&&left.reduce((result,value,index)=>result|(value^right[index]),0)===0;

async function keyBytes(){const value=runtimeConfig().tokenKey;if(!value)throw new Error("Google Calendar token key is unavailable");const bytes=base64UrlToBytes(value);if(bytes.length!==32)throw new Error("Google Calendar token key must be 32 bytes");return bytes}
async function aesKey(){return crypto.subtle.importKey("raw",await keyBytes(),"AES-GCM",false,["encrypt","decrypt"])}

export async function encryptRefreshToken(token:string){const iv=crypto.getRandomValues(new Uint8Array(12)),cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv},await aesKey(),encoder.encode(token));return `v1.${bytesToBase64Url(iv)}.${bytesToBase64Url(new Uint8Array(cipher))}`}
async function decryptRefreshToken(payload:string){const [version,iv,cipher]=payload.split(".");if(version!=="v1"||!iv||!cipher)throw new Error("Invalid token payload");const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:base64UrlToBytes(iv)},await aesKey(),base64UrlToBytes(cipher));return decoder.decode(plain)}

export async function createGoogleOAuthState(userId:string){const payload=bytesToBase64Url(encoder.encode(JSON.stringify({userId,expiresAt:Date.now()+10*60_000,nonce:crypto.randomUUID()}))),key=await crypto.subtle.importKey("raw",await keyBytes(),{name:"HMAC",hash:"SHA-256"},false,["sign"]),signature=await crypto.subtle.sign("HMAC",key,encoder.encode(payload));return `${payload}.${bytesToBase64Url(new Uint8Array(signature))}`}
export async function verifyGoogleOAuthState(state:string,userId:string){try{const [payload,signature]=state.split(".");if(!payload||!signature)return false;const key=await crypto.subtle.importKey("raw",await keyBytes(),{name:"HMAC",hash:"SHA-256"},false,["sign"]),expected=new Uint8Array(await crypto.subtle.sign("HMAC",key,encoder.encode(payload))),actual=base64UrlToBytes(signature),data=JSON.parse(decoder.decode(base64UrlToBytes(payload))) as {userId:string;expiresAt:number};return timingSafeEqual(expected,actual)&&data.userId===userId&&data.expiresAt>Date.now()}catch{return false}}

export async function getGoogleCalendarConnection(userId:string){return getBinding().prepare("SELECT encrypted_refresh_token,calendar_id,calendar_name,updated_at FROM google_calendar_connections WHERE user_id=?").bind(userId).first<ConnectionRow>()}
async function storedOAuthConfig(userId:string){const row=await getBinding().prepare("SELECT encrypted_client_id,encrypted_client_secret FROM google_calendar_oauth_settings WHERE user_id=?").bind(userId).first<{encrypted_client_id:string;encrypted_client_secret:string}>().catch(()=>null);if(!row)return null;return {clientId:await decryptRefreshToken(row.encrypted_client_id),clientSecret:await decryptRefreshToken(row.encrypted_client_secret)}}
export async function googleOAuthConfig(userId:string){const value=runtimeConfig(),stored=value.clientId&&value.clientSecret?null:await storedOAuthConfig(userId);const clientId=value.clientId||stored?.clientId,clientSecret=value.clientSecret||stored?.clientSecret;if(!clientId||!clientSecret||!value.tokenKey||!value.redirectUri)throw new Error("Google Calendar is not configured");return {clientId,clientSecret,redirectUri:value.redirectUri}}
export async function isGoogleCalendarConfigured(userId:string){try{await googleOAuthConfig(userId);return true}catch{return false}}
export async function getGoogleCalendarStatus(userId:string){const configured=await isGoogleCalendarConfigured(userId);if(!configured)return {configured,connected:false,calendarName:null};const row=await getGoogleCalendarConnection(userId).catch(()=>null);return {configured,connected:Boolean(row),calendarName:row?.calendar_name??null}}

export async function saveGoogleCalendarOAuthSettings(userId:string,clientId:string,clientSecret:string){const normalizedId=clientId.trim(),normalizedSecret=clientSecret.trim();if(!normalizedId.endsWith(".apps.googleusercontent.com")||normalizedSecret.length<10)throw new Error("Invalid Google OAuth credentials");const encryptedId=await encryptRefreshToken(normalizedId),encryptedSecret=await encryptRefreshToken(normalizedSecret);await getBinding().prepare("INSERT INTO google_calendar_oauth_settings(user_id,encrypted_client_id,encrypted_client_secret,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET encrypted_client_id=excluded.encrypted_client_id,encrypted_client_secret=excluded.encrypted_client_secret,updated_at=excluded.updated_at").bind(userId,encryptedId,encryptedSecret,new Date().toISOString()).run()}

async function refreshAccessToken(userId:string,encrypted:string){const value=await googleOAuthConfig(userId),refreshToken=await decryptRefreshToken(encrypted),response=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:value.clientId,client_secret:value.clientSecret,refresh_token:refreshToken,grant_type:"refresh_token"})});if(!response.ok)throw new Error(`Google token refresh failed: ${response.status}`);const payload=await response.json() as {access_token?:string};if(!payload.access_token)throw new Error("Google access token missing");return payload.access_token}

const eventDate=(event:GoogleEvent)=>event.start?.date??(event.start?.dateTime?new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(event.start.dateTime)):null);
const eventTime=(event:GoogleEvent)=>{if(event.start?.date)return "종일";if(!event.start?.dateTime)return "시간 미정";return new Intl.DateTimeFormat("ko-KR",{timeZone:"Asia/Seoul",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(event.start.dateTime))};

export async function listGoogleCalendarEvents(userId:string):Promise<TimelineEvent[]>{
  if(!await isGoogleCalendarConfigured(userId))return [];
  const row=await getGoogleCalendarConnection(userId);if(!row)return [];
  try{
    const accessToken=await refreshAccessToken(userId,row.encrypted_refresh_token),now=new Date(),timeMin=new Date(Date.UTC(now.getUTCFullYear()-1,0,1)).toISOString(),timeMax=new Date(Date.UTC(now.getUTCFullYear()+2,0,1)).toISOString(),url=new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(row.calendar_id)}/events`);
    url.search=new URLSearchParams({timeMin,timeMax,singleEvents:"true",orderBy:"startTime",maxResults:"2500",timeZone:"Asia/Seoul"}).toString();
    const response=await fetch(url,{headers:{authorization:`Bearer ${accessToken}`}});if(!response.ok)throw new Error(`Google events failed: ${response.status}`);
    const payload=await response.json() as {items?:GoogleEvent[]};
    return (payload.items??[]).filter(item=>item.status!=="cancelled").flatMap(item=>{const date=eventDate(item);if(!date)return [];return [{id:`google-${item.id??crypto.randomUUID()}`,date,type:"google" as const,title:item.summary?.trim()||"제목 없는 일정",detail:`${eventTime(item)}${item.location?` · ${item.location}`:""}`,href:item.htmlLink||"https://calendar.google.com",external:true}]});
  }catch(error){console.error("google calendar events",error);return []}
}

export async function saveGoogleCalendarConnection(userId:string,refreshToken:string,accessToken:string){
  const response=await fetch("https://www.googleapis.com/calendar/v3/calendars/primary",{headers:{authorization:`Bearer ${accessToken}`}}),calendar=response.ok?await response.json() as {id?:string;summary?:string}:{};
  const encrypted=await encryptRefreshToken(refreshToken),updatedAt=new Date().toISOString();
  await getBinding().prepare("INSERT INTO google_calendar_connections(user_id,encrypted_refresh_token,calendar_id,calendar_name,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET encrypted_refresh_token=excluded.encrypted_refresh_token,calendar_id=excluded.calendar_id,calendar_name=excluded.calendar_name,updated_at=excluded.updated_at").bind(userId,encrypted,calendar.id||"primary",calendar.summary||"Google Calendar",updatedAt).run();
}

export async function deleteGoogleCalendarConnection(userId:string){await getBinding().prepare("DELETE FROM google_calendar_connections WHERE user_id=?").bind(userId).run()}
export async function revokeGoogleCalendarConnection(userId:string){const row=await getGoogleCalendarConnection(userId);if(row){try{const token=await decryptRefreshToken(row.encrypted_refresh_token);await fetch("https://oauth2.googleapis.com/revoke",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({token})})}catch(error){console.error("google calendar revoke",error)}}await deleteGoogleCalendarConnection(userId)}
