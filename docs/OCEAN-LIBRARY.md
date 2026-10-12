# ASCII Genesis Ocean Library

A field guide to everything currently drawn or simulated in the Raspberry Pi 4 ocean on the Waveshare 7.9-inch screen. The collection contains **17 fish designs, 34 directional drawings, two microscopic life types, kelp, and a scrolling seabed across three habitats**. The last section describes proposed visitors and encounters; those are not active features yet.

## How to read the collection

Fish names describe the artwork. They are not verified biological species, and the ocean is a stylized simulation rather than a scientifically accurate marine food web. A bannerfish, moray, or ray currently follows the same basic swimming rules as the other drawings.

**Appearance and role are separate.** Every fish has a design, direction, speed, and either a fry or hunter role. Designs are selected by arrival order and traveling region; neither size nor name decides which fish is a hunter. There are no fixed species territories or species-specific diets yet.

The artwork below is copied from the actual sprite collection, with its spaces preserved. Each entry shows both directions. Dimensions are character columns by text rows, including spacing, and can differ between directions. The screen uses a 16-pixel monospaced font: each row is 16 pixels tall and each character is roughly 9.6 pixels wide, depending on the browser font.

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

- A new world begins with five fry and one hunter already in the scene. Later arrivals start beyond an edge.
- Up to eight swimmers may exist at once, including swimmers outside the visible screen. An arrival opportunity occurs every 24 ticks, about 8.4 seconds, when there is room.
- Individual speeds range from 0.18 to just under 0.45 world cells per tick. At 350 milliseconds per tick and 1280 pixels across 48 world cells, that is roughly 14 to 34 pixels per second. A center crosses the visible width in about 37 to 93 seconds.
- Fish keep their drawing and direction for their whole crossing. They are removed only after their center moves more than 12 world cells beyond an edge. New arrivals start 10 cells beyond an edge.
- Fry can consume nearby plankton. Hunters currently cruise without chasing or eating fish. There is no breeding, aging, health, or hunger system for individual swimmers.
- The renderer keeps each drawing above the local seabed and caches all 34 fish images. Travel changes which designs enter next; it does not transform fish already on screen.

## Fish drawings

### angelfish

A broad rounded body, swept upper fin, forked tail, and a small eye near the nose.

- **Color:** warm gold.
- **Artwork:** Adapted Asciiquarium drawing; see [artwork credits](../THIRD-PARTY.txt).
- **Size:** right 14 × 6; left 14 × 6 characters.
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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
- **Behavior:** shared swimming rules above; no special ability or fixed hunter/prey assignment.

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

## Small life and food web

| Item | Appearance | What it does now |
| --- | --- | --- |
| Algae | Small green teal dot, ` . `, color `#4fb89d` | Starts with 76 cells. Regrows slowly near existing patches and receives occasional additions near the seabed. Declines through natural loss, plankton feeding, travel, and terrain changes. Limited to 100 cells. |
| Plankton | Small pale mint `o`, color `#8fffe0` | Starts with 34 cells. Can drift to neighboring water cells, consume adjacent algae, rarely divide, and naturally disappear. Incoming additions help maintain a light food supply. Limited to 45 cells. |
| Fry | One of the full fish drawings | Five at startup. Each step, a fry with neighboring plankton has a 34 percent chance of consuming one adjacent plankton cell. Fry do not visibly grow into adults. |
| Hunter | One of the full fish drawings | One at startup. Later arrivals fill the hunter role only when no hunter remains in the swimmer list, including off-screen swimmers. Currently has no feeding or pursuit behavior. |
| Empty water | Near-black background, `#02090c` | Open space between the creatures and scenery. Not an organism or particle effect. |

The model uses a 48 × 48 cell grid beneath the detailed drawings. Its text-only symbols are a dot for algae, o for plankton, > for fry, and @ for a hunter. Full-screen mode replaces the last two with fish artwork. If fish occupy the same grid cell, the hidden counters can undercount them; the swimmer list holds their individual identities.

The current food chain is **algae → plankton → fry**. Hunters are present visually but do not yet complete that chain. AI narration describes counts when requested; it does not select prey, create animals, or change their behavior.

## Plants and terrain

### Kelp and seaweed

Kelp is drawn using alternating parentheses for the stalk and slash marks for side fronds. Five greens give it variation: `#438b55`, `#62b878`, `#82c76b`, `#4fa66b`, and `#a0cd78`. Some rows use a neighboring shade to break up flat color.

Clumps belong to fixed positions in the traveling world. Their spacing and appearance depend on the world seed; they enter and leave at the edges as the camera moves. Height ranges from 2 to 18 text rows, scaled by the local habitat. Gentle sideways sway animates the stalks. These plants are scenery: fish do not eat them, and they are separate from the algae cells.

### Seabed contour

Underscore characters draw a rolling floor in muted blue green, `#36575a`. Sparse dots below it provide darker sediment texture, `#203b40`. Two smooth waves add hills and hollows to the habitat depth. Life cells below the floor are cleared, and fish artwork is positioned above it.

