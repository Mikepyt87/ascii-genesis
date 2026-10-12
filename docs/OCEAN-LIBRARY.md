# ASCII Genesis Ocean Library

A field guide to everything currently drawn or simulated in the Raspberry Pi 4 ocean on the Waveshare 7.9-inch screen. The collection contains **17 fish designs, 34 directional drawings, two microscopic life types, a two-pose diver, bubbles, kelp, seabed contours, sediment texture, and water across three habitats**. An occasional diver visits, and brief predator encounters sometimes end in a catch. Quiet mode turns hunting off.

## How to read the collection

Fish names describe the artwork. They are not verified biological species, and the ocean is a stylized simulation rather than a scientifically accurate marine food web. A bannerfish, moray, or ray currently follows the same basic swimming rules as the other drawings.

**Appearance determines hunting eligibility.** Large ocean fish, silver spearfish, and copper morays have the hunter role. Tiny fish, little triangular fish, reef fish, and box fish can be selected as prey in encounters. Other designs cruise without being selected for hunts. These are artistic simulation roles, not claims about real diets. There are no fixed species territories.

The artwork below is copied from the actual sprite collection, with its spaces preserved. Each entry shows both directions. Dimensions are character columns by text rows, including spacing, and can differ between directions. The screen uses a 16-pixel monospaced font: each row is 16 pixels tall and each character is roughly 9.6 pixels wide, depending on the browser font.

## Other objects index

Fish drawings appear in the next index. Every other visible ocean object has an entry here; habitat settings and the control panel are included too. Tank, mask, arms, and fins are parts of one diver sprite, rather than independent objects.

