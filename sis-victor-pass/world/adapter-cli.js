#!/usr/bin/env node
const {WorldAdapter}=require('./adapter-client');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const args=process.argv.slice(2);
const take=(flag,fallback)=>{const i=args.indexOf(flag);return i>=0&&args[i+1]!==undefined?args[i+1]:fallback};
const action=args[0]||'schema';
const baseUrl=take('--url','http://127.0.0.1:4174');
const name=take('--name','world-cli agent');
const provider=take('--provider','local-mock');
const adapter=new WorldAdapter({baseUrl,name,provider,capabilities:['inspect','map','message']});
const output=value=>process.stdout.write(JSON.stringify(value,null,2)+'\n');
(async()=>{
  if(action==='schema') return output(await adapter.schema());
  if(action==='bodies') return output(await adapter.bodies());
  if(action==='agents') return output(await adapter.agents());
  if(action==='replay') return output(await adapter.replay());
  await adapter.register();
  try{
    if(action==='cancel'){const id=take('--task');if(!id)throw new Error('--task is required for cancel');return output(await adapter.cancelTask(id))}
    if(action==='status'){const state=take('--state','working');const note=take('--note','');return output(await adapter.status(state,note))}    if(action==='message'){
      const text=take('--text','status from adapter cli');
      return output(await adapter.sendMessage(text,take('--channel','work-floor')));
    }
    if(action==='run'){
      const bodyId=take('--body','ORCHARD-01');
      const objective=take('--objective','map mock sector');
      const queued=await adapter.submitTask(bodyId,objective,{timeoutMs:1000});
      let current=queued;
      for(let i=0;i<20;i++){
        current=await adapter.task(queued.task.id);
        if(['completed','failed','blocked'].includes(current.task.state))break;
        await sleep(100);
      }
      return output(current);
    }
    throw new Error('unknown action; use schema, bodies, agents, run, message, status, cancel, or replay');
  }finally{await adapter.disconnect()}
})().catch(error=>{console.error(error.message);process.exit(1)});
