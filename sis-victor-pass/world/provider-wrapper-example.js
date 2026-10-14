#!/usr/bin/env node
'use strict';
const readline=require('readline');
const {WorldAdapter}=require('./adapter-client');

const args=process.argv.slice(2);
const take=(flag,fallback)=>{const i=args.indexOf(flag);return i>=0&&args[i+1]!==undefined?args[i+1]:fallback};
const adapter=new WorldAdapter({
  baseUrl:take('--url','http://127.0.0.1:4174'),
  name:take('--name','provider wrapper'),
  provider:take('--provider','external-wrapper'),
  capabilities:['inspect','map','route']
});
const out=value=>process.stdout.write(JSON.stringify(value)+'\n');
const allowedActions=new Set(['schema','bodies','agents','status','task','message','events','disconnect']);

(async()=>{
  await adapter.register();
  out({ready:true,agentId:adapter.agentId,provider:adapter.provider});
  let cursor=null;
  const rl=readline.createInterface({input:process.stdin,crlfDelay:Infinity});
  for await(const line of rl){
    if(!line.trim())continue;
    let request;
    try{request=JSON.parse(line)}catch(e){out({ok:false,error:'invalid JSON'});continue}
    if(typeof request.action!=='string'||!allowedActions.has(request.action)){out({ok:false,error:'unsupported action'});continue}
    try{
      if(request.action==='schema')out({ok:true,result:await adapter.schema()});
      else if(request.action==='bodies')out({ok:true,result:await adapter.bodies()});
      else if(request.action==='agents')out({ok:true,result:await adapter.agents()});
      else if(request.action==='status')out({ok:true,result:await adapter.status(request.state,request.note||'')});
      else if(request.action==='task'){
        if(typeof request.bodyId!=='string'||typeof request.objective!=='string'){out({ok:false,error:'bodyId and objective are required'});continue}
        out({ok:true,result:await adapter.submitTask(request.bodyId,request.objective,{inputRefs:Array.isArray(request.inputRefs)?request.inputRefs:undefined,timeoutMs:request.timeoutMs})});
      }else if(request.action==='message'){
        if(typeof request.text!=='string'){out({ok:false,error:'text is required'});continue}
        out({ok:true,result:await adapter.sendMessage(request.text,request.channel||'work-floor')});
      }else if(request.action==='events'){
        const result=await adapter.events(request.after||cursor,Math.min(Math.max(Number(request.limit)||50,1),50));
        cursor=result.nextAfter||result.latest||cursor;
        out({ok:true,result});
      }else if(request.action==='disconnect'){
        out({ok:true,result:await adapter.disconnect()});
        rl.close();
        break;
      }
    }catch(error){out({ok:false,error:error.message,status:error.status||500})}
  }
  if(adapter.agentId)await adapter.disconnect();
})().catch(error=>{out({ok:false,error:error.message});process.exit(1)});
