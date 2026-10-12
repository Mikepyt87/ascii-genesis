(function(root){
  'use strict';
  const W=48,H=48,FRY=3,HUNTER=4;
  // Eligibility belongs to artwork, never to a randomly assigned food-web role.
  const predators=new Set(['large ocean fish','silver spearfish','copper moray']);
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
      return {name:s.name,width,height,mouth:points[0]||{x:width/2,y:height/2}};
    });
    w.life={quiet:!!options.quiet,nextEncounter:interval(w.rng,120,240),nextDiver:interval(w.rng,300,600),
      encounter:null,diver:null,bubbles:[],lastOutcome:null};
    for(const f of w.fish)f.kind=predators.has(w.profiles[f.design*2]?.name)?HUNTER:FRY;
    // Keep the microscopic grid consistent with the new design-based roles.
    for(let i=0;i<w.cells.length;i++)if(w.cells[i]===FRY||w.cells[i]===HUNTER)w.cells[i]=0;
    for(const f of w.fish)w.cells[Math.floor(f.y)*W+Math.floor(f.x)]=f.kind;
  }
  function profile(w,f){return w.profiles[f.design*2+(f.right?0:1)];}
  function box(w,f){
    const p=profile(w,f),cx=w.view.width/W,cy=w.view.height/H;
    const width=p?.width||80,height=p?.height||48,left=f.x*cx-width/2;
    const first=Math.min(W-1,Math.max(0,Math.floor(left/cx)));
    const last=Math.max(first+1,Math.min(W,Math.ceil((left+width)/cx)+1));
    const floor=Math.min(...w.floor.slice(first,last))*cy;
    return {left,top:Math.max(8,Math.min(floor-height-8,f.y*cy-height/2)),width,height};
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
  function before(w){
    const l=w.life;
    if(!l.quiet&&!l.encounter&&!l.diver&&w.tick>=l.nextEncounter)startEncounter(w);
    let e=l.encounter;
    if(e){
      const h=w.fish.find(f=>f.id===e.hunterId),p=w.fish.find(f=>f.id===e.preyId);
      if(!h||!p){finish(w,'escape');e=null;}
      else if(e.phase==='entering'&&h.x>7&&h.x<W-7&&p.x>7&&p.x<W-7){e.phase='chasing';e.age=0;}
    }
    for(const f of w.fish){
      let speed=f.speed;
      if(e?.phase==='chasing'){
        if(f.id===e.preyId)speed=e.catchAllowed?.35:.52;
        if(f.id===e.hunterId)speed=e.catchAllowed?.64:.44;
      }
      if(e?.phase==='feeding'&&(f.id===e.hunterId||f.id===e.preyId))speed=.06;
      f.velocity=(f.velocity??f.speed)+Math.max(-.04,Math.min(.04,speed-(f.velocity??f.speed)));
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
    if(!l.diver&&!l.encounter&&w.tick>=l.nextDiver){
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
  root.OceanLife={setup,profile,box,mouth,displayBox,before,after,setQuiet,predators};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.OceanLife;
})(typeof globalThis!=='undefined'?globalThis:this);
