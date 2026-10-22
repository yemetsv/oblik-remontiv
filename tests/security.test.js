import test from 'node:test';
import assert from 'node:assert/strict';
import {Coordinator,hashPassword} from '../worker/index.js';
import {fields} from '../src/model.js';

async function setup(){
 const salt='YWJj';const hash=await hashPassword('test-password',salt);
 const accounts=[{login:'Техносмарт',salt,hash},{login:'Vodafone',salt,hash},{login:'Менеджер',role:'manager',salt,hash}];
 const env={SESSION_SECRET:'test-secret',USERS_JSON:JSON.stringify(accounts)};
 const store=new Map();const obj=new Coordinator({storage:{get:async k=>store.get(k),put:async(k,v)=>store.set(k,v),delete:async k=>store.delete(k)}},env);
 const base={createdAt:new Date().toISOString(),client:'Test',phone:'123',device:'Phone',serial:'',issue:'Broken',status:'Прийнято',master:'Техносмарт',cost:100,paid:0,notes:'',updatedAt:'',updatedBy:'',version:1};
 const repairs=[{...base,id:'aaaa',branch:'Техносмарт'},{...base,id:'bbbb',branch:'Vodafone'},{...base,id:'cccc',branch:''}];
 let values=[fields,...repairs.map(r=>fields.map(f=>r[f]))];obj.ensureColumns=async()=>{};
 obj.sheet=async(range,method,body)=>{if(!method)return{values:structuredClone(values)};if(method==='POST')values.push(body.values[0]);else values[Number(range.match(/\d+/)[0])-1]=body.values[0];return{};};
 const call=(path,token,method='GET',data)=>obj.fetch(new Request('https://test'+path,{method,headers:{Authorization:'Bearer '+token},...(data?{body:JSON.stringify(data)}:{})}));
 const login=async name=>{const r=await call('/auth/login','', 'POST',{login:name,password:'test-password'});assert.equal(r.status,200);return(await r.json()).token;};
 return{obj,env,accounts,store,call,login,repairs};
}
test('points cannot read, modify or move another point repair; manager can',async()=>{
 const {call,login,repairs}=await setup();const tech=await login('Техносмарт'),vodafone=await login('Vodafone'),manager=await login('Менеджер');
 for(const[token,id]of [[tech,'aaaa'],[vodafone,'bbbb']]){const data=await(await call('/api/repairs',token)).json();assert.deepEqual(data.rows.map(r=>r.id),[id]);}
 assert.equal((await call('/api/repairs/bbbb',tech,'PUT',repairs[1])).status,404);
 assert.equal((await call('/api/repairs/cccc',tech,'PUT',repairs[2])).status,404);
 assert.equal((await call('/api/repairs/aaaa',tech,'PUT',{...repairs[0],branch:'Vodafone'})).status,403);
 assert.equal((await call('/api/repairs',tech,'POST',{...repairs[0],branch:'Vodafone'})).status,403);
 assert.equal((await call('/api/repairs/aaaa',tech,'PUT',{...repairs[0],role:'manager',branch:'Vodafone'})).status,403);
 const all=await(await call('/api/repairs',manager)).json();assert.equal(all.rows.length,3);
 assert.equal((await call('/api/repairs/cccc',manager,'PUT',{...repairs[2],branch:'Vodafone'})).status,200);
});
test('logout revokes token; logout-all revokes all own sessions only',async()=>{
 const {call,login}=await setup();const a=await login('Техносмарт'),b=await login('Техносмарт'),other=await login('Vodafone');
 assert.equal((await call('/auth/logout',a,'POST')).status,200);
 assert.equal((await call('/api/repairs',a)).status,401);
 assert.equal((await call('/api/repairs',b)).status,200);
 assert.equal((await call('/auth/logout-all',b,'POST')).status,200);
 assert.equal((await call('/api/repairs',b)).status,401);
 assert.equal((await call('/api/repairs',other)).status,200);
 assert.equal((await call('/api/repairs',await login('Техносмарт'))).status,200);
});
test('legacy, tampered, expired and changed-credential sessions are rejected',async()=>{
 const {call,login,env,accounts,store}=await setup();const token=await login('Техносмарт');
 assert.equal((await call('/api/repairs',token+'.bad')).status,401);
 const [key,entry]=[...store].find(([k])=>k.startsWith('session:'));store.set(key,{...entry,exp:0});
 assert.equal((await call('/api/repairs',token)).status,401);
 const fresh=await login('Техносмарт');accounts[0].hash='changed';env.USERS_JSON=JSON.stringify(accounts);
 assert.equal((await call('/api/repairs',fresh)).status,401);
});
