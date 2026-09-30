import {getChatGPTUser} from "@/app/chatgpt-auth";
import {isOwner} from "@/lib/owner";
import type {ContentKind} from "@/lib/content-validation";
export async function ContentActions({kind,id}:{kind:ContentKind;id?:string}){const u=await getChatGPTUser();if(!isOwner(u))return null;return <div className="content-actions"><a href={`/manage/${kind}/${id??'new'}`}>{id?'게시물 수정':kind==='photo'?'사진 올리기':'새 글 작성'}</a><a href="/manage">콘텐츠 관리</a></div>}
