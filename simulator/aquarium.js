(function (root) {
  'use strict';
  const W = 48, H = 48, EMPTY = 0, ALGAE = 1, PLANKTON = 2, FRY = 3, HUNTER = 4;
  const GLYPH = [' ', '.', 'o', '>', '@'];
  const COLORS = ['#02090c', '#4fb89d', '#8fffe0', '#83d9ff', '#ffd47b'];
  const HABITATS=[
    {name:'Kelp meadow',depth:41,kelp:1,nutrients:12,food:28},
    {name:'Rocky reef',depth:38,kelp:.5,nutrients:18,food:24},
    {name:'Open sand',depth:44,kelp:.12,nutrients:36,food:16}
  ];
  function habitatAt(distance){
    const segment=Math.floor(distance/64),t=distance/64-segment;
    const blend=t*t*(3-2*t),a=HABITATS[((segment%3)+3)%3],b=HABITATS[((segment+1)%3+3)%3];
    return {name:blend<.5?a.name:b.name,region:segment,depth:a.depth+(b.depth-a.depth)*blend,
      kelp:a.kelp+(b.kelp-a.kelp)*blend,nutrients:Math.round(a.nutrients+(b.nutrients-a.nutrients)*blend),
      food:a.food+(b.food-a.food)*blend};
  }
  function terrainAt(distance){return habitatAt(distance).depth+1.4*Math.sin(distance*.19)+.7*Math.sin(distance*.43+1);}

  function makeRng(seed) {
    let x = seed >>> 0 || 1;
    return function () {
      x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
      return (x >>> 0) / 4294967296;
    };
  }
  function world(seed = 1, designCount = 8) {
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
    for(let i=0;i<cells.length;i++)if(cells[i]===FRY||cells[i]===HUNTER){
      const id=fish.length;
      fish.push({id,kind:cells[i],x:i%W,y:Math.floor(i/W),design:id%designCount,right:id%2===0,speed:.18+rng()*.27});
    }
    return { width: W, height: H, cells, floor, fish, designCount, travel:0,habitat:habitatAt(W/2),nextFishId:fish.length, tick: 0, rng, seed };
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
  function step(w) {
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
    for(const fish of w.fish){
      fish.x+=(fish.right?1:-1)*fish.speed;
      if(fish.x<0||fish.x>=W)continue;
      const i=Math.floor(fish.y)*W+Math.floor(fish.x);
      const prey=waterNeighbors(i).filter(j=>next[j]===PLANKTON);
      if(fish.kind===FRY&&prey.length&&rng()<.34)next[prey[Math.floor(rng()*prey.length)]]=EMPTY;
    }
    // Visible animals leave only after their full artwork clears the screen.
    w.fish=w.fish.filter(fish=>fish.x>-12&&fish.x<W+12);
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
    if(w.tick%24===23 && w.fish.length<8){
      const id=w.nextFishId++, right=rng()<.5;
      const kind=w.fish.some(f=>f.kind===HUNTER)?FRY:HUNTER;
      w.fish.push({id,kind,x:right?-10:W+10,y:6+rng()*25,design:(id+w.habitat.region*3)%w.designCount,right,speed:.18+rng()*.27});
    }
    for(const fish of w.fish)if(fish.x>=0&&fish.x<W){
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
  root.AquariumCore={W,H,EMPTY,ALGAE,PLANKTON,FRY,HUNTER,GLYPH,COLORS,world,step,counts,ascii,habitatAt,terrainAt};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.AquariumCore;
})(typeof globalThis!=='undefined'?globalThis:this);
