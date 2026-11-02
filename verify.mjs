import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {questions,types,dimensions,calculate} from './docs/data.js';
assert.equal(questions.length,18);
for(let d=0;d<3;d++)assert.equal(questions.filter(q=>q.dimension===d).length,6);
for(let m=0;m<8;m++){
 const key=m.toString(2).padStart(3,'0');
 assert.equal(calculate(questions.map(q=>key[q.dimension]==='1'?3:0)).key,key);
 for(const field of ['name','subtitle','tags','intro','strength','friction','exercise'])assert.ok(types[key][field]);
}
for(let d=0;d<3;d++){
 const a=Array(18).fill(0),ids=questions.flatMap((q,i)=>q.dimension===d?[i]:[]);
 ids.slice(0,3).forEach(i=>a[i]=3);assert.equal(calculate(a).bits[d],0);
 a[ids[3]]=1;assert.equal(calculate(a).bits[d],1);
}
for(const bad of [[],Array(18).fill(null),Array(18).fill(4)])assert.throws(()=>calculate(bad));
const source=fs.readFileSync(new URL('./docs/app.js',import.meta.url),'utf8').replace(/^import .*;\n/,'');
let stored=null,handler,confirmValue=false,clipboardFails=false;
const app={innerHTML:'',addEventListener:(_,fn)=>handler=fn,querySelector:()=>({focus(){}})};
const status={textContent:'',classList:{add(){},remove(){}}};
const other={focus(){},scrollIntoView(){},addEventListener(){}};
function launch(){vm.runInNewContext(source,{questions,dimensions,calculate,document:{querySelector:s=>s==='#app'?app:s==='#toast'?status:other},localStorage:{getItem:()=>stored,setItem:(_,v)=>stored=v},window:{scrollTo(){},confirm:()=>confirmValue},navigator:{clipboard:{writeText:async()=>{if(clipboardFails)throw Error();}}},setTimeout:()=>1,clearTimeout(){}});}
const click=async(action,answer)=>handler({target:{closest:s=>s==='[data-answer]'?(answer===undefined?null:{dataset:{answer:String(answer)}}):(s==='[data-action]'?{dataset:{action}}:null)}});
launch();assert.match(app.innerHTML,/你在爱里/);await click('start');assert.match(app.innerHTML,/data-action="next" disabled/);
await click('next');assert.equal(JSON.parse(stored).index,0);
await click(null,3);await click('next');launch();assert.equal(JSON.parse(stored).index,1);assert.match(app.innerHTML,/理想的周末/);
await click('prev');assert.match(app.innerHTML,/aria-pressed="true"/);await click(null,0);await click('next');
for(let i=1;i<18;i++){await click(null,3);await click('next');}
assert.match(app.innerHTML,/演示价格，不实际收费/);assert.doesNotMatch(app.innerHTML,/class="full-report"/);
await click('unlock');assert.match(app.innerHTML,/已开启演示阅读 · 未收费/);launch();assert.match(app.innerHTML,/class="full-report"/);
await click('copy');assert.match(status.textContent,/已复制/);clipboardFails=true;await click('copy');assert.match(status.textContent,/复制失败/);
await click('restart');assert.equal(JSON.parse(stored).view,'result');confirmValue=true;await click('restart');assert.equal(JSON.parse(stored).unlocked,false);assert.ok(JSON.parse(stored).answers.every(v=>v===null));
stored='坏数据';launch();assert.match(app.innerHTML,/你在爱里/);
console.log('通过：计分边界、8类报告、未答拦截、返回修改、刷新恢复、演示解锁持久化、重新测试确认、复制成功与失败、损坏缓存恢复。');
