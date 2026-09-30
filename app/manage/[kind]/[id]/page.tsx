import {notFound} from "next/navigation";
import {getChatGPTUser} from "@/app/chatgpt-auth";
import {isOwner} from "@/lib/owner";
import {getContent} from "@/lib/content-store";
import {contentKinds,type ContentKind} from "@/lib/content-validation";
import {ContentEditor} from "@/components/ContentEditor";
export const dynamic="force-dynamic";
export default async function Editor({params}:{params:Promise<{kind:string;id:string}>}){const {kind,id}=await params;if(!contentKinds.includes(kind as ContentKind))notFound();const u=await getChatGPTUser();if(!isOwner(u))return <main className="section-page"><p>주환님만 게시물을 작성할 수 있습니다.</p></main>;const data=id==='new'?{item:undefined,revision:0}:await getContent(kind as ContentKind,id);if(id!=='new'&&!data.item)notFound();return <ContentEditor kind={kind as ContentKind} item={data.item} revision={data.revision}/>}
