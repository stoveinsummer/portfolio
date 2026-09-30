import {getChatGPTUser} from "@/app/chatgpt-auth";
import {getBinding} from "@/db";
import {defaultInvestmentLedger,investmentLedgerSchema} from "@/lib/investment-ledger";
import {isOwner} from "@/lib/owner";
import {z} from "zod";

const error=(message:string,status=400)=>Response.json({error:message},{status});

export async function GET(){
  const user=await getChatGPTUser();
  if(!user)return error("로그인이 필요합니다.",401);
  if(!isOwner(user))return error("비공개 투자 원장입니다.",403);
  const row=await getBinding().prepare("SELECT payload_json,revision,updated_at FROM investment_ledgers WHERE user_id=?").bind(user.userId).first<{payload_json:string;revision:number;updated_at:string}>();
  if(!row)return Response.json({ledger:defaultInvestmentLedger,revision:0,updatedAt:null});
  try{return Response.json({ledger:investmentLedgerSchema.parse(JSON.parse(row.payload_json)),revision:row.revision,updatedAt:row.updated_at});}
  catch(e){console.error(e);return error("저장된 투자 원장을 읽지 못했습니다.",500);}
}

export async function PUT(req:Request){
  const user=await getChatGPTUser();
  if(!user)return error("로그인이 필요합니다.",401);
  if(!isOwner(user))return error("주환님만 투자 원장을 수정할 수 있습니다.",403);
  try{
    const raw=await req.text();
    if(raw.length>1_000_000)return error("투자 기록이 너무 큽니다.",413);
    const body=zRequest.safeParse(JSON.parse(raw));
    if(!body.success)return error(body.error.issues[0]?.message??"입력값을 확인해 주세요.");
    const {ledger,revision}=body.data,db=getBinding(),now=new Date().toISOString(),json=JSON.stringify(ledger);
    const current=await db.prepare("SELECT revision FROM investment_ledgers WHERE user_id=?").bind(user.userId).first<{revision:number}>();
    if((current?.revision??0)!==revision)return error("다른 화면에서 수정됐습니다. 새로고침 후 다시 시도해 주세요.",409);
    if(current){
      const result=await db.prepare("UPDATE investment_ledgers SET payload_json=?,revision=revision+1,updated_at=? WHERE user_id=? AND revision=?").bind(json,now,user.userId,revision).run();
      if(!result.meta.changes)return error("동시에 수정된 기록이 있습니다.",409);
    }else{
      const result=await db.prepare("INSERT INTO investment_ledgers(user_id,payload_json,revision,updated_at) VALUES(?,?,1,?) ON CONFLICT(user_id) DO NOTHING").bind(user.userId,json,now).run();
      if(!result.meta.changes)return error("동시에 생성된 기록이 있습니다.",409);
    }
    return Response.json({saved:true,revision:revision+1,updatedAt:now});
  }catch(e){console.error(e);return error("투자 원장을 저장하지 못했습니다. 입력값은 유지됩니다.",500);}
}

const zRequest=z.object({revision:z.number().int().nonnegative(),ledger:investmentLedgerSchema});
