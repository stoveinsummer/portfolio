import {getChatGPTUser} from "@/app/chatgpt-auth";
import {isOwner} from "@/lib/owner";
import {getBinding} from "@/db";
import {contentRequest,contentSchemas} from "@/lib/content-validation";
import {original} from "@/lib/content-store";
const error=(message:string,status=400)=>Response.json({error:message},{status});
export async function POST(req:Request){return write(req,false)}
export async function PUT(req:Request){return write(req,true)}
async function write(req:Request,update:boolean){const user=await getChatGPTUser();if(!user)return error("로그인이 필요합니다.",401);if(!isOwner(user))return error("주환님만 게시물을 작성할 수 있습니다.",403);
try{const raw=await req.text();if(raw.length>200000)return error("내용이 너무 깁니다.",413);const parsed=contentRequest.safeParse(JSON.parse(raw));if(!parsed.success)return error("입력 항목을 확인해 주세요.");const {kind,revision,item}=parsed.data;const v=contentSchemas[kind].safeParse(item);if(!v.success)return error(v.error.issues[0]?.message??"입력을 확인해 주세요.");const data=v.data,db=getBinding(),key=`${kind}:${data.id}`;
if(kind==='photo'&&'imageUrl' in data){if(data.imageUrl.startsWith('/api/images/')){const img=await db.prepare("SELECT id FROM uploaded_images WHERE id=? AND user_id=?").bind(data.imageUrl.split('/').pop(),user.userId).first();if(!img)return error("사진을 먼저 업로드해 주세요.");}else {const p=original('photo',data.id);if(!p||p.imageUrl!==data.imageUrl)return error("사진을 먼저 업로드해 주세요.");}}
const before=await db.prepare("SELECT revision FROM content_posts WHERE post_key=?").bind(key).first<{revision:number}>();const exists=Boolean(before||original(kind,data.id));if(!update&&exists)return error("이미 존재하는 게시물입니다.",409);if(update&&!exists)return error("게시물을 찾을 수 없습니다.",404);if((before?.revision??0)!==revision)return error("다른 화면에서 수정됐습니다. 새로고침 후 다시 수정해 주세요.",409);
const json=JSON.stringify(data),now=new Date().toISOString();let changes:number;
if(before){const r=await db.prepare("UPDATE content_posts SET payload_json=?,updated_by=?,updated_at=?,revision=revision+1 WHERE post_key=? AND revision=?").bind(json,user.userId,now,key,revision).run();changes=r.meta.changes;}else{const r=await db.prepare("INSERT INTO content_posts(post_key,kind,payload_json,updated_by,updated_at,revision) VALUES(?,?,?,?,?,1) ON CONFLICT(post_key) DO NOTHING").bind(key,kind,json,user.userId,now).run();changes=r.meta.changes;}if(!changes)return error("동시에 수정된 게시물입니다. 새로고침해 주세요.",409);return Response.json({saved:true,id:data.id,revision:revision+1,url:`/${kind}/${data.id}`},{status:update?200:201});
}catch(e){console.error(e);return error("저장하지 못했습니다. 입력을 유지했습니다.",500)}}
