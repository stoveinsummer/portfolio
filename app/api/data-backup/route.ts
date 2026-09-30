import {getChatGPTUser} from "@/app/chatgpt-auth";
import {getBinding} from "@/db";
import {contentSchemas,type ContentKind} from "@/lib/content-validation";
import {orderSchema} from "@/lib/home-order";
import {investmentLedgerSchema} from "@/lib/investment-ledger";
import {isOwner} from "@/lib/owner";
import {planSchema,setSchema} from "@/lib/workout";
import {z} from "zod";

const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const exportedSessionSchema=z.object({
  originalId:z.number().int().positive(),workoutDate:date,routine:z.string().min(1).max(60),requestKey:z.string().nullable(),
  bodyWeight:z.number().positive().max(500).nullable(),backCondition:z.number().int().min(1).max(5),createdAt:z.string(),
  sets:z.array(setSchema).max(300),
});
const contentSchema=z.object({postKey:z.string().min(3).max(100),kind:z.enum(["photo","journal","invest"]),revision:z.number().int().min(1),updatedAt:z.string(),item:z.unknown()});
const backupSchema=z.object({
  format:z.literal("juhwan-personal-site-backup"),version:z.literal(1),backupId:z.string().uuid(),exportedAt:z.string(),
  data:z.object({workoutPlans:planSchema.nullable(),workoutSessions:z.array(exportedSessionSchema).max(5000),homeOrder:orderSchema.nullable(),investmentLedger:investmentLedgerSchema.nullable(),contentPosts:z.array(contentSchema).max(5000)}),
});
type Backup=z.infer<typeof backupSchema>;

function unauthorized(){return Response.json({error:"소유자만 전체 데이터를 백업하고 복원할 수 있습니다."},{status:403})}
async function batches(statements:D1PreparedStatement[]){const db=getBinding();for(let i=0;i<statements.length;i+=50)await db.batch(statements.slice(i,i+50));}

export async function GET(){
  const user=await getChatGPTUser();if(!user||!isOwner(user))return unauthorized();
  try{
    const db=getBinding();
    const [planRow,homeRow,ledgerRow,sessionsResult,setsResult,contentResult,imagesResult]=await Promise.all([
      db.prepare("SELECT plans_json FROM workout_plans WHERE user_id=?").bind(user.userId).first<{plans_json:string}>(),
      db.prepare("SELECT order_json FROM home_preferences WHERE user_id=?").bind(user.userId).first<{order_json:string}>(),
      db.prepare("SELECT payload_json FROM investment_ledgers WHERE user_id=?").bind(user.userId).first<{payload_json:string}>(),
      db.prepare("SELECT id,workout_date,routine,request_key,body_weight,back_condition,created_at FROM workout_sessions WHERE user_id=? ORDER BY id").bind(user.userId).all<{id:number;workout_date:string;routine:string;request_key:string|null;body_weight:number|null;back_condition:number;created_at:string}>(),
      db.prepare("SELECT ws.session_id,ws.exercise_key,ws.exercise_name,ws.exercise_type,ws.set_number,ws.weight,ws.reps,ws.rir,ws.duration,ws.distance FROM workout_sets ws JOIN workout_sessions s ON s.id=ws.session_id WHERE s.user_id=? ORDER BY ws.id").bind(user.userId).all<{session_id:number;exercise_key:string;exercise_name:string;exercise_type:"weight"|"bodyweight"|"cardio"|"timed";set_number:number;weight:number;reps:number;rir:number;duration:number;distance:number}>(),
      db.prepare("SELECT post_key,kind,payload_json,revision,updated_at FROM content_posts WHERE updated_by=? ORDER BY post_key").bind(user.userId).all<{post_key:string;kind:ContentKind;payload_json:string;revision:number;updated_at:string}>(),
      db.prepare("SELECT id,content_type,size,created_at FROM uploaded_images WHERE user_id=? ORDER BY created_at").bind(user.userId).all<{id:string;content_type:string;size:number;created_at:string}>(),
    ]);
    const setsBySession=new Map<number,Array<z.infer<typeof setSchema>>>();
    for(const row of setsResult.results){const list=setsBySession.get(row.session_id)??[];list.push({exerciseKey:row.exercise_key,exerciseName:row.exercise_name,exerciseType:row.exercise_type,setNumber:row.set_number,weight:row.weight,reps:row.reps,rir:row.rir,duration:row.duration,distance:row.distance});setsBySession.set(row.session_id,list)}
    const backup:Backup={
      format:"juhwan-personal-site-backup",version:1,backupId:crypto.randomUUID(),exportedAt:new Date().toISOString(),
      data:{
        workoutPlans:planRow?planSchema.parse(JSON.parse(planRow.plans_json)):null,
        workoutSessions:sessionsResult.results.map(row=>({originalId:row.id,workoutDate:row.workout_date,routine:row.routine,requestKey:row.request_key,bodyWeight:row.body_weight,backCondition:row.back_condition,createdAt:row.created_at,sets:setsBySession.get(row.id)??[]})),
        homeOrder:homeRow?orderSchema.parse(JSON.parse(homeRow.order_json)):null,
        investmentLedger:ledgerRow?investmentLedgerSchema.parse(JSON.parse(ledgerRow.payload_json)):null,
        contentPosts:contentResult.results.map(row=>({postKey:row.post_key,kind:row.kind,revision:row.revision,updatedAt:row.updated_at,item:contentSchemas[row.kind].parse(JSON.parse(row.payload_json))})),
      },
    };
    const body=JSON.stringify({...backup,manifest:{structuredRecords:{workoutSessions:backup.data.workoutSessions.length,contentPosts:backup.data.contentPosts.length},uploadedImages:imagesResult.results.map(row=>({id:row.id,contentType:row.content_type,size:row.size,createdAt:row.created_at,included:false})),excluded:["Google OAuth 설정·토큰","R2 업로드 사진 원본","다른 사용자의 댓글과 기록"]}},null,2);
    const day=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
    return new Response(body,{headers:{"content-type":"application/json; charset=utf-8","content-disposition":`attachment; filename="juhwan-backup-${day}.json"`,"cache-control":"private, no-store","x-content-type-options":"nosniff"}});
  }catch(error){console.error("data backup",error);return Response.json({error:"백업 파일을 만들지 못했습니다."},{status:500})}
}

