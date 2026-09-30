const assert = require('node:assert/strict');
const {QUESTIONS, PATHWAYS, rankPathways} = require('./dist/data.js');
assert.equal(QUESTIONS.length, 16);
assert.equal(PATHWAYS.length, 22);
assert.equal(new Set(PATHWAYS.map(p=>p.id)).size,22);
assert.equal(new Set(PATHWAYS.map(p=>p.profile.join(''))).size,22);
QUESTIONS.forEach(q=>{
  assert.equal(q.options.length,4);
  q.options.forEach(o=>{assert.equal(o.length,3);o.forEach(t=>assert.ok(t.length>0));});
  q.pairs.forEach((p,i)=>{assert.notEqual(p,i);assert.equal(q.pairs[p],i);});
});
for(const p of PATHWAYS){
  const results=rankPathways(p.profile);
  assert.equal(results[0].path.id,p.id,`${p.name} must be reachable`);
  assert.equal(results[0].score,100);
  assert.ok(results[0].raw>results[1].raw,`${p.name} must have a unique ideal profile`);
}
for(const input of [[],Array(16),Array(16).fill(null),Array(16).fill(4),Array(16).fill(-1),Array(16).fill('0'),null])assert.throws(()=>rankPathways(input));
let seed=78123,ties=0;
for(let n=0;n<1000;n++){
  const answers=Array.from({length:16},()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed>>>30;});
  const ranked=rankPathways(answers);
  assert.deepEqual(ranked,rankPathways(answers));
  ranked.forEach(r=>assert.ok(Number.isFinite(r.score)&&r.score>=0&&r.score<=100));
  assert.ok(ranked[0].matches.length>0);
  if(ranked[0].raw===ranked[1].raw&&ranked[0].matches.length===ranked[1].matches.length)ties++;
}
console.log(`PASS: 16 questions; all 22 pathways uniquely reachable; invalid inputs rejected; 1000 deterministic answer sets; ${ties} tie cases checked.`);
