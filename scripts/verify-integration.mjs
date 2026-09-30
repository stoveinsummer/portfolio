import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {readFile,readdir,realpath} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('..',import.meta.url)).replace(/\/$/,'');
const req=createRequire(await realpath(root+'/node_modules/wrangler/package.json'));
const {Miniflare}=req('miniflare');
const moduleFiles=(await readdir(root+'/dist/server',{recursive:true})).filter(f=>f.endsWith('.js')||f.endsWith('.mjs')).sort((a,b)=>a==='index.js'?-1:b==='index.js'?1:0);
const mf=new Miniflare({modules:moduleFiles.map(f=>({type:'ESModule',path:root+'/dist/server/'+f})),modulesRoot:root+'/dist/server',modulesRules:[{type:'ESModule',include:['**/*.js','**/*.mjs']}],compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],bindings:{},d1Databases:['DB'],r2Buckets:['BUCKET'],assets:{directory:root+'/dist/client',binding:'ASSETS',routerConfig:{has_user_worker:true,invoke_user_worker_ahead_of_assets:true}},log:new (req('miniflare').Log)(req('miniflare').LogLevel.ERROR)});
try{
const db=await mf.getD1Database('DB');
for(const file of (await readdir(root+'/drizzle')).filter(f=>f.endsWith('.sql')).sort())for(const sql of (await readFile(root+'/drizzle/'+file,'utf8')).split('--> statement-breakpoint').filter(s=>s.trim()))await db.prepare(sql).run();
async function call(path,user,method='GET',body){const headers={'content-type':'application/json'};if(user){headers['oai-authenticated-user-id']=user;headers['oai-authenticated-user-email']=user==='owner'?'wnlth96@gmail.com':user+'@example.test';}const r=await mf.dispatchFetch('http://test.local'+path,{method,headers,body:body?JSON.stringify(body):undefined});const text=await r.text();if(!text)throw Error(path+' status='+r.status+' location='+r.headers.get('location'));return {status:r.status,data:JSON.parse(text)};}
assert.equal((await call('/api/plans')).status,401);
let p=await call('/api/plans','alice');assert.equal(p.status,200);assert.equal(p.data.plans.length,2);
assert.deepEqual(p.data.plans.map(p=>[p.name,p.exercises.map(e=>[e.name,e.setCount,e.targetReps])]),[
 ['A 루틴',[['레그프레스',3,'8~12'],['체스트프레스 머신',3,'8~12'],['랫풀다운',3,'8~12'],['숄더프레스 머신',2,'8~12'],['케이블 컬',2,'10~15']]],
 ['B 루틴',[['레그컬',3,'10~15'],['인클라인 체스트프레스 머신',3,'8~12'],['체스트 서포티드 로우',3,'8~12'],['레터럴 레이즈',2,'12~15'],['케이블 푸시다운',2,'10~15']]]
]);
const plan=[{key:'test',name:'내 루틴',exercises:[{key:'run',name:'달리기',type:'cardio',setCount:1,equipment:'트레드밀',variation:'경사 5%',notes:'워밍업 후 시작'}]}];assert.equal((await call('/api/plans','alice','PUT',plan)).status,200);assert.equal((await call('/api/plans','bob')).data.plans.length,2);
const base={exerciseKey:'exercise',exerciseName:'검증',setNumber:1,weight:0,reps:0,rir:0,duration:0,distance:0};
const payload={requestKey:crypto.randomUUID(),routine:'테스트',bodyWeight:null,backCondition:3,sets:[{...base,exerciseType:'weight',weight:10,reps:8},{...base,exerciseType:'bodyweight',reps:12},{...base,exerciseType:'cardio',duration:20,distance:3},{...base,exerciseType:'timed',duration:1}]};
const saved=await call('/api/workouts','alice','POST',payload);assert.equal(saved.status,201,JSON.stringify(saved));assert.equal((await call('/api/workouts','alice','POST',payload)).status,200);assert.equal((await call('/api/workouts','alice')).data.sessions.length,1);assert.equal((await call('/api/workouts','alice')).data.sessions[0].sets.length,4);assert.equal((await call('/api/workouts','bob')).data.sessions.length,0);assert.equal((await call('/api/workouts','alice','POST',{...payload,requestKey:crypto.randomUUID(),sets:[{...base,exerciseType:'weight',reps:-1}]})).status,400);
// Exercise metadata persists; editing and removing routines never rewrites history.
assert.deepEqual((await call('/api/plans','alice')).data.plans,plan);
const edited=[{...plan[0],exercises:[{...plan[0].exercises[0],name:'경사 걷기',equipment:'다른 기구'},{key:'pull-up',name:'풀업',type:'bodyweight',setCount:2,targetReps:'6~10'}]}];
assert.equal((await call('/api/plans','alice','PUT',edited)).status,200);
assert.equal((await call('/api/plans','alice')).data.plans[0].exercises[0].name,'경사 걷기');
assert.equal((await call('/api/plans','alice')).data.plans[0].exercises[1].targetReps,'6~10');
assert.equal((await call('/api/plans','alice','PUT',[{...plan[0],exercises:[]}])).status,200);
assert.equal((await call('/api/plans','alice')).data.plans[0].exercises.length,0);
assert.equal((await call('/api/workouts','alice')).data.sessions[0].sets[0].exerciseName,'검증');
assert.equal((await call('/api/plans','alice','PUT',[{...plan[0],exercises:[{...plan[0].exercises[0],equipment:'x'.repeat(61)}]}])).status,400);
assert.equal((await call('/api/investment-ledger')).status,401);
assert.equal((await call('/api/investment-ledger','alice')).status,403);
const emptyLedger=(await call('/api/investment-ledger','owner')).data;assert.equal(emptyLedger.revision,0);assert.equal(emptyLedger.ledger.accounts.length,1);assert.equal(emptyLedger.ledger.holdings.length,0);
const ledger={...emptyLedger.ledger,holdings:[{id:'holding-1',accountId:'general',symbol:'DEMO',name:'예시 자산',category:'예시',currency:'USD',quantity:10,averagePrice:100,currentPrice:110}],cashflows:[{id:'flow-1',date:'2026-09-01',accountId:'general',type:'deposit',amount:100,currency:'USD',exchangeRate:1350,note:'자동매수'}],dividends:[{id:'dividend-1',date:'2026-09-18',accountId:'general',symbol:'DEMO',amount:10,currency:'USD',exchangeRate:1350,note:''}],snapshots:[{id:'snapshot-1',date:'2026-08-31',totalKrw:10000000,exchangeRate:1350,sp500:6500,nasdaq:22000,note:''},{id:'snapshot-2',date:'2026-09-25',totalKrw:10500000,exchangeRate:1340,sp500:6600,nasdaq:22500,note:'환율 영향을 따로 확인했다.',marketSummary:'물가와 고용 발표로 금리 민감도가 높아졌다.',marketSources:[{title:'공식 자료',url:'https://example.com/source'}]}]};
assert.equal((await call('/api/investment-ledger','owner','PUT',{revision:0,ledger})).status,200);
assert.equal((await call('/api/investment-ledger','owner','PUT',{revision:0,ledger})).status,409);
const storedLedger=(await call('/api/investment-ledger','owner')).data;assert.equal(storedLedger.revision,1);assert.equal(storedLedger.ledger.dividends[0].symbol,'DEMO');
const journal={id:'qa-journal',title:'작성 검증',date:'2026-09-21',summary:'요약',content:['문단 1','문단 2'],category:'일상',tags:['검증']};
assert.equal((await call('/api/content','alice','POST',{kind:'journal',revision:0,item:journal})).status,403);
assert.equal((await call('/api/content',null,'POST',{kind:'journal',revision:0,item:journal})).status,401);
assert.equal((await call('/api/content','owner','POST',{kind:'journal',revision:0,item:journal})).status,201);
const post='journal:qa-journal';assert.equal((await call('/api/comments','alice','POST',{post,body:'test comment'})).status,201);let c=(await call('/api/comments?post='+post,'bob')).data.comments[0];assert.equal(c.canEdit,false);assert.equal(c.canDelete,false);assert.equal((await call('/api/comments','bob','PATCH',{id:c.id,body:'bad edit'})).status,403);assert.equal((await call('/api/comments','bob','DELETE',{id:c.id})).status,403);assert.equal((await call('/api/comments','alice','PATCH',{id:c.id,body:'updated'})).status,200);assert.equal((await call('/api/comments','owner','DELETE',{id:c.id})).status,200);
assert.equal((await call('/api/content','owner','PUT',{kind:'journal',revision:1,item:{...journal,title:'수정 검증'}})).status,200);
assert.equal((await call('/api/content','owner','PUT',{kind:'journal',revision:1,item:journal})).status,409);
const investment={id:'qa-invest',title:'투자 검증',date:'2026-09',growthIndex:105,portfolio:[{symbol:'TEST',name:'검증',weight:100,returnRate:null,category:'주식'}],decisions:['판단'],review:'복기'};
assert.equal((await call('/api/content','owner','POST',{kind:'invest',revision:0,item:investment})).status,201);
assert.equal((await call('/api/content','owner','POST',{kind:'invest',revision:0,item:{...investment,id:'qa-invalid',portfolio:[{...investment.portfolio[0],weight:50}]}})).status,400);
const reordered=['photo','journal','invest','workout','timeline','settings','tools'];
assert.equal((await call('/api/home-order','alice','PUT',reordered)).status,200);
assert.deepEqual((await call('/api/home-order','alice')).data.order,reordered);
assert.equal((await call('/api/home-order','bob')).data.order[0],'workout');
assert.equal((await call('/api/home-order','alice','PUT',['photo','photo','invest','workout','timeline','settings','tools'])).status,400);
const form=new FormData();form.append('file',new File([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j5ioAAAAASUVORK5CYII=','base64')],'test.png',{type:'image/png'}));
const encoded=new Request('http://test.local/api/images',{method:'POST',body:form});
const upload=await mf.dispatchFetch('http://test.local/api/images',{method:'POST',headers:{'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'wnlth96@gmail.com','content-type':encoded.headers.get('content-type')},body:Buffer.from(await encoded.arrayBuffer())});
assert.equal(upload.status,201);const img=await upload.json();
assert.equal((await mf.dispatchFetch('http://test.local'+img.url)).status,401);
const delivered=await mf.dispatchFetch('http://test.local'+img.url,{headers:{'oai-authenticated-user-id':'alice','oai-authenticated-user-email':'alice@example.test'}});assert.equal(delivered.status,200);assert.equal(delivered.headers.get('content-type'),'image/png');
const photo={id:'qa-photo',title:'사진 검증',imageUrl:img.url,width:1,height:1,takenAt:'2026-09-21',location:'',description:'설명',category:'디테일',project:'',theme:'선과 구조',color:'무채색',tags:[],orientation:'landscape'};
assert.equal((await call('/api/content','owner','POST',{kind:'photo',revision:0,item:photo})).status,201);
assert.equal((await call('/api/data-backup','alice')).status,403);
const backup=await call('/api/data-backup','owner');assert.equal(backup.status,200);assert.equal(backup.data.format,'juhwan-personal-site-backup');assert.equal(backup.data.version,1);assert.equal(backup.data.data.investmentLedger.holdings[0].symbol,'DEMO');assert.ok(!JSON.stringify(backup.data).includes('encrypted_refresh_token'));
const restored=await call('/api/data-backup','owner','POST',backup.data);assert.equal(restored.status,200);assert.equal(restored.data.restored,true);
for(const path of ['/workout','/photo','/invest','/journal','/tools','/tools/json-formatter','/tools/code-diff','/tools/team-maker','/tools/compound-calculator','/manage','/manage/photo/new','/manage/journal/qa-journal','/manage/invest/qa-invest','/photo/qa-photo','/journal/qa-journal','/invest/qa-invest','/settings']){const page=await mf.dispatchFetch('http://test.local'+path,{headers:{'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'wnlth96@gmail.com'}});assert.equal(page.status,200,path);const html=await page.text();assert.ok(!html.includes('화면을 불러오지 못했습니다.'),path);}
const ownerInvest=await (await mf.dispatchFetch('http://test.local/invest',{headers:{'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'wnlth96@gmail.com'}})).text();
const guestInvest=await (await mf.dispatchFetch('http://test.local/invest',{headers:{'oai-authenticated-user-id':'alice','oai-authenticated-user-email':'alice@example.test'}})).text();
assert.ok(ownerInvest.includes('내 투자 원장'));
assert.ok(!guestInvest.includes('내 투자 원장'));
assert.ok(guestInvest.includes('투자 흐름'));
assert.ok(guestInvest.includes('금액과 수량은 비공개'));
assert.ok(guestInvest.includes('내 계좌 TWR 지수'));
assert.ok(guestInvest.includes('103.6'));
assert.ok(guestInvest.includes('월말 소감'));
assert.ok(guestInvest.includes('환율 영향을 따로 확인했다.'));
assert.ok(guestInvest.includes('물가와 고용 발표로 금리 민감도가 높아졌다.'));
assert.ok(!guestInvest.includes('속도보다 규칙'));
for(const html of [guestInvest]){assert.ok(!html.includes('12,345.67'));assert.ok(!html.includes('12,000,000'));assert.ok(!html.includes('123.456789'));assert.ok(!html.includes('123.4'));assert.ok(!html.includes('23.45678'));}
console.log('PASS: existing workout/comment checks, owner-only content CRUD, revision conflict, new-post comments, per-user icon order, R2 upload/read authentication, rendered editor/detail routes');
}finally{await mf.dispose();}
