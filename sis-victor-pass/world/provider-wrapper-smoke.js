#!/usr/bin/env node
'use strict';
const {spawnSync}=require('child_process');
const assert=(condition,message)=>{if(!condition)throw new Error(message)};
const input=[
  {action:'agents'},
  {action:'status',state:'working',note:'conformance'},
  {action:'message',text:'conformance message',channel:'test'},
  {action:'disconnect'}
].map(value=>JSON.stringify(value)).join('\n')+'\n';
const run=spawnSync(process.execPath,['provider-wrapper-example.js','--provider','conformance'],{cwd:__dirname,input,encoding:'utf8'});
assert(run.status===0,run.stderr||'wrapper exited nonzero');
const rows=run.stdout.trim().split(/\n+/).map(line=>JSON.parse(line));
assert(rows[0].ready===true,'ready handshake missing');
assert(rows.some(row=>row.ok&&row.result&&row.result.agents),'agent roster response missing');
assert(rows.some(row=>row.ok&&row.result&&row.result.agent&&row.result.agent.status==='working'),'status response missing');
assert(rows.some(row=>row.ok&&row.result&&row.result.message),'message response missing');
assert(rows.some(row=>row.ok&&row.result&&row.result.ok),'disconnect response missing');
console.log(JSON.stringify({ok:true,lines:rows.length,provider:'conformance'}));
