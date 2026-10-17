(function(root){
  'use strict';
  const W=48,H=48,FRY=3,HUNTER=4;
  // Eligibility belongs to artwork, never to a randomly assigned food-web role.
  const predators=new Set(['large ocean fish','silver spearfish','copper moray','reef shark']);
  const bottomNames=new Set(['shore crab','reef lobster','peacock mantis shrimp']);
  const preyNames=new Set(['tiny fish','little triangular fish','reef fish','box fish']);
  const interval=(rng,min,max)=>Math.round((min+rng()*(max-min))*1000/350);
  function setup(w,art=[],options={}){
    const font=options.font||16,advance=options.advance||9.6;
    w.view={width:options.width||1280,height:options.height||400};
    w.profiles=art.map((s,index)=>{
      const width=Math.ceil(Math.max(...s.rows.map(r=>r.length))*advance),height=s.rows.length*font;
      const points=[];
      s.masks.forEach((row,y)=>[...row].forEach((c,x)=>{if(c==='5')points.push({x:(x+.5)*advance,y:(y+.5)*font});}));
      points.sort((a,b)=>index%2?a.x-b.x:b.x-a.x);
      return {name:s.name,width,height,footInset:options.footInsets?.[index]||0,mouth:points[0]||{x:width/2,y:height/2}};
    });
    w.life={quiet:!!options.quiet,nextEncounter:interval(w.rng,120,240),nextDiver:interval(w.rng,300,600),
      encounter:null,diver:null,bubbles:[],lastOutcome:null,overlaps:new Map()};
    w.ocean={elapsed:0,clockMode:options.clockMode==='local'?'local':'cycle',localHour:12,light:1,
      nextSchool:interval(w.rng,60,120),nextDiscovery:interval(w.rng,300,600),discovery:null};
    for(const f of w.fish)f.kind=w.profiles[f.design*2]?.name==='yellow submarine'?0:predators.has(w.profiles[f.design*2]?.name)?HUNTER:FRY;
    // Keep the microscopic grid consistent with the new design-based roles.
    for(let i=0;i<w.cells.length;i++)if(w.cells[i]===FRY||w.cells[i]===HUNTER)w.cells[i]=0;
    for(const f of w.fish)w.cells[Math.floor(f.y)*W+Math.floor(f.x)]=f.kind;
  }
  function profile(w,f){return w.profiles[f.design*2+(f.right?0:1)];}
  function setClockMode(w,mode){w.ocean.clockMode=mode==='local'?'local':'cycle';}
  function advanceOcean(w,elapsedMs){
    const o=w.ocean;o.elapsed+=Math.max(0,Number.isFinite(elapsedMs)?elapsedMs:350);
    const phase=o.clockMode==='local'?o.localHour/24:(o.elapsed/1200000+.5)%1;
    o.light=.5+.5*Math.cos((phase-.5)*2*Math.PI);
    if(!o.discovery&&!w.life.encounter&&!w.life.diver&&w.tick>=o.nextDiscovery){
      const right=w.rng()<.5;
      o.discovery={type:w.rng()<.5?'whale':'glow',right,x:right?-24:72,y:9,age:0};
    }
    if(o.discovery){const d=o.discovery;d.age++;
      if(d.type==='whale')d.x+=(d.right?1:-1)*.16;
      if(d.type==='whale'?(d.x<-24||d.x>72):d.age>=86){o.discovery=null;o.nextDiscovery=w.tick+interval(w.rng,300,600);}
    }
  }
  function moveCreature(w,f){
    const e=w.life.encounter;if(e&&(f.id===e.hunterId||f.id===e.preyId))return;
    const name=profile(w,f)?.name;f.age=(f.age||0)+1;f.baseY??=f.y;
    if(f.school){
      const threat=w.fish.find(h=>h.kind===HUNTER&&Math.abs(h.x-f.x)<8);
      const spread=threat?(f.schoolLane-1)*3:0;
      const target=f.baseY+spread+Math.sin(f.age*.055)*.3;
      f.y+=Math.max(-.18,Math.min(.18,target-f.y));
    }else if(name==='moon jellyfish'){
      f.y=Math.max(8,f.baseY-f.age*.025+Math.sin(f.age*.16)*.3);
    }else if(name==='violet kite ray')f.y=f.baseY+Math.sin(f.age*.035)*1.5;
    else if(name==='sea turtle'){
      const surfacing=f.age>=100&&f.age<180;
      const target=surfacing?8:f.baseY;f.y+=Math.max(-.15,Math.min(.15,target-f.y));
    }else if(name==='violet octopus'){
      const col=Math.max(0,Math.min(W-1,Math.floor(f.x)));
      const target=w.floor[col]-9;f.y+=Math.max(-.2,Math.min(.2,target-f.y));
    }else if(bottomNames.has(name)){
      const b=box(w,f);f.y=(b.top+b.height/2)/(w.view.height/H);
    }else if(name==='humpback whale')f.y=f.baseY+Math.sin(f.age*.018)*.7;
    else if(name==='yellow submarine')f.y=f.baseY;
    f.y=Math.max(5,Math.min(H-5,f.y));
  }
  function addSchool(w,reserve=0){
    const o=w.ocean;if(w.tick<o.nextSchool||w.life.encounter||w.fish.length>5-reserve)return false;
    const choices=[];for(let i=0;i<w.designCount;i++)if(['tiny fish','little triangular fish'].includes(w.profiles[i*2]?.name))choices.push(i);
    if(!choices.length){o.nextSchool=w.tick+interval(w.rng,60,120);return false;}
    const design=choices[Math.floor(w.rng()*choices.length)],right=w.rng()<.5,y=12+w.rng()*12;
    const group=w.nextFishId,speed=.24+w.rng()*.08;
    for(let lane=0;lane<3;lane++)w.fish.push({id:w.nextFishId++,kind:FRY,design,right,x:right?-10-lane*2:W+10+lane*2,y:y+lane*.8,speed,school:group+1,schoolLane:lane});
    o.nextSchool=w.tick+interval(w.rng,60,120);return true;
  }
  function startParade(w){
    if(w.parade)return false;
    const margin=10;
    // Increase only the showcase pace as its collection grows, keeping at most eight entries.
    const speed=Math.max(.8,(W+2*margin)*350*(w.designCount+7)/(8*118000)*1.05);
    const travelMs=(W+2*margin)/speed*350;
    w.parade={elapsed:0,duration:120000,speed,margin,travelMs,
      spacing:w.designCount>1?(120000-travelMs-2000)/(w.designCount-1):0,fish:[]};
    advanceParade(w,0);
    return true;
  }
  function advanceParade(w,elapsedMs=350){
    const p=w.parade;
    if(!p)return;
    if(!Number.isFinite(elapsedMs)||elapsedMs<0)throw Error('Invalid parade elapsed time');
    p.elapsed=Math.min(p.duration,p.elapsed+elapsedMs);
    if(p.elapsed>=p.duration){w.parade=null;return;}
    p.fish=[];
    for(let design=0;design<w.designCount;design++){
      const age=p.elapsed-design*p.spacing;
      if(age<0||age>p.travelMs)continue;
      p.fish.push({id:'parade-'+design,design,kind:FRY,right:true,
        x:-p.margin+p.speed*age/350,y:7+(design%4)*8,speed:p.speed});
    }
  }
  function box(w,f){
    const p=profile(w,f),cx=w.view.width/W,cy=w.view.height/H;
    const width=p?.width||80,height=p?.height||48,left=f.x*cx-width/2;
    const first=Math.min(W-1,Math.max(0,Math.floor(left/cx)));
    const last=Math.max(first+1,Math.min(W,Math.ceil((left+width)/cx)+1));
    const floor=Math.min(...w.floor.slice(first,last))*cy;
    const bottom=bottomNames.has(p?.name);
    return {left,top:Math.max(8,bottom?floor-height-2+(p.footInset||0):Math.min(floor-height-8,f.y*cy-height/2)),width,height};
  }
  function mouth(w,f){const b=box(w,f),p=profile(w,f);return {x:b.left+(p?.mouth.x||b.width/2),y:b.top+(p?.mouth.y||b.height/2)};}
  function finish(w,result){
    const e=w.life.encounter;
    if(e)w.life.lastOutcome={type:result,tick:w.tick,preyId:e.preyId};
    w.life.encounter=null;w.life.nextEncounter=w.tick+interval(w.rng,120,240);
  }
  function setQuiet(w,value){w.life.quiet=!!value;if(value&&w.life.encounter)finish(w,'cancelled');}
  function startEncounter(w){
    const candidates=[],small=[];
    for(let i=0;i<w.designCount;i++){
      const name=w.profiles[i*2]?.name;
      if(predators.has(name))candidates.push(i);
      if(preyNames.has(name))small.push(i);
    }
    if(!candidates.length||!small.length||w.fish.length>6)return false;
    const design=candidates[Math.floor(w.rng()*candidates.length)],preyDesign=small[Math.floor(w.rng()*small.length)];
    const right=w.rng()<.5,dir=right?1:-1,y=12+w.rng()*8;
    const prey={id:w.nextFishId++,kind:FRY,design:preyDesign,right,x:right?-10:W+10,y,speed:.26};
    const hunter={id:w.nextFishId++,kind:HUNTER,design,right,x:prey.x-dir*8,y,speed:.26};
    const p=profile(w,hunter);
    hunter.y+=(p.height/2-p.mouth.y)/(w.view.height/H);
    w.fish.push(hunter,prey);
    w.life.encounter={hunterId:hunter.id,preyId:prey.id,phase:'entering',age:0,catchAllowed:w.rng()<.2};
    return true;
  }
  function cruiseTargets(w){
    const targets=new Map(),pairs=w.life.overlaps,seen=new Set(),e=w.life.encounter;
    const eligible=f=>!f.school&&!(e&&(f.id===e.hunterId||f.id===e.preyId));
    for(let i=0;i<w.fish.length;i++)for(let j=i+1;j<w.fish.length;j++){
      const a=w.fish[i],b=w.fish[j];
      if(!eligible(a)||!eligible(b)||a.right!==b.right)continue;
      const ab=box(w,a),bb=box(w,b);
      const dx=Math.min(ab.left+ab.width,bb.left+bb.width)-Math.max(ab.left,bb.left);
      const dy=Math.min(ab.top+ab.height,bb.top+bb.height)-Math.max(ab.top,bb.top);
      const key=a.id<b.id?a.id+':'+b.id:b.id+':'+a.id;
      const old=pairs.get(key);
      // Release only after a little daylight appears between the drawings.
      if(old?.active&&dx>-24&&dy>0){seen.add(key);}
      else if(dx>Math.min(ab.width,bb.width)*.4&&dy>Math.min(ab.height,bb.height)*.4&&
        Math.abs((a.velocity??a.speed)-(b.velocity??b.speed))<.09){
        seen.add(key);
        const pair=old||{ticks:0,active:false};pair.ticks++;
        if(pair.ticks>=8&&!pair.active){
          pair.active=true;
          pair.front=((a.x-b.x)*(a.right?1:-1)>=0)?a.id:b.id;
        }
        pairs.set(key,pair);
      }else continue;
      const pair=pairs.get(key);
      if(pair?.active)for(const f of [a,b]){
        const speed=f.id===pair.front?Math.max(f.speed*1.35,f.speed+.12):Math.max(.06,f.speed-.06);
        // A swimmer between two neighbors keeps the faster target, avoiding a tug of war.
        targets.set(f.id,Math.max(targets.get(f.id)||0,speed));
      }
    }
    for(const key of pairs.keys())if(!seen.has(key))pairs.delete(key);
    return targets;
  }
  function before(w){
    const l=w.life;
    if(!l.quiet&&!l.encounter&&!l.diver&&!w.ocean.discovery&&w.tick>=l.nextEncounter)startEncounter(w);
    let e=l.encounter;
    if(e){
      const h=w.fish.find(f=>f.id===e.hunterId),p=w.fish.find(f=>f.id===e.preyId);
      if(!h||!p){finish(w,'escape');e=null;}
      else if(e.phase==='entering'&&h.x>7&&h.x<W-7&&p.x>7&&p.x<W-7){e.phase='chasing';e.age=0;}
    }
    const cruise=cruiseTargets(w);
    for(const f of w.fish){
      let speed=cruise.get(f.id)??f.speed;
      if(e?.phase==='chasing'){
        if(f.id===e.preyId)speed=e.catchAllowed?.72:.84;
        if(f.id===e.hunterId)speed=e.catchAllowed?.98:.72;
      }
      if(e?.phase==='feeding'&&(f.id===e.hunterId||f.id===e.preyId))speed=.06;
      const chasing=e?.phase==='chasing'&&(f.id===e.preyId||f.id===e.hunterId);
      const acceleration=chasing?.06:.04;
      f.velocity=(f.velocity??f.speed)+Math.max(-.04,Math.min(acceleration,speed-(f.velocity??f.speed)));
    }
  }
  function after(w){
    const l=w.life,e=l.encounter;
    if(e){
      const h=w.fish.find(f=>f.id===e.hunterId),p=w.fish.find(f=>f.id===e.preyId);
      if(!h||!p)finish(w,'escape');
      else if(e.phase==='chasing'){
        e.age++;
        const m=mouth(w,h),b=box(w,p),target={x:b.left+b.width/2,y:b.top+b.height/2};
        const gap=(target.x-m.x)*(h.right?1:-1);
        // Align using the exact displayed mouth and prey center, including floor clamping.
        h.y+=Math.max(-.2,Math.min(.2,(target.y-m.y)/(w.view.height/H)));
        const aligned=mouth(w,h);
        if(e.catchAllowed&&gap<=8&&gap>=-12&&Math.abs(target.y-aligned.y)<5&&target.x>100&&target.x<w.view.width-100){
          e.phase='feeding';e.age=0;e.contact={mouth:aligned,prey:target};
        }else if(e.age>=28||h.x<4||h.x>W-4||p.x<4||p.x>W-4)finish(w,'escape');
      }else if(e.phase==='feeding'){
        e.age++;
        if(e.age===7){w.fish=w.fish.filter(f=>f.id!==e.preyId);finish(w,'catch');h.velocity=.06;}
      }
    }
    // A diver is a rare visitor, separate from the eight-fish population.
    if(!l.diver&&!l.encounter&&!w.ocean.discovery&&w.tick>=l.nextDiver){
      const right=w.rng()<.5;l.diver={x:right?-10:W+10,y:7+w.rng()*5,right,age:0};
    }
    if(l.diver){
      const d=l.diver;d.x+=(d.right?1:-1)*.2;d.age++;
      if(d.age%12===0&&d.x>0&&d.x<W&&l.bubbles.length<5)l.bubbles.push({x:d.x,y:d.y-1,age:0});
      if(d.x<-10||d.x>W+10){l.diver=null;l.nextDiver=w.tick+interval(w.rng,300,600);}
    }
    for(const b of l.bubbles){b.age++;b.y-=.23;b.x-=.025;}
    l.bubbles=l.bubbles.filter(b=>b.age<20&&b.y>0);
  }
  function displayBox(w,f){
    const e=w.life.encounter;
    if(e?.phase==='feeding'&&e.preyId===f.id){
      const h=w.fish.find(x=>x.id===e.hunterId),m=mouth(w,h),b=box(w,f),scale=Math.max(.08,1-e.age/7);
      return {left:m.x-b.width*scale/2,top:m.y-b.height*scale/2,width:b.width*scale,height:b.height*scale};
    }
    return box(w,f);
  }
  root.OceanLife={setup,profile,box,mouth,displayBox,before,after,setQuiet,predators,startParade,advanceParade,
    advanceOcean,moveCreature,addSchool,setClockMode};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.OceanLife;
})(typeof globalThis!=='undefined'?globalThis:this);