| Object or feature | Category | Visual example and details |
| --- | --- | --- |
| Diver | Visiting character | [Both poses and directions](#diver-artwork) |
| Diver bubbles | Temporary particles | [Rising bubbles](#diver-bubbles) |
| Algae | Simulated life | [Algae dots](#algae-dots) |
| Plankton | Simulated life | [Plankton glyphs](#plankton-glyphs) |
| Kelp stalks and fronds | Procedural scenery | [Kelp artwork](#kelp-artwork) |
| Seabed contour | Procedural scenery | [Floor contour](#floor-contour) |
| Sediment texture | Procedural scenery | [Sediment marks](#sediment-marks) |
| Water | Background | [Water background](#water-background) |
| Kelp meadow, rocky reef, open sand | Habitat settings | [Habitats](#habitats) |
| Touch panel and readouts | Interface | [Controls and readouts](#controls-and-readouts) |
| Prey shrinking at mouth contact | Fish animation | [Catch and feeding](#catch-and-feeding) |

## Fish index

| Design | Name | Color family | Source |
| --- | --- | --- | --- |
| 1 | [angelfish](#angelfish) | warm gold | Asciiquarium |
| 2 | [reef fish](#reef-fish) | soft blue | Asciiquarium |
| 3 | [striped fish](#striped-fish) | dusty rose | Asciiquarium |
| 4 | [tiny fish](#tiny-fish) | pale cream | Asciiquarium |
| 5 | [rounded fish](#rounded-fish) | peach and coral | Asciiquarium |
| 6 | [diamond fish](#diamond-fish) | sage green | Asciiquarium |
| 7 | [little triangular fish](#little-triangular-fish) | lavender | Asciiquarium |
| 8 | [box fish](#box-fish) | teal | Asciiquarium |
| 9 | [curly-fin fish](#curly-fin-fish) | warm gold | Asciiquarium |
| 10 | [large ocean fish](#large-ocean-fish) | soft blue | Asciiquarium |
| 11 | [streamlined fish](#streamlined-fish) | dusty rose | Asciiquarium |
| 12 | [sunburst puffer](#sunburst-puffer) | gold and bronze | ASCII Genesis |
| 13 | [ribbon bannerfish](#ribbon-bannerfish) | silver blue and gold | ASCII Genesis |
| 14 | [silver spearfish](#silver-spearfish) | ice blue and slate blue | ASCII Genesis |
| 15 | [copper moray](#copper-moray) | copper and rust | ASCII Genesis |
| 16 | [violet kite ray](#violet-kite-ray) | violet and muted purple | ASCII Genesis |
| 17 | [blue lanternfish](#blue-lanternfish) | muted blue green | ASCII Genesis |

## Shared swimming behavior

- A new world begins with six swimmers already in the scene. Their roles follow their designs. Later arrivals, including encounter pairs, start beyond an edge.
- Up to eight swimmers may exist at once, including swimmers outside the visible screen. A normal arrival opportunity occurs every 24 ticks, about 8.4 seconds, when there is room. A pending encounter reserves two slots so it can introduce a suitable pair without exceeding the cap.
- Normal individual speeds range from 0.18 to just under 0.45 world cells per tick. At 350 milliseconds per tick and 1280 pixels across 48 world cells, that is roughly 14 to 34 pixels per second. A center crosses the visible width in about 37 to 93 seconds.
- Fish keep their drawing and direction for their whole crossing. Ordinary departures are removed after their center reaches 20 world cells beyond an edge. Normal arrivals start 10 cells beyond an edge. An encounter pair starts 10 and 18 cells beyond the same edge. A successful catch is the only removal inside the visible screen.
- Fry can consume nearby plankton. Hunters normally cruise; selected encounter pairs briefly chase, and some catch prey. There is no breeding, aging, health, or hunger system for individual swimmers.
- The renderer keeps each drawing above the local seabed and caches all 34 fish images. Travel changes which designs enter next; it does not transform fish already on screen.

## Fish drawings

### angelfish

A broad rounded body, swept upper fin, forked tail, and a small eye near the nose.

- **Color:** warm gold.
- **Artwork:** Adapted Asciiquarium drawing; see [artwork credits](../THIRD-PARTY.txt).
- **Size:** right 14 × 6; left 14 × 6 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
       \
     ...\..,
\  /'       \
 >=     (  ' >
/  \      / /
    `"'"'/''
```

Facing left:

```text
      /
  ,../...
 /       '\  /
< '  )     =<
 \ \      /  \
  `'\'"'"'
```

### reef fish

A compact oval body with a pointed upper and lower fin, forked tail, and round eye.

- **Color:** soft blue.
- **Artwork:** Adapted Asciiquarium drawing; see [artwork credits](../THIRD-PARTY.txt).
- **Size:** right 7 × 5; left 7 × 5 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
    \
\ /--\
>=  (o>
/ \__/
    /
```

Facing left:

```text
  /
 /--\ /
<o)  =<
 \__/ \
  \
```

### striped fish

Dense colon markings fill the body, with layered slash fins and a wide forked tail.

- **Color:** dusty rose.
- **Artwork:** Adapted Asciiquarium drawing; see [artwork credits](../THIRD-PARTY.txt).
- **Size:** right 16 × 5; left 16 × 5 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
       \:.
\;,   ,;\\\,,
  \\\;;:::::::o
  ///;;::::::::<
 /;` ``/////``
```

Facing left:

```text
      .:/
   ,,///;,   ,;/
 o:::::::;;///
>::::::::;;\\\
  ''\\\\\'' ';\
```

### tiny fish

A three-line silhouette with a small outlined body and a simple crossed tail.

- **Color:** pale cream.
- **Artwork:** Adapted Asciiquarium drawing; see [artwork credits](../THIRD-PARTY.txt).
- **Size:** right 5 × 3; left 5 × 3 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
  __
><_'>
   '
```

Facing left:

```text
 __
<'_><
 `
```

### rounded fish

A low rounded outline with short fins and a small forked tail.

- **Color:** peach and coral.
- **Artwork:** Adapted Asciiquarium drawing; see [artwork credits](../THIRD-PARTY.txt).
- **Size:** right 9 × 3; left 9 × 3 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
   ..\,
>='   ('>
  '''/''
```

Facing left:

```text
  ,/..
<')   `=<
 ``\```
```

### diamond fish

A tall angular outline with pointed top and bottom fins around a compact body.

- **Color:** sage green.
- **Artwork:** Adapted Asciiquarium drawing; see [artwork credits](../THIRD-PARTY.txt).
- **Size:** right 6 × 5; left 6 × 5 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
   \
  / \
>=_('>
  \_/
   /
```

Facing left:

```text
  /
 / \
<')_=<
 \_/
  \
```

### little triangular fish

A three-line pointed fish with short upper and lower fins and a crossed tail.

- **Color:** lavender.
- **Artwork:** Adapted Asciiquarium drawing; see [artwork credits](../THIRD-PARTY.txt).
- **Size:** right 5 × 3; left 5 × 3 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
  ,\
>=('>
  '/
```

Facing left:

```text
 /,
<')=<
 \`
```

### box fish

A small box-shaped outline with a round eye and a crossed tail.

- **Color:** teal.
- **Artwork:** Adapted Asciiquarium drawing; see [artwork credits](../THIRD-PARTY.txt).
- **Size:** right 5 × 3; left 5 × 3 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
  __
\/ o\
/\__/
```

Facing left:

```text
 __
/o \/
\__/\
```

### curly-fin fish

Curved upper and lower fins frame a rounded body, with a curly tail and a prominent eye.

- **Color:** warm gold.
- **Artwork:** Adapted Asciiquarium drawing; see [artwork credits](../THIRD-PARTY.txt).
- **Size:** right 10 × 7; left 10 × 7 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
     ,
     }\
\  .'  `\
}}<   ( 6>
/  `,  .'
     }/
     '
```

Facing left:

```text
    ,
   /{
 /'  `.  /
<6 )   >{{
 `.  ,'  \
   \{
    `
```

### large ocean fish

The largest classic drawing: a broad body, large eye, gill marks, forked tail, and tall fins.

- **Color:** soft blue.
- **Artwork:** Adapted Asciiquarium drawing; see [artwork credits](../THIRD-PARTY.txt).
- **Size:** right 23 × 8; left 23 × 8 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
            \'`.
             )  \
(`.      _.-`' ' '`-.
 \ `.  .`        (o) \_
  >  ><     (((       (
 / .`  `._      /_|  /'
(.`       `-. _  _.-`
            /__/'
```

Facing left:

```text
       .'`/
      /  (
  .-'` ` `'-._      .')
_/ (o)        '.  .' /
)       )))     ><  <
`\  |_\      _.'  '. \
  '-._  _ .-'       '.)
      `\__\
```

### streamlined fish

A long tapered silhouette with a swept top fin, paired gill marks, and a forked tail.

- **Color:** dusty rose.
- **Artwork:** Adapted Asciiquarium drawing; see [artwork credits](../THIRD-PARTY.txt).
- **Size:** right 16 × 5; left 16 × 5 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
       ,--,_
__    _\.---'-.
\ '.-"     // o\
/_.'-._    \\  /
       `"--(/"`
```

Facing left:

```text
    _,--,
 .-'---./_    __
/o \\     "-.' /
\  //    _.-'._\
 `"\)--"`
```

### sunburst puffer

A round dotted body surrounded by small spine marks, with a short tail and pointed mouth.

- **Color:** gold and bronze.
- **Artwork:** Original ASCII Genesis drawing in [original-fish.mjs](../third-party/original-fish.mjs).
- **Size:** right 16 × 5; left 16 × 5 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
       . | .    
     .'-----'.  
 >=={  . .  o )>
     '._____.'  
       ' | '    
```

Facing left:

```text
    . | .       
  .'-----'.     
<( o  . .  }==< 
  '._____.'     
    ' | '       
```

### ribbon bannerfish

A tall striped body with extended upper and lower fins and a trailing lower ribbon.

- **Color:** silver blue and gold.
- **Artwork:** Original ASCII Genesis drawing in [original-fish.mjs](../third-party/original-fish.mjs).
- **Size:** right 19 × 8; left 19 × 8 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
          /\       
         /  \___   
        / | |   '. 
   >==={  | |  o  >
        \ | | _.-' 
         \  /      
          \/       
           \       
```

Facing left:

```text
       /\          
   ___/  \         
 .'   | | \        
<  o  | |  }===<   
 '-._ | | /        
      \  /         
       \/          
       /           
```

### silver spearfish

An elongated body with a long pointed bill, tall top fin, and forked tail.

- **Color:** ice blue and slate blue.
- **Artwork:** Original ASCII Genesis drawing in [original-fish.mjs](../third-party/original-fish.mjs).
- **Size:** right 23 × 5; left 23 × 5 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
           /|          
    /\ ___/ |____      
   <  <   ---  o \====>
    \/ '---.___./      
             \|        
```

Facing left:

```text
          |\           
      ____| \___ /\    
<====/ o  ---   >  >   
      \.___.---' \/    
        |/             
```

### copper moray

A long curved body with a low profile, broad head, and small eye.

- **Color:** copper and rust.
- **Artwork:** Original ASCII Genesis drawing in [original-fish.mjs](../third-party/original-fish.mjs).
- **Size:** right 21 × 4; left 21 × 4 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
      __       _____ 
  ___/  \_____/  o  >
 <___   ______   __/ 
     \_/      \_/    
```

Facing left:

```text
 _____       __      
<  o  \_____/  \___  
 \__   ______   ___> 
    \_/      \_/     
```

### violet kite ray

A wide kite-shaped body with angled wings and a long thin trailing tail.

- **Color:** violet and muted purple.
- **Artwork:** Original ASCII Genesis drawing in [original-fish.mjs](../third-party/original-fish.mjs).
- **Size:** right 19 × 5; left 19 × 5 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
           _/\_    
        .-'    '-. 
 ------<    --  o >
        '-.    .-' 
           \__/    
```

Facing left:

```text
    _/\_           
 .-'    '-.        
< o  --    >------ 
 '-.    .-'        
    \__/           
```

### blue lanternfish

A compact rounded fish with body markings and a small stalk ending in a light-like dot.

- **Color:** muted blue green.
- **Artwork:** Original ASCII Genesis drawing in [original-fish.mjs](../third-party/original-fish.mjs).
- **Size:** right 16 × 6; left 16 × 6 characters.
- **Behavior:** shared swimming rules above; encounter eligibility is listed under visitors and encounters.

Facing right:

```text
          __o   
         /      
    /\.-'----.  
   <  <  :  o )>
    \/'-.____/  
          \_/   
```

Facing left:

```text
   o__          
      \         
  .----'-./\    
<( o  :  >  >   
  \____.-'\/    
   \_/          
```

## Other object drawings

The diver drawings below are copied directly from the current renderer. The remaining objects use glyphs placed by procedural rules, so they have no single fixed multi-line sprite. Their entries show the actual glyphs and explain how they form the scene.

### Diver artwork

**Type:** visiting character, separate from the fish population. **Parts:** a tank on the back, a warm-colored face and mask, outstretched arms, bent legs, and two distinct fins. **Animation:** two alternating leg poses, each cached facing left and right. Poses change every five ticks, about 1.75 seconds.

**Colors:** tank `#a2b8b5`, face and mask `#e6c995`, suit `#87abc6`, fin tips `#8bafd1`. Both directions preserve those component colors. At the normal 16-pixel font, the seven-row drawing is 112 pixels tall. Its cached width comes from the longest row in each pose rather than a fixed crop.

**Pose 1, facing right (25 columns × 7 rows):**

```text
        .----.    .---.  
        |____|    |[o]|  
   _____/====\____( _ )  
 _/    /    _____/ \ \__
<_____/ \__/        \___)
        \ \__           
         \___>          
```

**Pose 1, facing left:**

```text
  .---.    .----.        
  |[o]|    |____|        
  ( _ )____/====\_____   
 __/ / \_____    \    \_ 
(___/        \__/ \_____>
            __/ /        
           <___/         
```

**Pose 2, facing right (25 columns × 7 rows):**

```text
        .----.    .---.  
        |____|    |[o]|  
   _____/====\____( _ )  
  \   /    _____/ \ \__
   >__/ \__/        \___)
       / /               
     <__/                
```

**Pose 2, facing left:**

```text
  .---.    .----.        
  |[o]|    |____|        
  ( _ )____/====\_____   
  __/ / \_____    \   /  
(___/        \__/ \__<   
               \ \       
                \__>     
```

**Behavior:** visits after 5–10 minute waits, enters and leaves fully off screen, swims gently through the upper water, and remains enabled in quiet mode. At most one diver exists at a time. See [visiting diver](#visiting-diver) for scheduling details. Source: [simulator.js](../simulator/simulator.js), original project artwork under GPL-2.0-or-later.

### Diver bubbles

Actual glyphs, in life order:

```text
o  .
```

**Color:** muted blue green `#71969c`; **font:** 10 pixels. A bubble uses o while younger than ten ticks, then a dot. The diver can emit one every 12 ticks while its center is in view and the bubble limit has room. Each bubble rises 0.23 world cells per tick and drifts left 0.025 cells per tick. It disappears before age 20 ticks or when it reaches the upper boundary.

**Limit:** five bubbles. They have no reproduction, food-web role, or interaction with fish. They are distinct from pale mint plankton o glyphs. Source: [ocean-life.js](../simulator/ocean-life.js) and [simulator.js](../simulator/simulator.js).

### Algae dots

```text
.
```

**Type:** living cells in the food web; **color:** `#4fb89d`; **font:** 10 pixels. Each cell draws one small dot. Starts at 76 cells and stays capped at 100. Plankton can consume algae; algae can slowly regrow and receive additions near the seabed. Its position follows the scrolling environmental grid. Algae is separate from the larger kelp scenery and from darker sediment dots. Source: [aquarium.js](../simulator/aquarium.js).

### Plankton glyphs

```text
o
```

**Type:** living cells in the food web; **color:** `#8fffe0`; **font:** 10 pixels. Starts at 34 cells and stays capped at 45. Plankton can consume neighboring algae, move to nearby empty water, rarely divide, and naturally disappear. Fry can consume it. Incoming additions vary with the traveling habitat. These glyphs remain bright mint, while diver bubbles use a dimmer color and change to dots. Source: [aquarium.js](../simulator/aquarium.js).

### Kelp artwork

Actual stalk and frond glyphs:

```text
(  )  /
```

**Type:** procedural scenery. Alternating parentheses draw stalk segments; slash marks form side fronds at alternating heights. Stalks sway slightly side to side. Five greens vary between clumps and along each plant: `#438b55`, `#62b878`, `#82c76b`, `#4fa66b`, `#a0cd78`.

**Placement:** clumps belong to fixed world coordinates and scroll past the camera. **Height:** 2–18 text rows, scaled by habitat. They can be tall in a kelp meadow and short over open sand. Stalks and fronds are parts of the same generated plant, and they do not grow as ecological algae cells. Source: [simulator.js](../simulator/simulator.js); see [kelp and seaweed](#kelp-and-seaweed) for the planting rules.

### Floor contour

```text
_
```

**Type:** procedural scenery; **color:** `#36575a`; **font:** 16 pixels on the target screen. Underscores are placed at the height of the rolling floor to form a continuous-looking seabed. The contour combines the blended habitat depth with two smooth waves. It scrolls with the camera. Fish artwork is clamped above it, and living cells below it are cleared. There is no separate rock sprite. Source: [aquarium.js](../simulator/aquarium.js) and [simulator.js](../simulator/simulator.js).

### Sediment marks

```text
.
```

**Type:** procedural scenery; **color:** darker blue green `#203b40`; **font:** 16 pixels. Sparse dots fill selected positions below the seabed, providing texture without filling the display. Their placement follows world travel, so they move with the floor. They are neither algae nor bubbles and have no ecological behavior. Source: [simulator.js](../simulator/simulator.js).

### Water background

**Type:** a solid canvas background, with no ASCII glyph; **color:** near black `#02090c`. It fills the complete 1280 × 400 drawing area before terrain and creatures are drawn. The empty space keeps the character art readable. It has no animated surface, waves, sky, or day/night cycle. Source: [simulator.js](../simulator/simulator.js).

### Controls and readouts

The touch panel is an interface overlay rather than an ocean object. It contains Pause or Resume, Step, New world, AI event, Quiet mode, the habitat name, tide counter, narration text, and connection status. It appears when you tap the water and fades after eight seconds. The algae, plankton, fry, and hunter counters exist in the page but are hidden in the full-screen layout.

See the [controls screenshot](screenshots/controls.jpg) and [screenshot tour](SCREENSHOTS.md#touch-controls). Source: [pi.html](../simulator/pi.html) and [simulator.js](../simulator/simulator.js).

## Small life and food web

| Item | Appearance | What it does now |
| --- | --- | --- |
| Algae | Small green teal dot, ` . `, color `#4fb89d` | Starts with 76 cells. Regrows slowly near existing patches and receives occasional additions near the seabed. Declines through natural loss, plankton feeding, travel, and terrain changes. Limited to 100 cells. |
| Plankton | Small pale mint `o`, color `#8fffe0` | Starts with 34 cells. Can drift to neighboring water cells, consume adjacent algae, rarely divide, and naturally disappear. Incoming additions help maintain a light food supply. Limited to 45 cells. |
| Fry | One of the full fish drawings | Non-predator designs receive this role. Each step, a fry with neighboring plankton has a 34 percent chance of consuming one adjacent plankton cell. Fry do not visibly grow into adults. |
| Hunter | One of the full fish drawings | Large ocean fish, silver spearfish, and copper moray drawings receive this role. Only the selected encounter pair hunts at a time; other hunters keep cruising. |
| Empty water | Near-black background, `#02090c` | Open space between the creatures and scenery. Not an organism or particle effect. |

The model uses a 48 × 48 cell grid beneath the detailed drawings. Its text-only symbols are a dot for algae, o for plankton, > for fry, and @ for a hunter. Full-screen mode replaces the last two with fish artwork. If fish occupy the same grid cell, the hidden counters can undercount them; the swimmer list holds their individual identities.

The food chain is **algae → plankton → fry → hunters**, with the final link happening only during rare successful encounters. AI narration describes counts when requested; it does not select prey, create animals, or change their behavior.

## Plants and terrain

### Kelp and seaweed

Kelp is drawn using alternating parentheses for the stalk and slash marks for side fronds. Five greens give it variation: `#438b55`, `#62b878`, `#82c76b`, `#4fa66b`, and `#a0cd78`. Some rows use a neighboring shade to break up flat color.

Clumps belong to fixed positions in the traveling world. Their spacing and appearance depend on the world seed; they enter and leave at the edges as the camera moves. Height ranges from 2 to 18 text rows, scaled by the local habitat. Gentle sideways sway animates the stalks. These plants are scenery: fish do not eat them, and they are separate from the algae cells.

### Seabed contour

Underscore characters draw a rolling floor in muted blue green, `#36575a`. Sparse dots below it provide darker sediment texture, `#203b40`. Two smooth waves add hills and hollows to the habitat depth. Life cells below the floor are cleared, and fish artwork is positioned above it.

### Water and travel

The camera advances 0.08 world cells each tick, roughly 6.1 screen pixels per second. It takes about 3.5 minutes to travel one screen width at the normal update rate. The terrain and kelp stay attached to world positions; fish swim independently. The environmental grid shifts left as travel crosses whole columns.

There are currently no separate rock, coral, shell, wreck, castle, treasure, or surface-wave objects. The diver and its short-lived bubbles are described below. Rocky reef is a habitat name for a different contour and plant density, not a collection of individual rock sprites. Objects elsewhere in the bundled upstream Asciiquarium source are not automatically part of this ocean.

## Habitats

The journey blends between these three habitat settings. Values below describe each habitat at its unblended setting, not sharp boundaries. The center-of-screen label picks the nearer habitat while the visible floor and plants vary smoothly across the screen.

| Habitat | Base floor depth in the 48-row world | Kelp height multiplier | Incoming plankton threshold | Algae addition interval |
| --- | --- | --- | --- | --- |
| Kelp meadow | 41 | 1.00 | 28 | 12 ticks, about 4.2 seconds |
| Rocky reef | 38 | 0.50 | 24 | 18 ticks, about 6.3 seconds |
| Open sand | 44 | 0.12 | 16 | 36 ticks, about 12.6 seconds |

Higher floor-depth numbers place the floor lower on the display. The rolling contour modifies these base depths. Nutrient additions are only attempted when the chosen cell is empty and the algae cap has room. Plankton additions are attempted every 20 ticks, about seven seconds, when the count is below the current threshold; that threshold is not a guaranteed population.

Each transition spans 64 world cells, about 4 minutes 40 seconds. The habitat settings repeat every 192 cells, about 14 minutes. Plant patterns depend on position and seed, so repeating habitat settings do not mean an identical still image. These timings assume continuous running at the intended tick rate; pauses and device delays extend them.

## Visitors and encounters

These behaviors run locally without API calls. They use the same 350-millisecond tick as the rest of the ocean. Pausing stops the visitor, bubbles, chase, and feeding animation; Step advances all of them once. New world resets all timers and visitors.

### Visiting diver

An original ASCII diver has a tank, mask, body, and two alternating flipper poses. Four images cover both poses and directions, cached alongside the fish artwork. The diver swims in the upper water at about 15 pixels per second and stays separate from the eight-fish population.

The first visit is scheduled 5 to 10 minutes after starting. After departure, another 5 to 10 minute wait begins. Active encounters can delay an arrival. Each visit starts and ends fully beyond the screen edges; there is only one diver at a time. Quiet mode keeps this peaceful visitor enabled.

Small bubbles rise near the diver, changing from an o to a dot before vanishing. A bubble lasts under seven seconds, with no more than five allowed at once. They do not feed the ecosystem or reproduce.

### Predators and prey

| Encounter role | Eligible drawings |
| --- | --- |
| Predator | Large ocean fish, silver spearfish, copper moray |
| Prey | Tiny fish, little triangular fish, reef fish, box fish |
| Cruising only | Angelfish, striped fish, rounded fish, diamond fish, curly-fin fish, sunburst puffer, ribbon bannerfish, violet kite ray, blue lanternfish |

After a 2 to 4 minute cooldown, the simulation waits for two swimmer slots and no diver before bringing in a predator and prey from the same edge. Both begin outside the display and cruise into view together. Only one encounter can be active. The cooldown restarts when it ends, so visible encounters are farther apart than the cooldown alone.

The chase begins only when both fish are inside the screen. Prey and predator gradually accelerate instead of changing speed instantly. The pursuit lasts at most about ten seconds. An escape returns both fish smoothly to cruising speed; neither disappears or changes drawing.

### Catch and feeding

Twenty percent of encounter pairs are allowed to catch prey; actual catches can be less frequent because the pursuit must reach visible, aligned mouth contact before its time limit. Most encounters end in escape.

Contact uses the same artwork dimensions, mouth marks, and seabed placement as the renderer. At contact, the prey shrinks into the predator's mouth over about 2.5 seconds while the predator slows. Only then is the prey removed. A replacement later enters from beyond an edge. There is no blood, flashing, or sound.

### Quiet mode

Tap the water and select **Quiet mode: on** to stop chases and catches. An active encounter is cancelled without deleting either fish. Gentle travel, ordinary swimming, and occasional divers continue. Switch it off to allow encounters again.

The setting is remembered in the launcher's browser profile and survives New world and reopening the ocean. If browser storage is unavailable, the toggle still works for the current session. Clearing the browser profile clears the preference. The default is off, enabling these occasional encounters.

### Limits and validation

The implementation caps swimmers at eight, divers at one, and bubbles at five. Checks exercise both swimming directions, wholly off-screen arrivals, visible mouth contact, shrinking prey, escape survival, quiet-mode cancellation, cached drawing, pause, reset, and 30,000 ticks of bounded populations. The browser layout is checked at 1280 × 400; perceived pace still needs your assessment on the physical Pi screen.

## Artwork and maintenance

Eleven designs come from Asciiquarium 1.1. The upstream code credits Kirk Baucom and credits most ASCII artwork to Joan Stark; expanded marine biodiversity was backported by Claudio Matsuoka. Six drawings are original to ASCII Genesis. All are distributed with this project under GPL-2.0-or-later. See [credits](../THIRD-PARTY.txt), [license](../LICENSE.txt), and the preserved [upstream source](../third-party/asciiquarium-upstream.pl).

The installed artwork is in [fish-art.js](../simulator/fish-art.js). Its source drawings and extraction rules are in [original-fish.mjs](../third-party/original-fish.mjs) and [restore-sprites.mjs](../third-party/restore-sprites.mjs). The running rules are in [aquarium.js](../simulator/aquarium.js); colors, terrain drawing, and sprite placement are in [simulator.js](../simulator/simulator.js).

When adding a design, preserve both swimming directions, color masks, credits, and enough off-screen margin for its full width. Update the design-count checks and this library alongside the artwork. The visitor and encounter implementation is in [ocean-life.js](../simulator/ocean-life.js), with checks in [life-check.mjs](../simulator/life-check.mjs). Keep this library in sync when changing behavior.
