const assert=(condition,message)=>{if(!condition)throw new Error(message)};
const {WorldAdapter}=require('./adapter-client');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
// Focused contract check for the body/agent detail panel in index.html.
// The panel reads: GET /api/bodies (id,class,label,state,capabilities,parts),
// GET /api/agents (id,name), and GET /api/replay (tasks[] joined by bodyId/agentId).
(async()=>{
  const adapter=new WorldAdapter({name:'detail-smoke',provider:'local-mock',capabilities:['map','inspect','route','message']});
  const schema=await adapter.schema();
  assert(schema.version,'schema version missing');
  const catalog=await adapter.bodies();
  assert(Array.isArray(catalog.bodies)&&catalog.bodies.length>0,'body catalog empty');
  for(const b of catalog.bodies){
    assert(typeof b.id==='string'&&b.id,'body id missing');
    assert(typeof b.class==='string'&&b.class,'body class/role missing');
    assert(typeof b.label==='string'&&b.label,'body label missing');
    assert(typeof b.state==='string'&&b.state,'body state missing');
    assert(Array.isArray(b.capabilities)&&b.capabilities.length>0,'body capabilities missing');
  }
  const agent=await adapter.register();
  assert(agent.id,'agent id missing');
  const body=catalog.bodies.find(item=>item.capabilities.includes('map'));
  assert(body&&body.id,'map-capable body missing for detail summary');
  const queued=await adapter.submitTask(body.id,'map mock sector');
  assert(queued.task&&queued.task.id,'task id missing');
  let current;
  for(let i=0;i<20;i++){
    current=await adapter.task(queued.task.id);
    if(current.task.state==='completed'||current.task.state==='failed')break;
    await sleep(100);
  }
  assert(current.task.state==='completed','task did not complete');
  const replay=await adapter.replay();
  const mine=replay.tasks.filter(item=>item.bodyId===body.id);
  assert(mine.some(item=>item.id===queued.task.id),'task not linked to selected body in replay');
  assert(mine.every(item=>typeof item.agentId==='string'&&item.agentId),'task missing agent link');
  assert(mine.some(item=>item.agentId===agent.id),'agent not linked to selected-body task');
  assert(new Set(replay.tasks.map(item=>item.id)).size===replay.tasks.length,'duplicate task ids in replay');
  const after=await adapter.bodies();
  const selected=after.bodies.find(item=>item.id===body.id);
  assert(selected&&typeof selected.state==='string','selected body state missing after task');
  await adapter.disconnect();
  console.log(JSON.stringify({ok:true,bodies:catalog.bodies.length,selected:body.id,state:current.task.state,linkedTasks:mine.length,agents:new Set(mine.map(item=>item.agentId)).size}));
})().catch(error=>{console.error(error.message);process.exit(1)});