### Water and travel

The camera advances 0.08 world cells each tick, roughly 6.1 screen pixels per second. It takes about 3.5 minutes to travel one screen width at the normal update rate. The terrain and kelp stay attached to world positions; fish swim independently. The environmental grid shifts left as travel crosses whole columns.

There are currently no separate rock, coral, shell, wreck, castle, treasure, bubble, diver, or surface-wave objects. Rocky reef is a habitat name for a different contour and plant density, not a collection of individual rock sprites. Objects elsewhere in the bundled upstream Asciiquarium source are not automatically part of this ocean.

## Habitats

The journey blends between these three habitat settings. Values below describe each habitat at its unblended setting, not sharp boundaries. The center-of-screen label picks the nearer habitat while the visible floor and plants vary smoothly across the screen.

| Habitat | Base floor depth in the 48-row world | Kelp height multiplier | Incoming plankton threshold | Algae addition interval |
| --- | --- | --- | --- | --- |
| Kelp meadow | 41 | 1.00 | 28 | 12 ticks, about 4.2 seconds |
| Rocky reef | 38 | 0.50 | 24 | 18 ticks, about 6.3 seconds |
| Open sand | 44 | 0.12 | 16 | 36 ticks, about 12.6 seconds |

Higher floor-depth numbers place the floor lower on the display. The rolling contour modifies these base depths. Nutrient additions are only attempted when the chosen cell is empty and the algae cap has room. Plankton additions are attempted every 20 ticks, about seven seconds, when the count is below the current threshold; that threshold is not a guaranteed population.

Each transition spans 64 world cells, about 4 minutes 40 seconds. The habitat settings repeat every 192 cells, about 14 minutes. Plant patterns depend on position and seed, so repeating habitat settings do not mean an identical still image. These timings assume continuous running at the intended tick rate; pauses and device delays extend them.

## Proposed visitors and encounters

These additions are a design proposal, not current behavior. The goal is an occasional moment of interest within a calm desktop ocean.

### Visiting diver

Add a small hand-drawn diver with a tank, mask, and slowly changing flipper pose. A starting target is one visit every 5 to 10 minutes, with the first visit delayed. Enter fully off screen, swim gently across, and leave fully off screen. Allow only one diver at a time, with a few short-lived bubbles close to the tank rather than a new permanent particle population. The diver would observe the ocean, not chase fish.

### Prey escape

Allow one brief encounter at a time, with a tentative cooldown of 2 to 4 minutes between encounters. Select a visibly larger suitable hunter and a smaller suitable prey fish traveling in a compatible lane. Let prey accelerate briefly and the hunter follow for a few seconds. Most encounters should end in escape; both animals then settle back to cruising or finish leaving the screen. Avoid sudden direction flips and long diagonal dashes.

This needs explicit predator/prey eligibility tied to artwork. The current arbitrary hunter role could make a tiny fish pursue a much larger one. Give each suitable design a size category and an allowed role before enabling chases.

### Catch and feeding

A rare successful hunt could end when the prey reaches the predator's mouth, followed by a short feeding pause. Use no blood, flashing, or sound. The prey should disappear only at visible contact, with its replacement arriving later from beyond an edge. That makes a catch understandable rather than looking like the existing mid-screen disappearance bug returning.

Provide a quiet-mode switch that disables chases and catches. A useful first trial would make escapes common and successful catches a small minority. Exact frequency and catch rate should be tuned on the physical 7.9-inch screen.

### Implementation order

1. Add the diver as an independent rare visitor, preserving the existing eight-fish limit.
2. Add size-aware roles and short escape encounters with no catches.
3. Add optional catches after checking that contact is readable and the mood stays peaceful.

All three can run locally on the Pi without API calls. Keep artwork cached, bound bubble counts, and test entry, exit, contact, pause, reset, and long-running population limits. The renderer currently clamps fish vertically above terrain, so encounter contact must use the same displayed positions rather than grid distance alone.

## Artwork and maintenance

Eleven designs come from Asciiquarium 1.1. The upstream code credits Kirk Baucom and credits most ASCII artwork to Joan Stark; expanded marine biodiversity was backported by Claudio Matsuoka. Six drawings are original to ASCII Genesis. All are distributed with this project under GPL-2.0-or-later. See [credits](../THIRD-PARTY.txt), [license](../LICENSE.txt), and the preserved [upstream source](../third-party/asciiquarium-upstream.pl).

The installed artwork is in [fish-art.js](../simulator/fish-art.js). Its source drawings and extraction rules are in [original-fish.mjs](../third-party/original-fish.mjs) and [restore-sprites.mjs](../third-party/restore-sprites.mjs). The running rules are in [aquarium.js](../simulator/aquarium.js); colors, terrain drawing, and sprite placement are in [simulator.js](../simulator/simulator.js).

When adding a design, preserve both swimming directions, color masks, credits, and enough off-screen margin for its full width. Update the design-count checks and this library alongside the artwork. When adding a behavior, move its description out of the proposed section only once it is implemented and verified.
