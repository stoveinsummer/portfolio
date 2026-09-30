import {getBinding} from "@/db";
import {photos as originalPhotos} from "@/data/photos";
import {journals} from "@/data/journals";
import {investments} from "@/data/investments";
import type {PhotoItem,JournalEntry,InvestmentRecord} from "@/types/content";
import type {ContentKind} from "./content-validation";
export type ContentMap={photo:PhotoItem;journal:JournalEntry;invest:InvestmentRecord};
const seeds={photo:originalPhotos.map(p=>({...p,imageUrl:'/photos/web/'+p.imageUrl.split('/').pop()})),journal:journals,invest:investments};
export function original<K extends ContentKind>(kind:K,id:string):ContentMap[K]|undefined{return seeds[kind].find(p=>p.id===id) as ContentMap[K]|undefined;}
export async function listContent<K extends ContentKind>(kind:K):Promise<ContentMap[K][]> {
 const {results}=await getBinding().prepare("SELECT payload_json FROM content_posts WHERE kind=?").bind(kind).all<{payload_json:string}>();
 const map=new Map<string,ContentMap[K]>(seeds[kind].map(p=>[p.id,p as ContentMap[K]]));
 for(const r of results){const p=JSON.parse(r.payload_json) as ContentMap[K];map.set(p.id,p)}
 return [...map.values()].sort((a,b)=>{const da='takenAt' in a?a.takenAt:a.date;const db='takenAt' in b?b.takenAt:b.date;return db.localeCompare(da)||a.id.localeCompare(b.id)});
}
export async function getContent<K extends ContentKind>(kind:K,id:string){
 const row=await getBinding().prepare("SELECT payload_json,revision FROM content_posts WHERE post_key=?").bind(`${kind}:${id}`).first<{payload_json:string;revision:number}>();
 return row?{item:JSON.parse(row.payload_json) as ContentMap[K],revision:row.revision}:{item:original(kind,id),revision:0};
}
export async function postExists(key:string){const [kind,id,...rest]=key.split(':');if(rest.length||!['photo','journal','invest'].includes(kind)||!id)return false;return Boolean((await getContent(kind as ContentKind,id)).item)}
