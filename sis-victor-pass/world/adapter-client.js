const http=require('http');
class WorldAdapter{
 constructor(options={}){
  this.baseUrl=options.baseUrl||'http://127.0.0.1:4174';
  this.name=String(options.name||'unnamed agent').slice(0,64);
  this.provider=String(options.provider||'local-mock').slice(0,32);
  this.capabilities=Array.isArray(options.capabilities)?options.capabilities.slice(0,12):[];
  this.agentId=null;
 }
 async request(path,method='GET',body){
  const u=new URL(path,this.baseUrl);
  const payload=body===undefined?undefined:JSON.stringify(body);
  return new Promise((resolve,reject)=>{
   const req=http.request(u,{method,headers:payload?{'content-type':'application/json','content-length':Buffer.byteLength(payload)}:{}},res=>{
    let text='';res.on('data',c=>text+=c);res.on('end',()=>{let data;try{data=JSON.parse(text)}catch(e){return reject(Error('invalid world response'))}if(res.statusCode<200||res.statusCode>=300)return reject(Object.assign(Error(data.error||'world request failed'),{status:res.statusCode,data}));resolve(data)})});
   req.on('error',reject);if(payload)req.write(payload);req.end();
  });
 }
 async agents(){return this.request('/api/agents')}
 async register(){const r=await this.request('/api/agents','POST',{name:this.name,provider:this.provider,capabilities:this.capabilities});this.agentId=r.agent.id;return r.agent}
 async status(state,note=''){if(!this.agentId)throw Error('register the adapter first');return this.request('/api/agents/'+encodeURIComponent(this.agentId)+'/status','POST',{status:state,note})} async schema(){return this.request('/api/schema')}
 async bodies(){return this.request('/api/bodies')}
 async submitTask(bodyId,objective,options={}){if(!this.agentId)throw Error('register the adapter first');return this.request('/api/tasks','POST',{agentId:this.agentId,bodyId,objective,inputRefs:options.inputRefs,timeoutMs:options.timeoutMs})}
 async task(id){return this.request('/api/tasks/'+encodeURIComponent(id))}
 async cancelTask(id){if(!this.agentId)throw Error('register the adapter first');return this.request('/api/tasks/'+encodeURIComponent(id)+'/cancel','POST',{agentId:this.agentId})}
 async messages(){return this.request('/api/messages')}
 async sendMessage(text,channel='general'){if(!this.agentId)throw Error('register the adapter first');return this.request('/api/messages','POST',{agentId:this.agentId,text,channel})}
 async events(after=null,limit=50){const q=new URLSearchParams();if(after)q.set('after',after);q.set('limit',String(limit));return this.request('/api/events?'+q.toString())}
 async replay(){return this.request('/api/replay')}
 async disconnect(){if(!this.agentId)return {ok:true};const r=await this.request('/api/agents/'+encodeURIComponent(this.agentId)+'/disconnect','POST');this.agentId=null;return r}
}
module.exports={WorldAdapter};