export async function POST(request:Request){
  const user=await getChatGPTUser();if(!user||!isOwner(user))return unauthorized();
  try{
    if(Number(request.headers.get("content-length")||0)>20*1024*1024)return Response.json({error:"백업 파일은 20MB 이하여야 합니다."},{status:413});
    const parsed=backupSchema.safeParse(await request.json());if(!parsed.success)return Response.json({error:"지원하지 않거나 손상된 백업 파일입니다."},{status:400});
    const backup=parsed.data,db=getBinding(),now=new Date().toISOString(),statements:D1PreparedStatement[]=[];
    if(backup.data.workoutPlans)statements.push(db.prepare("INSERT INTO workout_plans(user_id,plans_json) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET plans_json=excluded.plans_json").bind(user.userId,JSON.stringify(backup.data.workoutPlans)));
    if(backup.data.homeOrder)statements.push(db.prepare("INSERT INTO home_preferences(user_id,order_json) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET order_json=excluded.order_json").bind(user.userId,JSON.stringify(backup.data.homeOrder)));
    if(backup.data.investmentLedger)statements.push(db.prepare("INSERT INTO investment_ledgers(user_id,payload_json,revision,updated_at) VALUES(?,?,1,?) ON CONFLICT(user_id) DO UPDATE SET payload_json=excluded.payload_json,revision=investment_ledgers.revision+1,updated_at=excluded.updated_at").bind(user.userId,JSON.stringify(backup.data.investmentLedger),now));
    for(const session of backup.data.workoutSessions){
      const restoreKey=session.requestKey||`restore-${backup.backupId}-${session.originalId}`;
      statements.push(db.prepare("INSERT INTO workout_sessions(user_id,workout_date,routine,request_key,body_weight,back_condition,created_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(request_key) DO NOTHING").bind(user.userId,session.workoutDate,session.routine,restoreKey,session.bodyWeight,session.backCondition,session.createdAt));
      for(const set of session.sets)statements.push(db.prepare("INSERT INTO workout_sets(session_id,exercise_key,exercise_name,exercise_type,set_number,weight,reps,rir,duration,distance) SELECT id,?,?,?,?,?,?,?,?,? FROM workout_sessions WHERE request_key=? AND user_id=? AND NOT EXISTS(SELECT 1 FROM workout_sets WHERE session_id=workout_sessions.id AND set_number=? AND exercise_key=?)").bind(set.exerciseKey,set.exerciseName,set.exerciseType,set.setNumber,set.weight,set.reps,set.rir,set.duration,set.distance,restoreKey,user.userId,set.setNumber,set.exerciseKey));
    }
    for(const post of backup.data.contentPosts){const item=contentSchemas[post.kind].parse(post.item);if(post.postKey!==`${post.kind}:${item.id}`)throw Error("content key mismatch");statements.push(db.prepare("INSERT INTO content_posts(post_key,kind,payload_json,updated_by,revision,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(post_key) DO UPDATE SET kind=excluded.kind,payload_json=excluded.payload_json,updated_by=excluded.updated_by,revision=MAX(content_posts.revision+1,excluded.revision),updated_at=excluded.updated_at").bind(post.postKey,post.kind,JSON.stringify(item),user.userId,post.revision,now));}
    await batches(statements);
    return Response.json({restored:true,counts:{workoutSessions:backup.data.workoutSessions.length,contentPosts:backup.data.contentPosts.length},excluded:["Google OAuth 설정·토큰","R2 업로드 사진 원본","다른 사용자의 댓글과 기록"]},{headers:{"cache-control":"private, no-store"}});
  }catch(error){console.error("data restore",error);return Response.json({error:"백업을 복원하지 못했습니다. 파일 형식과 내용을 확인해 주세요."},{status:500})}
}
