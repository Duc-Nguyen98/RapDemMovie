(function(root){
 'use strict';
 const overlap=(a,b)=>Date.parse(a.startsAt)<Date.parse(b.endsAt)&&Date.parse(b.startsAt)<Date.parse(a.endsAt);
 function bookingConflicts(candidate,rows){return rows.filter(r=>r.id!==candidate.id&&r.status==='confirmed'&&overlap(candidate,r)&&candidate.placementIds.some(p=>r.placementIds.includes(p)));}
 function chooseAd({enabled=true,reservations=[],campaigns=[],assignments=[],creatives=[],slotId,device,at,random=0.5}){
  if(!enabled)return {status:'no_fill',reason:'disabled'};
  const time=Date.parse(at);const within=x=>Date.parse(x.startsAt)<=time&&time<Date.parse(x.endsAt);
  const reserved=reservations.filter(r=>r.status==='confirmed'&&r.placementIds.includes(slotId)&&within(r));
  if(reserved.length>1)return {status:'no_fill',reason:'booking_conflict'};
  function eligible(mode,campaignId){return assignments.filter(a=>a.enabled&&a.placementId===slotId).map(a=>({a,c:campaigns.find(c=>c.id===a.campaignId),v:creatives.find(v=>v.id===a.creativeId)})).filter(({a,c,v})=>c&&v&&c.status==='active'&&c.mode===mode&&within(c)&&c.deviceClasses.includes(device)&&v.status==='approved'&&v.campaignId===c.id&&(!campaignId||c.id===campaignId));}
  function select(list){const sorted=[...list].sort((x,y)=>x.a.id.localeCompare(y.a.id));const sum=sorted.reduce((v,x)=>v+x.a.weight,0);let cursor=Math.max(0,Math.min(0.999999999,random))*sum;for(const x of sorted){cursor-=x.a.weight;if(cursor<0)return x;}return sorted.at(-1);}
  if(reserved.length){const r=reserved[0];let hit=select(eligible('exclusive',r.campaignId));if(hit)return {status:'filled',mode:'exclusive',creativeId:hit.v.id};if(r.fallback==='approved_house'){hit=select(eligible('house'));if(hit)return {status:'filled',mode:'house',creativeId:hit.v.id};}return {status:'no_fill',reason:'reserved_no_fill'};}
  const shared=select(eligible('shared'));if(shared)return {status:'filled',mode:'shared',creativeId:shared.v.id};const house=select(eligible('house'));return house?{status:'filled',mode:'house',creativeId:house.v.id}:{status:'no_fill',reason:'no_eligible'};
 }
 const transitions={movie:{draft:['in_review'],in_review:['draft','approved'],approved:['draft']},campaign:{draft:['in_review'],in_review:['draft','approved'],approved:['scheduled','active'],scheduled:['active','paused','ended'],active:['paused','ended','blocked'],paused:['active','ended','blocked'],blocked:[],ended:[]},report:{new:['triaged'],triaged:['in_progress'],in_progress:['resolved'],resolved:['closed','in_progress'],closed:['in_progress']}};
 function transition(kind,from,to){return !!transitions[kind]?.[from]?.includes(to);}
 function validateMovie(m){const e={};if(!m.title?.trim())e.title='Nhập tên phim.';if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.slug||''))e.slug='Slug chỉ dùng chữ thường không dấu, số và dấu gạch nối.';if(!Number.isInteger(+m.year)||+m.year<1888||+m.year>2031)e.year='Năm phải từ 1888 đến 2031 (mốc demo 2026).';return e;}
 root.RapDemRules={overlap,bookingConflicts,chooseAd,transition,validateMovie};
})(typeof window==='undefined'?globalThis:window);
