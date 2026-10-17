/* ASCII Genesis miniature ocean, GPL-2.0-or-later.
 * Browser design simulation for the 320 x 172 display; not firmware emulation.
 */
(function (root) {
  'use strict';
  const W = 320, H = 172, WATER_TOP = 12, FLOOR = 160;
  const HABITATS = ['KELP MEADOW', 'ROCKY REEF', 'OPEN SAND', 'CORAL GARDEN', 'SEAGRASS BED', 'WRECK DEPTHS'];
  class MiniOcean {
    constructor(sprites, seed = 147) {
      this.sprites = sprites;
      this.seed = seed >>> 0 || 147;
      this.time = 0; this.paused = false; this.controls = true;
      this.habitat = 0; this.scroll = 0; this.fish = [];
      this.bubbles = []; this.nextBubble = 2;
      this.spawn(6, 28, 24, 1);
      this.spawn(2, 156, 55, -1);
      this.spawn(38, 180, 78, -1);
    }
    random() {
      let x = this.seed; x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
      this.seed = x >>> 0; return this.seed / 4294967296;
    }
    spawn(index, x, y, direction) {
      const sprite = this.sprites[(index & ~1) + (direction < 0 ? 1 : 0)];
      const width = Math.max(...sprite.rows.map(r => r.length)) * 6;
      const height = sprite.rows.length * 8;
      this.fish.push({index: (index & ~1) + (direction < 0 ? 1 : 0), x, y,
        width, height, direction, speed: 3 + this.random() * 3,
        phase: this.random() * Math.PI * 2});
    }
    step(dt) {
      if (this.paused) return;
      dt = Math.max(0, Math.min(dt, 0.25));
      this.time += dt; this.scroll = this.time * 1.8;
      this.habitat = Math.floor(this.time / 45) % HABITATS.length;
      for (const f of this.fish) f.x += f.direction * f.speed * dt;
      this.fish = this.fish.filter(f => f.x < W + 8 && f.x + f.width > -8);
      if (this.fish.length < 3) {
        const index = Math.floor(this.random() * (this.sprites.length / 2)) * 2;
        const direction = this.random() < 0.5 ? -1 : 1;
        const sprite = this.sprites[index];
        const width = Math.max(...sprite.rows.map(r => r.length)) * 6;
        const height = sprite.rows.length * 8;
        const y = WATER_TOP + 5 + this.random() * Math.max(1, FLOOR - height - WATER_TOP - 12);
        this.spawn(index, direction > 0 ? -width - 2 : W + 2, y, direction);
      }
      if (this.time >= this.nextBubble) {
        if (this.bubbles.length < 4) this.bubbles.push({x: 15 + this.random() * 290, y: FLOOR - 2});
        this.nextBubble = this.time + 2 + this.random() * 3;
      }
      for (const b of this.bubbles) b.y -= dt * 5;
      this.bubbles = this.bubbles.filter(b => b.y > WATER_TOP + 3);
      if (this.time > 8) this.controls = false;
    }
    action(x, y) {
      if (this.controls && y >= 140) {
        if (x < 107) this.paused = !this.paused;
        else if (x < 214) return 'reset';
        else return 'settings';
      }
      this.controls = true;
      return 'show';
    }
  }
  function render(ctx, ocean, font) {
    const colors = {water: '#020c14', text: '#bde9e6', muted: '#54858d', green: '#56ab91', sand: '#80715a'};
    function glyph(char, x, y, color) {
      const code = char.charCodeAt(0);
      if (code < 32 || code > 126) return;
      ctx.fillStyle = color;
      for (let col = 0; col < 5; col++) {
        const bits = font[code * 5 + col];
        for (let row = 0; row < 8; row++) if (bits & (1 << row)) ctx.fillRect(Math.round(x) + col, Math.round(y) + row, 1, 1);
      }
    }
    function text(s, x, y, color) { for (let i = 0; i < s.length; i++) glyph(s[i], x + i * 6, y, color); }
    ctx.fillStyle = colors.water; ctx.fillRect(0, 0, W, H);
    text('ASCII GENESIS', 5, 2, colors.text);
    text(HABITATS[ocean.habitat], W - HABITATS[ocean.habitat].length * 6 - 5, 2, colors.muted);
    ctx.save(); ctx.beginPath(); ctx.rect(0, WATER_TOP, W, H - WATER_TOP); ctx.clip();
    for (let i = 0; i < 53; i++) {
      const x = i * 6, ground = FLOOR + Math.round(Math.sin((x + ocean.scroll) / 42) * 3);
      glyph(i % 4 === 0 ? ':' : '.', x, ground + 5, colors.sand);
      if (i % 2 === 0) glyph('_', x, ground, colors.sand);
    }
    for (let plant = -1; plant < 8; plant++) {
      const worldX = plant * 57 + 22;
      const x = ((worldX - ocean.scroll) % 456 + 456) % 456 - 57;
      const height = 2 + ((plant + 8) % 3);
      for (let row = 0; row < height; row++) {
        const sway = Math.round(Math.sin(ocean.time * 0.7 + row + plant) * 2);
        glyph(row % 2 ? ')' : '(', x + sway, FLOOR - row * 8 - 5, colors.green);
        if (ocean.habitat === 3 && row === 1) text('\\|/', x - 6, FLOOR - 13, '#cd8d99');
      }
    }
    if (ocean.habitat === 1 || ocean.habitat === 5) text('/__\\', 220 - Math.floor(ocean.scroll % 100), FLOOR - 9, colors.muted);
    for (const b of ocean.bubbles) glyph('o', b.x, b.y, colors.muted);
    for (const fish of ocean.fish) {
      const s = ocean.sprites[fish.index];
      const bob = Math.round(Math.sin(ocean.time * 0.55 + fish.phase) * 2);
      for (let row = 0; row < s.rows.length; row++) {
        for (let col = 0; col < s.rows[row].length; col++) {
          const ch = s.rows[row][col]; if (ch === ' ') continue;
          const mask = Number(s.masks[row]?.[col]);
          glyph(ch, fish.x + col * 6, fish.y + row * 8 + bob, s.palette[mask > 0 ? mask - 1 : 0] || colors.text);
        }
      }
    }
    ctx.restore();
    if (ocean.controls) {
      ctx.fillStyle = '#102631'; ctx.fillRect(0, 140, 320, 32);
      const pause = ocean.paused ? 'RESUME' : 'PAUSE';
      text(pause, 35, 153, colors.text);
      text('NEW WORLD', 130, 153, colors.text);
      text('SETTINGS', 244, 153, colors.text);
    }
  }
  root.MiniAquarium = {MiniOcean, render, W, H, HABITATS};
})(globalThis);
