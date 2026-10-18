/* SPDX-License-Identifier: GPL-2.0-or-later
 * Compact ASCII Genesis scenery; the long-necked monster adapts the original
 * Asciiquarium drawing (Kirk Baucom, art credited to Joan Stark).
 * See CREDITS.md for the original project's authors.
 */
(function(root){
  'use strict';
  const art={
    castle:['  []     []','  ||  ^  ||',' /__\\/ \\/__\\',' |  | []|  |',' |[]|   |[]|','_|__|_n_|__|_'],
    castleSmall:[' []  ^  []',' || / \\ ||',' |[]|n|[]|','_|__|_|__|_'],
    ruins:[' []       _',' ||   [] | |','/  \\__||_|_|','|_n_|____n__|'],
    ruinsSmall:[' []    _',' || []| |','_|n_||n_|_'],
    boat:['      |','     /|\\','    /_|_\\',' \\________/'],
    whale:['      __..__','  ___/      \\','~\\__    o   _)','    \\_______/'],
    monster:['                                ____','          __                   / o  \\','        /    \\       _       /  ____ >',' _     |  __  |    /   \\     |  |','| \\____|  ||  |___|     |____|  |'],
    monsterAlt:['                                ____','                       __      / o  \\','          _          /    \\  /  ____ >','  _     /   \\      |  __  |  |  |',' | \\___|     |_____|  ||  |__|  |'],
    spout:[['      :'],['     . .','     -:-','      :'],['    .   .','   .- : -.','      :'],['   .     .','  ;       ;']]
  };
  function hash(n,seed){let v=Math.imul(n+8192,1664525)^(seed|0);v^=v>>>16;return v>>>0;}
  function scene(time,seed=1){
    const period=240+hash(0,seed)%61,phase=((time+hash(1,seed)%period)%period+period)%period;
    // Twelve-second camera rises and descents leave most of each journey deep.
    const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
    const surface=smooth(phase/12)*smooth((120-phase)/12);
    const windows=[['boat',12,42],['whale',46,76],['monster',82,112]];
    const cycle=Math.floor((time+hash(1,seed)%period)/period);
    const order=hash(cycle,seed)%3;
    for(let i=0;i<windows.length;i++){
      const [,start,end]=windows[i];
      if(phase>=start&&phase<end)return {surface,kind:windows[(i+order)%3][0],progress:(phase-start)/(end-start),phase};
    }
    return {surface,kind:null,progress:0,phase};
  }
  function landmark(slot,seed){const h=hash(slot,seed);return {worldX:slot*900+160+h%240,kind:h%2?'castle':'ruins'};}
  root.OceanScenes={art,hash,scene,landmark};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.OceanScenes;
})(typeof globalThis!=='undefined'?globalThis:this);
