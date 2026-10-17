(function (root) {
  'use strict';
  const W = 48, H = 48, EMPTY = 0, ALGAE = 1, PLANKTON = 2, FRY = 3, HUNTER = 4;
  const GLYPH = [' ', '.', 'o', '>', '@'];
  const COLORS = ['#02090c', '#4fb89d', '#8fffe0', '#83d9ff', '#ffd47b'];
  const life=root.OceanLife||(typeof require==='function'?require('./ocean-life.js'):null);
  const HABITATS=[
    {name:'Kelp meadow',depth:41,kelp:1,nutrients:12,food:28},
    {name:'Rocky reef',depth:38,kelp:.5,nutrients:18,food:24},
    {name:'Open sand',depth:44,kelp:.12,nutrients:36,food:16},
    {name:'Coral garden',depth:39,kelp:.22,nutrients:16,food:26},
    {name:'Seagrass bed',depth:42,kelp:.65,nutrients:14,food:28},
    {name:'Shipwreck depths',depth:43,kelp:.08,nutrients:32,food:18}
  ];
  function habitatAt(distance){
    const segment=Math.floor(distance/64),t=distance/64-segment;
    const blend=t*t*(3-2*t),count=HABITATS.length,a=HABITATS[((segment%count)+count)%count],b=HABITATS[((segment+1)%count+count)%count];
    return {name:blend<.5?a.name:b.name,region:segment,depth:a.depth+(b.depth-a.depth)*blend,
      kelp:a.kelp+(b.kelp-a.kelp)*blend,nutrients:Math.round(a.nutrients+(b.nutrients-a.nutrients)*blend),
      food:a.food+(b.food-a.food)*blend};
  }
  function terrainShape(name,d){
    switch(name){
      case 'Rocky reef':return 2.5*Math.tanh(2*Math.sin(d*.16))+.45*Math.sin(d*.39);
      case 'Open sand':return 1.8*Math.sin(d*.105)+.5*Math.sin(d*.21+1);
      case 'Coral garden':return -2.4*Math.exp(-Math.pow(Math.sin(d*.12),2)/.22)+.6*Math.sin(d*.24);
      case 'Seagrass bed':return .7*Math.sin(d*.12)+.35*Math.sin(d*.31);
      case 'Shipwreck depths':return 1.8*Math.sin(d*.06)+.45*Math.sin(d*.23);
      default:return 1.4*Math.sin(d*.19)+.7*Math.sin(d*.43+1);
    }
  }
  function terrainAt(distance){
    const segment=Math.floor(distance/64),t=distance/64-segment,blend=t*t*(3-2*t),n=HABITATS.length;
    const a=HABITATS[((segment%n)+n)%n],b=HABITATS[((segment+1)%n+n)%n];
    return Math.max(33,Math.min(46,a.depth+(b.depth-a.depth)*blend+terrainShape(a.name,distance)*(1-blend)+terrainShape(b.name,distance)*blend));
  }
  function plantAt(slot,seed){
    const hash=((Math.imul(slot+8192,1664525)^seed)>>>0),worldX=slot*4+(hash%29)/10;
    const habitat=habitatAt(worldX),patch=.5+.5*Math.sin(worldX*.075+(seed%97));
    const density=habitat.name==='Open sand'?.1:habitat.name==='Shipwreck depths'?.12:habitat.name==='Seagrass bed'?.12+.85*patch:.4+.5*patch;
    const present=hash%5!==0&&((hash>>>8)%100)<density*100;
    let height=Math.max(2,Math.round((4+hash%15)*habitat.kelp*(.65+.5*patch)));
    height=Math.min(habitat.name==='Seagrass bed'?8:22,height);
    return {hash,worldX,habitat,height,present};
  }
  function sceneryAt(slot,seed){
    const hash=((Math.imul(slot+16384,1103515245)^seed)>>>0),worldX=slot*12+2+(hash%41)/10;
    const habitat=habitatAt(worldX).name;
    if(hash%3!==0&&(habitat!=='Rocky reef'||hash%2!==0))return null;
    let type;
    if(habitat==='Rocky reef')type=hash%2?'boulder':'crevice';
    else if(habitat==='Coral garden')type='coral';
    else if(habitat==='Shipwreck depths')type=hash%2?'anchor':'debris';
    else if(habitat==='Open sand'&&hash%9===0)type='anchor';
    else if(habitat==='Kelp meadow'&&hash%6===0)type='boulder';
    return type?{type,worldX,variant:(hash>>>10)%3}:null;
  }

  function makeRng(seed) {
    let x = seed >>> 0 || 1;
    return function () {
      x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
      return (x >>> 0) / 4294967296;
    };
  }
  function world(seed = 1, designCount = 8, options = {}) {
    if(!Number.isInteger(designCount)||designCount<1)throw new Error('Invalid fish design count');
    const rng = makeRng(seed), cells = new Uint8Array(W * H);
    const floor=Array.from({length:W},(_,x)=>Math.ceil(terrainAt(x)));
    function seedSpecies(kind, count) {
      let put = 0, guard = count * 20;
      while (put < count && guard-- > 0) {
        const i = Math.floor(rng() * cells.length);
        if (cells[i] === EMPTY && Math.floor(i/W)<floor[i%W]) { cells[i] = kind; put++; }
      }
    }
    // Start with a light touch: a quiet reef has room between the animals.
    seedSpecies(ALGAE, 76); seedSpecies(PLANKTON, 34); seedSpecies(FRY, 5); seedSpecies(HUNTER, 1);
    const fish=[];
    const mantisDesign=(options.art||root.AsciiquariumSprites||[]).findIndex(s=>s.name==='peacock mantis shrimp')/2;
    for(let i=0;i<cells.length;i++)if(cells[i]===FRY||cells[i]===HUNTER){
      const id=fish.length;
      fish.push({id,kind:cells[i],x:i%W,y:Math.floor(i/W),design:id===2&&mantisDesign>=0&&mantisDesign<designCount?mantisDesign:id%designCount,right:id%2===0,speed:.18+rng()*.27});
    }
    const w={ width: W, height: H, cells, floor, fish, designCount, travel:0,habitat:habitatAt(W/2),nextFishId:fish.length, tick: 0, rng, seed };
    life.setup(w,options.art||root.AsciiquariumSprites||[],options);
    return w;
  }
  function neighbors(index) {
    const x = index % W, y = (index / W) | 0, out = [];
    for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) {
      if (!dx && !dy) continue;
      const nx=x+dx, ny=y+dy;
      if (nx>=0 && nx<W && ny>=0 && ny<H) out.push(ny*W+nx);
    }
    return out;
  }
  function step(w,elapsedMs=350) {
    // Showcase swimmers have their own timeline; the normal ecosystem is preserved.
    if(w.parade){life.advanceParade(w,elapsedMs);return w;}
    life.advanceOcean(w,elapsedMs);
    const oldColumn=Math.floor(w.travel);
    w.travel+=.08;
    w.habitat=habitatAt(w.travel+W/2);
    // Carry the environmental grid past the camera; swimmers keep their own paths.
    if(Math.floor(w.travel)>oldColumn){
      const shifted=new Uint8Array(W*H);
      for(let y=0;y<H;y++)for(let x=0;x<W-1;x++)shifted[y*W+x]=w.cells[y*W+x+1];
      w.cells=shifted;
    }
    w.floor=Array.from({length:W},(_,x)=>Math.ceil(terrainAt(w.travel+x)));
    for(let i=0;i<w.cells.length;i++)if(Math.floor(i/W)>=w.floor[i%W])w.cells[i]=EMPTY;
    const next = w.cells.slice(), rng = w.rng;
    for(let i=0;i<next.length;i++)if(next[i]===FRY||next[i]===HUNTER)next[i]=EMPTY;
    const waterNeighbors=i=>neighbors(i).filter(j=>Math.floor(j/W)<w.floor[j%W]);
    let planktonCount=next.reduce((n,s)=>n+(s===PLANKTON),0);
    // Plankton nibble at nearby algae, drift into open water, and occasionally divide.
    for (let i=0; i<w.cells.length; i++) if (w.cells[i] === PLANKTON) {
      if(next[i]!==PLANKTON)continue;
      if(rng()<.003){next[i]=EMPTY;planktonCount--;continue;}
      const ns=waterNeighbors(i), food=ns.filter(j=>w.cells[j]===ALGAE), open=ns.filter(j=>next[j]===EMPTY);
      if (food.length && rng()<0.24) next[food[Math.floor(rng()*food.length)]]=EMPTY;
      if (open.length && rng()<0.12) { const dest=open[Math.floor(rng()*open.length)]; next[i]=EMPTY; next[dest]=PLANKTON; }
      if (planktonCount<45 && open.length>1 && rng()<0.0015) {
        const dest=open[Math.floor(rng()*open.length)];
        if(next[dest]===EMPTY){next[dest]=PLANKTON;planktonCount++;}
      }
    }
    // A small incoming drift keeps food available without allowing a bloom.
    if(w.tick%20===19&&planktonCount<w.habitat.food){
      const i=Math.floor(rng()*W*32);
      if(next[i]===EMPTY)next[i]=PLANKTON;
    }
    // Stable individual swimmers cruise at different speeds through open boundaries.
    life.before(w);
    for(const fish of w.fish){
      fish.x+=(fish.right?1:-1)*(fish.velocity??fish.speed);
      life.moveCreature(w,fish);
      if(fish.x<0||fish.x>=W)continue;
      const i=Math.floor(fish.y)*W+Math.floor(fish.x);
      const prey=waterNeighbors(i).filter(j=>next[j]===PLANKTON);
      if(fish.kind===FRY&&prey.length&&rng()<.34)next[prey[Math.floor(rng()*prey.length)]]=EMPTY;
    }
    // Visible animals leave only after their full artwork clears the screen.
    life.after(w);
    w.fish=w.fish.filter(fish=>fish.x>-20&&fish.x<W+20);
    // Algae regrows slowly around existing patches, keeping the food web from draining away.
    let algaeCount=next.reduce((n,s)=>n+(s===ALGAE),0);
    for(let i=0;i<next.length;i++)if(next[i]===ALGAE&&rng()<.004){next[i]=EMPTY;algaeCount--;}
    if (w.tick % 6 === 0) for (let i=0; i<w.cells.length; i++) if (algaeCount<100&&w.cells[i]===ALGAE && rng()<0.008) {
      const open=waterNeighbors(i).filter(j=>next[j]===EMPTY);
      if (open.length) {next[open[Math.floor(rng()*open.length)]]=ALGAE;algaeCount++;}
    }
    // Small nutrient sparks appear near the floor at a slow rate.
    if (w.tick % w.habitat.nutrients === 0 && algaeCount<100) for (let n=0; n<1; n++) {
      const x=Math.floor(rng()*W), i=(w.floor[x]-1-Math.floor(rng()*4))*W+x;
      if (next[i]===EMPTY) next[i]=ALGAE;
    }
    // An open ocean occasionally receives a visitor, without crowding the scene.
    const reserve=!w.life.quiet&&!w.life.encounter&&w.tick>=w.life.nextEncounter?2:0;
    life.addSchool(w,reserve);
    if(w.tick%24===23 && w.fish.length<8-reserve){
      const id=w.nextFishId++, right=rng()<.5;
      let design=(id+w.habitat.region*3)%w.designCount;
      // Some night arrivals favor lanternfish and jellyfish; ordinary rotation continues.
      if(w.ocean.light<.35&&id%4===0){const nocturnal=w.profiles.findIndex(p=>p.name===(id%8===0?'moon jellyfish':'blue lanternfish'));if(nocturnal>=0&&nocturnal/2<w.designCount)design=Math.floor(nocturnal/2);}
      const name=w.profiles[design*2]?.name;
      const kind=name==='yellow submarine'?EMPTY:life.predators.has(name)?HUNTER:FRY;
      const speed=name==='moon jellyfish'?.12:name==='violet octopus'?.16:name==='shore crab'?.1:name==='reef lobster'||name==='peacock mantis shrimp'?.12:name==='humpback whale'?.16:name==='yellow submarine'?.2:.18+rng()*.27;
      w.fish.push({id,kind,x:right?-10:W+10,y:6+rng()*25,design,right,speed});
    }
    for(const fish of w.fish)if(fish.kind!==EMPTY&&fish.x>=0&&fish.x<W){
      const i=Math.floor(fish.y)*W+Math.floor(fish.x);
      if(Math.floor(fish.y)<w.floor[Math.floor(fish.x)])next[i]=fish.kind;
    }
    w.cells=next; w.tick++; return w;
  }
  function counts(w) {
    const c={algae:0,plankton:0,fry:0,hunters:0};
    for (const s of w.cells) { if(s===ALGAE)c.algae++; else if(s===PLANKTON)c.plankton++; else if(s===FRY)c.fry++; else if(s===HUNTER)c.hunters++; }
    return c;
  }
  function ascii(w) {
    const rows=[];
    for(let y=0;y<H;y++){let line='';for(let x=0;x<W;x++)line+=GLYPH[w.cells[y*W+x]];rows.push(line);}
    return rows.join('\n');
  }
  root.AquariumCore={W,H,EMPTY,ALGAE,PLANKTON,FRY,HUNTER,GLYPH,COLORS,world,step,counts,ascii,habitatAt,terrainAt,plantAt,sceneryAt,life};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.AquariumCore;
})(typeof globalThis!=='undefined'?globalThis:this);
