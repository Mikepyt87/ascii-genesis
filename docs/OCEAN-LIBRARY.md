# ASCII Genesis Ocean Library

A field guide to everything currently drawn or simulated in the Raspberry Pi 4 ocean on the Waveshare 7.9-inch screen. The regular collection contains **27 sea-creature designs and a submarine, 56 directional drawings, two microscopic life types, a two-pose diver, bubbles, kelp, seabed contours, sediment texture, and water across six habitats**. An occasional diver visits, and brief predator encounters sometimes end in a catch. Quiet mode turns hunting off. A peeking eel and distant whale are additional visiting wildlife, documented alongside the diver. Surface stretches now add sailing boats, a spouting surface whale, and a two-pose sea monster, with castles and submerged ruins along the seabed. These additions are separate from the 28-design lineup; see [surface scenes and landmarks](SURFACE-SCENES.md).

## Thanks to the original creators

Much of the character of this ocean comes from [Asciiquarium](https://github.com/cmatsuoka/asciiquarium): **Kirk Baucom** created the original project, **Joan Stark** is credited upstream for most of its ASCII art, and **Claudio Matsuoka** expanded its marine biodiversity. Eleven fish designs here adapt their shared work. **xanderchinxyz and the [OpenGhost](https://github.com/xanderchinxyz/OpenGhost) contributors** inspired the initial physical-display exploration. Please visit their projects and read [Credits and project origins](../CREDITS.md).

The [creature proportion guide](CREATURE-SIZES.md) records the current size relationship across all three editions.

## How to read the collection

Fish names describe the artwork. They are not verified biological species, and the ocean is a stylized simulation rather than a scientifically accurate marine food web. The waterline waits above existing swimmers; surface changes never remove them or move their drawings into another lane. All creatures share the same population and edge rules, with distinct movement for rays, turtles, octopuses, and jellyfish.

**Appearance determines hunting eligibility.** Large ocean fish, silver spearfish, copper morays, and reef sharks have the hunter role. Tiny fish, little triangular fish, reef fish, and box fish can be selected as prey in encounters. Other designs cruise without being selected for hunts. These are artistic simulation roles, not claims about real diets. There are no fixed species territories.

The artwork below is copied from the actual sprite collection, with its spaces preserved. Each entry shows both directions. Dimensions are character columns by text rows, including spacing, and can differ between directions. The screen uses a 16-pixel monospaced font: each row is 16 pixels tall and each character is roughly 9.6 pixels wide, depending on the browser font.

## Library navigation

- [Creature index](#creature-index) and [all 28 creature drawings](#creature-drawings)
- [Visiting wildlife](#visiting-wildlife-index): diver, peeking eel, and distant whale
- [Surface scenes and landmarks](SURFACE-SCENES.md): boat, spouting whale, sea monster, castles, and ruins
- [Movement, schools, and lighting](#movement-and-lighting)
- [Other objects](#other-objects-index), [scenery](#expanded-ocean-objects), and [habitats](#habitats)
- [Encounters](#visitors-and-encounters), [parade](#creature-parade), and [artwork credits](#artwork-and-maintenance)

## Creature index

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
| 18 | [rose squid](#rose-squid) | rose and dusty pink | ASCII Genesis |
| 19 | [violet octopus](#violet-octopus) | violet and muted purple | ASCII Genesis |
| 20 | [sea turtle](#sea-turtle) | soft green and teal green | ASCII Genesis |
| 21 | [moon jellyfish](#moon-jellyfish) | pale blue and lavender | ASCII Genesis |
| 22 | [shore crab](#shore-crab) | warm copper | ASCII Genesis |
| 23 | [reef lobster](#reef-lobster) | red and rust | ASCII Genesis |
| 24 | [reef shark](#reef-shark) | slate blue | ASCII Genesis |
| 25 | [humpback whale](#humpback-whale) | soft blue | ASCII Genesis |
| 26 | [yellow submarine](#yellow-submarine) | muted yellow | ASCII Genesis |
| 27 | [lionfish](#lionfish) | copper and cream | ASCII Genesis |
| 28 | [peacock mantis shrimp](#peacock-mantis-shrimp) | green, blue, and orange | ASCII Genesis |

## Visiting wildlife index

The numbered collection contains 27 sea-creature designs and one submarine, making 28 regular designs in the parade lineup. These additional visitors have their own drawings and behavior; they do not occupy the regular swimmer slots or join the parade.

| Visitor | Appearance and behavior | Source |
| --- | --- | --- |
| [Diver](#diver-artwork) | Two poses, both directions, sparse rising bubbles | ASCII Genesis |
| [Peeking eel](#peeking-eel) | Sandy copper eel at a scrolling wreck opening | ASCII Genesis |
| [Distant whale](#distant-whale) | Muted blue silhouette, both directions, rare crossing | ASCII Genesis |

## Shared swimming behavior

- A new world begins with six swimmers already in the scene. Their roles follow their designs. Later arrivals, including encounter pairs, start beyond an edge.
- Up to eight swimmers may exist at once, including swimmers outside the visible screen. A normal arrival opportunity occurs every 24 ticks, about 8.4 seconds, when there is room. A pending encounter reserves two slots so it can introduce a suitable pair without exceeding the cap.
- Normal individual speeds range from 0.18 to just under 0.45 world cells per tick. At 350 milliseconds per tick and 1280 pixels across 48 world cells, that is roughly 14 to 34 pixels per second. A center crosses the visible width in about 37 to 93 seconds. Jellyfish and octopus arrivals are slower (0.12 and 0.16 cells per tick); schools share a group speed. See [movement and lighting](#movement-and-lighting).
- Fish keep their drawing and direction for their whole crossing. Ordinary departures are removed after their center reaches 20 world cells beyond an edge. Normal arrivals start 10 cells beyond an edge. An encounter pair starts 10 and 18 cells beyond the same edge. A successful catch is the only removal inside the visible screen.
- Brief overlaps are allowed. Unrelated same-direction swimmers with substantially overlapping displayed bodies and nearly matching speeds get a gentle spacing adjustment after eight ticks (2.8 seconds): the leader targets at least 0.12 cells per tick above its base pace, while the follower eases back by up to 0.06. Targets stay in place until the drawings have 24 pixels of horizontal clearance, or separate vertically, then ease back to base speed. This also accounts for floor-clamped crab, lobster, and mantis shrimp drawings without lifting them off the ground. Schools and active encounter participants are excluded; the parade runs separately.
- Fry can consume nearby plankton. Hunters normally cruise; selected encounter pairs briefly chase, and some catch prey. There is no breeding, aging, health, or hunger system for individual swimmers.
- The renderer keeps each drawing above the local seabed and caches all 56 creature images. Travel changes which designs enter next; it does not transform fish already on screen.

## Creature drawings

### angelfish

A broad rounded body, swept upper fin, forked tail, and a small eye near the nose.

- **Color:** warm gold.
- **Artwork:** Adapted Asciiquarium drawing; see [artwork credits](../THIRD-PARTY.txt).
- **Size:** right 14 × 6; left 14 × 6 characters.
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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
- **Behavior:** see [shared swimming rules](#shared-swimming-behavior), [movement styles](#movement-and-lighting), and [encounter eligibility](#predators-and-prey).

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

### rose squid

A pointed mantle with small triangular fins, a visible eye near its base, and long trailing tentacle marks. Its rose body and dusty pink edges distinguish it from the fish.

**Source:** original ASCII Genesis art in [original-fish.mjs](../third-party/original-fish.mjs), GPL-2.0-or-later. **Body color:** #d39b9e; **edges:** #b87b8c. **Behavior:** ordinary varying-speed cruising; no hunting.

Facing right (15 columns × 5 rows):

```text
  ~\       /\  
 ~~\______/  \ 
 ~~~< o       >
 ~~ /----\___/ 
  ~/      \/   
```

Facing left (15 columns × 5 rows):

```text
  /\       /~  
 /  \______/~~ 
<       o >~~~ 
 \___/----\ ~~ 
   \/      \~  
```

### violet octopus

A rounded dome and paired eyes above a cluster of curling arms. Violet and muted purple keep the outline distinct against the dark water.

**Source:** original ASCII Genesis art in [original-fish.mjs](../third-party/original-fish.mjs), GPL-2.0-or-later. **Body color:** #ba9dce; **edges:** #997caf. **Behavior:** ordinary varying-speed cruising; no hunting.

Facing right (16 columns × 7 rows):

```text
      .---.     
     /     \    
    ( o   o )   
     \_____/    
   __/|||||\__  
  / / ||||| \ \ 
 (_( (_|||_) )_)
```

Facing left (16 columns × 7 rows):

```text
     .---.      
    /     \     
   ( o   o )    
    \_____/     
  __/|||||\__   
 / / ||||| \ \  
(_( (_|||_) )_) 
```

### sea turtle

A soft green sea turtle with a patterned rounded shell, flippers, a small tail, and a head with a cream eye. It joins the same varying-speed, off-screen arrival and departure rotation as the fish and cephalopods. Its artwork is static. It is neither a predator nor selected prey in hunting encounters.

**Source:** original ASCII Genesis artwork in [original-fish.mjs](../third-party/original-fish.mjs), GPL-2.0-or-later. **Shell color:** `#8bb58a`; **edges and flippers:** `#66957b`. The simplified food web assigns the turtle the generic fry role, including its plankton-feeding rule; this is a visual simulation rather than a realistic turtle diet.

Facing right (21 columns × 5 rows):

```text
       .-"""-.       
     .' /_|_\ '.     
  _ /__/__|__\__\ __ 
 <_(   \__|__/  )(o)>
    \_/\_____/\_/    
```

Facing left (21 columns × 5 rows):

```text
       .-"""-.       
     .' /_|_\ '.     
 __ /__/__|__\__\ _  
<(o)(  \__|__/   )_> 
    \_/\_____/\_/    
```

### moon jellyfish

**Original ASCII Genesis artwork; GPL-2.0-or-later.** Design 21; pale blue `#a8c9e8` with lavender fins/tentacles `#8e9fc9`. A rounded bell with dangling tentacles. Not a hunter or selected prey.

**Right-facing: 6 columns × 4 rows**

```text
 .--. 
( .. )
 '--' 
 )||( 
```

**Left-facing: 6 columns × 4 rows**

```text
 .--. 
( .. )
 '--' 
 )||( 
```

### shore crab

**Original ASCII Genesis artwork; GPL-2.0-or-later.** Design 22.

**Behavior:** A slow seabed crawler. New arrivals move at 0.10 cells per tick. Its feet stay two screen pixels above the highest floor under its full width, including during the parade. It is not selected for hunts.

**Right-facing: 11 columns × 4 rows**

```text
() (o o) ()
 \--_--/   
 /|||||\   
/_/|||\_\  
```

**Left-facing: 11 columns × 4 rows**

```text
() (o o) ()
   \--_--/ 
   /|||||\ 
  /_/|||\_\
```
### reef lobster

**Original ASCII Genesis artwork; GPL-2.0-or-later.** Design 23.

**Behavior:** A red lobster with claws, segmented body, and walking legs. New arrivals move at 0.12 cells per tick. It uses the same grounded placement as the crab and stays at the bottom through terrain changes and the parade. It is not selected for hunts.

**Right-facing: 15 columns × 5 rows**

```text
           __  
 _/\_ _ _ /o \ 
<_  _>=|=(__)=>
  \/ / / \ \_> 
    /_/   \_\  
```

**Left-facing: 15 columns × 5 rows**

```text
  __           
 / o\ _ _ _/\_ 
<=(__)=|=<_  _>
 <_/ / \ \ \/  
  /_/   \_\    
```
### reef shark

**Original ASCII Genesis artwork; GPL-2.0-or-later.** Design 24.

**Behavior:** A slate-blue shark with a tall dorsal fin, gill marks, and a pointed snout. It cruises in the normal rotation and is also eligible as an occasional pursuit predator. Existing quiet mode, contact rules, and encounter cooldowns apply.

**Right-facing: 31 columns × 6 rows**

```text
                 /|            
    /\    ______/ |________    
   /  \__/    ---    o      \__
  <   _      (((             _>
   \_/ '-----.______   _____/  
               \___\_/         
```

**Left-facing: 31 columns × 6 rows**

```text
            |\                 
    ________| \______    /\    
__/      o    ---    \__/  \   
<_             )))      _   >  
  \_____   ______.-----' \_/   
         \_/___/               
```
### humpback whale

**Original ASCII Genesis artwork; GPL-2.0-or-later.** Design 25.

**Behavior:** A larger blue whale with a rounded body, tail flukes, and a long flipper. It joins the regular rotation at 0.16 cells per tick with a gentle vertical glide. It is separate from the faint distant-whale discovery, and is not selected for hunts.

**Right-facing: 41 columns × 6 rows**

```text
                   ____                  
       ___________/    \______________   
  __  /                            o  \_ 
 <  \/      __                        __)
  \_/\_____/  \______________________/   
             \____/                      
```

**Left-facing: 41 columns × 6 rows**

```text
                  ____                   
   ______________/    \___________       
 _/  o                            \  __  
(__                        __      \/  > 
   \______________________/  \_____/\_/  
                      \____/             
```
### yellow submarine

**Original ASCII Genesis artwork; GPL-2.0-or-later.** Design 26.

**Behavior:** A yellow research submarine with a periscope, three portholes, and a rear propeller housing. It travels at 0.20 cells per tick and keeps its depth, subject to the seabed clamp. This is a vehicle, not an animal: it uses a regular display slot but does not eat plankton, hunt, or count as fry/hunters in the food web.

**Right-facing: 27 columns × 6 rows**

```text
               _           
              | |_         
          ____|___|____    
   __   .'             '.  
  [__]==|  (o) (o) (o)   )>
        '.___=======___.'  
```

**Left-facing: 27 columns × 6 rows**

```text
           _               
         _| |              
    ____|___|____          
  .'             '.   __   
<(   (o) (o) (o)  |==[__]  
  '.___=======___.'        
```

### lionfish

**Original ASCII Genesis artwork; GPL-2.0-or-later.** Design 27.

A copper lionfish with pale diagonal body stripes, long dorsal spines, and a broad fan of lower fins. Body color `#d6a080`, fins `#b96f53`, pale stripes `#e4dfc5`, and a cream eye. The nine-row drawing is 144 pixels tall at the normal font size.

**Behavior:** ordinary varying-speed cruising, off-screen arrivals and departures, and gentle spacing when unrelated creatures remain overlapped. Included in the two-minute parade. It is not selected for hunting encounters in this stylized simulation.

**Right-facing: 22 columns × 9 rows**

```text
        \   |   /  /  
     \   \  |  /  /   
      \ .-||||||-.    
  /\   / /|/|/|  o\__ 
 <  >==| /|/|/|     _>
  \/   \_\|\|\|___/   
       / / | | \ \    
      / /  | |  \ \   
        /  |  \       
```

**Left-facing: 22 columns × 9 rows**

```text
  \  \   |   /        
   \  \  |  /   /     
    .-||||||-. /      
 __/o  |\|\|\ \   /\  
<_     |\|\|\ |==<  > 
   \___|/|/|/_/   \/  
    / / | | \ \       
   / /  | |  \ \      
       /  |  \        
```

### peacock mantis shrimp

**Original ASCII Genesis artwork; GPL-2.0-or-later.** Design 28.

Stalked cream eyes, a segmented green body, a tail fan, blue legs, and orange folded clubs. Both editions share these four-row directional drawings. In the Pi edition it stays on the seabed, follows changing terrain, and joins the two-minute parade. It is decorative and is not selected for hunting encounters. The Mini includes it in its three-creature rotation and opening scene.

**Right-facing: 16 columns × 4 rows**

```text
            o o 
 _/\_ _ _ .-'=\ 
<_  _>=|=|_  _)>
  \/ /_/_/\_(](]
```

**Left-facing: 16 columns × 4 rows**

```text
 o o            
 /='-. _ _ _/\_ 
<(_  _|=|=<_  _>
[)[)_/\_\_\ \/  
```

## Visiting wildlife drawings

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

### Peeking eel

**Original ASCII Genesis artwork; GPL-2.0-or-later.** sandy copper `#ad9b77`, three rows. A separate decorative eel fades in and out from the enlarged wreck’s central hull opening during brief windows of its slow sine cycle. It does not replace or change a swimming copper moray and is not a hunting agent.

```text
 __    __
/  \__/ o>
\_______/
```

### Distant whale

**Original ASCII Genesis artwork; GPL-2.0-or-later.** muted blue `#426573`, five rows, mirrored for both directions. It starts 24 world cells outside an edge and travels at 0.16 cells per tick until it fully clears the opposite side. It appears behind the normal scene, with restrained opacity. This visitor is separate from the regular humpback whale design above. Only one whale/glow discovery can exist at once.

```text
          ___
    _____/   \________________
 __/                         o \__
<__    _________________________  >
   \__/     \____/       \_____/
```

## Movement and lighting

- **Schools:** three tiny or little triangular fish arrive together from the same edge when three slots are available. School opportunities wait 60–120 seconds and can be delayed by crowding or hunts. Members share their direction and speed. A hunter within eight world cells makes them spread vertically; they ease back together afterward. Total swimmers remain capped at eight.
- **Jellyfish:** new arrivals cruise at 0.12 cells per tick, rise 0.025 cells per tick toward row eight, and bob gently. Their cached drawing pulses by up to 3.5 percent in width.
- **Rays:** glide up and down by 1.5 world rows without changing direction.
- **Turtles:** start a gentle surface visit after 100 movement ticks, turn back after 180, and return toward their original depth. This is a stylized surface visit, not a breathing simulation.
- **Octopuses:** new arrivals crawl at 0.16 cells per tick, with visible arms grounded along the scrolling seabed during normal movement and the parade.
- **Crab, lobster, and mantis shrimp:** slow horizontal crawling, grounded along the highest seabed point under the body. They stay grounded in the parade too.
- **Whale and submarine:** the regular whale glides gently up and down; the submarine maintains a steady depth. The submarine occupies one of the eight display slots but is excluded from the food web.
- **Day/night:** the default cycle lasts 20 minutes of unpaused simulation time. Light is brightest at its start, darkest halfway through, and smoothly changes throughout. Local-clock mode follows the Pi's hour and minute, brightest at noon and darkest at midnight. The clock button's preference survives resets and reopening. Pausing holds the picture; resuming local-clock mode follows the current time. Night tint opacity never exceeds 18 percent.
- **Night arrivals:** every fourth arrival may favor a lanternfish or jellyfish if that drawing is available, while ordinary design rotation continues. This is artistic scheduling, not a biological claim.
- The normal world, species movement, lighting, and discovery timers are held during the creature parade. Quiet mode does not turn off peaceful additions.

## Other objects index

Regular creatures and visiting wildlife appear in the indexes above. Every other visible ocean object has an entry here; habitat settings and the control panel are included too. Tank, mask, arms, and fins are parts of one diver sprite, rather than independent objects.

| Object or feature | Category | Visual example and details |
| --- | --- | --- |
| Fish and diver bubbles | Temporary particles | [Rising bubbles](#diver-bubbles) |
| Algae | Simulated life | [Algae dots](#algae-dots) |
| Plankton | Simulated life | [Plankton glyphs](#plankton-glyphs) |
| Kelp stalks and fronds | Procedural scenery | [Kelp artwork](#kelp-artwork) |
| Seabed contour | Procedural scenery | [Floor contour](#floor-contour) |
| Sediment texture | Procedural scenery | [Sediment marks](#sediment-marks) |
| Water | Background | [Water background](#water-background) |
| Six ocean habitats | Habitat settings | [Habitats](#habitats) |
| Coral | Procedural scenery | [Branching coral](#coral) |
| Seagrass | Procedural scenery | [Seagrass leaves](#seagrass) |
| Rocks, crevices, anchors, debris, and coral variants | Scrolling scenery | [Terrain landmarks](#terrain-landmarks) |
| Distant ridge and sand ripples | Background and ground texture | [Depth and dunes](#depth-and-dunes) |
| Shipwreck | Scrolling scenery | [Wreck artwork](#shipwreck) |
| Surface visitors, waterline, castles, and ruins | World-seeded scenery and visits | [Surface scenes and landmarks](SURFACE-SCENES.md) |
| Glowing plankton patch | Decorative discovery | [Temporary glowing marks](#glowing-plankton-patch) |
| Day/night lighting and schools | Local behavior | [Movement and lighting](#movement-and-lighting) |
| Touch panel and readouts | Interface | [Controls and readouts](#controls-and-readouts) |
| Prey shrinking at mouth contact | Fish animation | [Catch and feeding](#catch-and-feeding) |

## Other object drawings

The diver drawings below are copied directly from the current renderer. The remaining objects use glyphs placed by procedural rules, so they have no single fixed multi-line sprite. Their entries show the actual glyphs and explain how they form the scene.

### Diver bubbles

Actual glyphs, in life order:

```text
o  .
```

**Color:** muted blue green `#71969c`; **font:** 10 pixels. Fish and diver bubbles share one budget. A bubble uses `o` until it is within twenty screen pixels of the current waterline, then a dot. Fish emission attempts are spaced 7–12 seconds apart; diver emissions also respect the shared cooldown. Each rises 0.45 world cells per tick and drifts left 0.025 cells per tick. It disappears at the current waterline or before age 180 ticks. See the [complete bubble behavior](SURFACE-SCENES.md#sparse-bubbles).

**Limit:** three bubbles shared by fish and the diver. They have no reproduction or food-web role. Pale mint plankton is drawn as dots rather than bubble-like `o` glyphs. Source: [ocean-life.js](../simulator/ocean-life.js) and [simulator.js](../simulator/simulator.js).

### Algae dots

```text
.
```

**Type:** living cells in the food web; **color:** `#4fb89d`; **font:** 10 pixels. Each cell draws one small dot. Starts at 76 cells and stays capped at 100. Plankton can consume algae; algae can slowly regrow and receive additions near the seabed. Its position follows the scrolling environmental grid. Algae is separate from the larger kelp scenery and from darker sediment dots. Source: [aquarium.js](../simulator/aquarium.js).

### Plankton glyphs

```text
.
```

**Type:** living cells in the food web; **color:** `#8fffe0`; **font:** 10 pixels. Starts at 34 cells and stays capped at 45. Plankton can consume neighboring algae, move to nearby empty water, rarely divide, and naturally disappear. Fry can consume it. Incoming additions vary with the traveling habitat. The canvas draws these as bright mint dots; the underlying ASCII grid still uses `o` for plankton. Rising bubbles use a dimmer color and a distinct moving `o` that changes to a dot near the waterline. Source: [aquarium.js](../simulator/aquarium.js).

### Kelp artwork

Actual stalk and frond glyphs:

```text
(  )  /
```

**Type:** procedural scenery. Alternating parentheses draw stalk segments; slash marks form side fronds at alternating heights. Roots stay attached to the seabed; sway increases toward the upper fronds. Plant roots, floor underscores, and sediment dots use the same camera displacement, about 6.1 screen pixels per second. Ground glyphs are anchored to fixed world columns rather than redrawn on a stationary screen grid. Five greens vary between clumps and along each plant: `#438b55`, `#62b878`, `#82c76b`, `#4fa66b`, `#a0cd78`.

**Placement:** clumps belong to fixed world coordinates and scroll past the camera. **Height:** 2–22 text rows, scaled by habitat. They can be tall in a kelp meadow and short over open sand. Stalks and fronds are parts of the same generated plant, and they do not grow as ecological algae cells. Source: [simulator.js](../simulator/simulator.js); see [kelp and seaweed](#kelp-and-seaweed) for the planting rules.

### Floor contour

```text
_
```

**Type:** procedural scenery; **color:** `#36575a`; **font:** 16 pixels on the target screen. Underscores are placed at the height of the rolling floor to form a continuous-looking seabed. The contour blends habitat-specific shapes: smooth ledges in rocky reefs, broad dunes in sand, low outcrops in coral gardens, shallow undulations in seagrass, and deeper rolling basins near wrecks. It scrolls with the camera. Fish artwork is clamped above it, and living cells below it are cleared. Separate cached boulder and crevice drawings add rocky landmarks. Source: [aquarium.js](../simulator/aquarium.js) and [simulator.js](../simulator/simulator.js).

### Sediment marks

```text
.
```

**Type:** procedural scenery; **color:** darker blue green `#203b40`; **font:** 16 pixels. Sparse dots fill selected positions below the seabed, providing texture without filling the display. Their placement follows world travel, so they move with the floor. They are neither algae nor bubbles and have no ecological behavior. Source: [simulator.js](../simulator/simulator.js).

### Water background

**Type:** a solid canvas background, with no ASCII glyph; **color:** near black `#02090c`. It fills the complete 1280 × 400 drawing area before terrain and creatures are drawn. The empty space keeps the character art readable. Occasional surface stretches add a dark sky area and an animated waterline; see [surface scenes](SURFACE-SCENES.md). Day/night lighting gradually adjusts the background and adds a restrained blue tint at night. Source: [simulator.js](../simulator/simulator.js).

### Controls and readouts

The touch panel is an interface overlay rather than an ocean object. It contains Pause or Resume, Step, New world, AI event, Quiet mode, Creature parade, Lighting, Close ocean, the habitat name and day/night label, tide counter, narration text, and connection status. It appears when you tap the water and fades after eight seconds. The algae, plankton, fry, and hunter counters exist in the page but are hidden in the full-screen layout. Close ocean returns to the Pi desktop when launched through its desktop icon; it ends the dedicated browser and server session. A standalone browser preview stays open and shows an explanatory message.

The Lighting button switches between the ocean cycle and local clock; both modes are described under [movement and lighting](#movement-and-lighting). The older controls image predates this extra button.

See the [controls screenshot](screenshots/controls.jpg) and [screenshot tour](SCREENSHOTS.md#touch-controls). Source: [pi.html](../simulator/pi.html) and [simulator.js](../simulator/simulator.js).

## Expanded ocean objects

These are original ASCII Genesis scenery and decorative effects, under GPL-2.0-or-later. Coral, rock, anchor, debris, and wreck drawings are cached once; seagrass and glowing marks are drawn procedurally. They do not reproduce, consume food, or count as swimmers.

### Coral

 Three original forms in muted rose `#b8869e`, lavender `#a786b9`, and sandy coral `#b9967c`, four to five rows tall. Sparse branching clusters belong to fixed world slots in coral gardens. The rose form is shown below; the additional forms are shown under terrain landmarks.

```text
  \ | /
 _/\|/\_
    ||
   _||_
```

### Seagrass

 uses the same five green shades as kelp, with straighter `|` and `/` leaves. Heights and positions vary deterministically with world coordinates and seed in seagrass habitats.

### Shipwreck

 blue green `#64888b`, nine rows, over four times the width and three times the height of the peeking eel. One fixed wreck coordinate per shipwreck habitat segment, drawn above the local floor. It enters and exits through scrolling; it is not respawned inside the view.

```text
                    |
               _____|_____
              /___________\
       _______|  []   []  |________
  ____/  [] [] |__________| [] []   \___
  \             [_______]            /
   \______                  _______/
          \________________/
            /_/        /_/
```

### Glowing plankton patch

 18 pale blue `·`/`o` marks, separate from the ecological plankton grid. It fades in, drifts gently, and fades out over 86 ticks (about 30 seconds), without creating new food-web cells.

### Discovery scheduling

 the first whale or glow patch waits 5–10 minutes; another 5–10 minute cooldown begins after it finishes. Active hunts or divers delay discovery starts. Discovery visits also delay new hunters and divers, keeping the scene from accumulating simultaneous events. Whale crossings last about 3.5 minutes, including their off-screen travel. Glowing patches last about 30 seconds. The eel follows the wreck's independent peek cycle.


### Terrain landmarks

All foreground landmarks stay at fixed world coordinates and move with the seabed, plants, and wreck. Their type and appearance depend on the world seed and local habitat. They enter and leave through the edges; redraws do not reroll their positions. At most one candidate is considered per 12-world-cell slot, and most slots are empty. These are decorative objects, not collision obstacles or new food-web agents.

**Boulders:** three muted blue/gray/green forms, three to four rows, colors `#52666a`, `#5a626b`, and `#596c69`. Mostly found in rocky reefs, with occasional stones in kelp meadows.

```text
    ____
 __/ .  \_
/___..____\

     ___
 ___/   \
/ .  __  \_
\___/  \___/

   ______
 _/ .  . \_
/__________\
```

**Crevice:** two small rocky banks around a central gap, three rows, `#4d6266`. Adds the appearance of shelter on rocky ground; animals do not yet enter the gap or react to it.

```text
   ___      ___
 _/   \    /   \_
/______\__/______\
```

**Anchor:** five rows, gray blue `#6f7b80`. Occasional landmarks near shipwreck depths and more sparsely on open sand.

```text
    O
    |
  --+--
 \  |  /
  \_|_/
```

**Wreck debris:** three broken timber/hull fragments, three rows each, colors `#576d72`, `#56666d`, and `#5e6c6d`. Separate from the large wreck and its eel.

```text
   __|___
 _/[] __/
 \__/__/

  __    __
 /_/\__/ /
 \__[]__/

 __/___
/__/__/
  /_/
```

**Additional coral forms:** branching lavender and sandy coral clusters, mixed with the original rose form.

```text
   /|   |\
 _/ |\ /| \_
    | Y |
  __|_|_|__

     _/\_
  __/ /\ \__
 /_/\ || /\_\
      ||
    __||__
```

### Depth and dunes

**Distant ridge:** a faint blue-gray underscore contour (`#14262d`) drawn behind the foreground scenery. Its camera moves at 35 percent of the foreground speed, roughly 2.1 screen pixels per second. This is intentional depth parallax: foreground plants and ground continue moving together at roughly 6.1 pixels per second. The ridge has no collision or food-web role.

**Sand ripples:** sparse dark blue-green `~` marks (`#28464a`) below the floor in open sand. They stay attached to the same world columns as sediment, so they do not slide independently.

**Habitat contours:** rocky reefs use gently rounded terrace steps with steeper transitions between flatter ledges; sand uses broad dunes; coral gardens have low outcrops; seagrass stays comparatively level; wreck depths have broad deeper basins. Shapes blend continuously across habitat boundaries, rather than popping to new heights. Floor depth stays between rows 33 and 46, preserving water space and some bottom texture. No vertical camera movement is introduced.

Source: [aquarium.js](../simulator/aquarium.js) and [simulator.js](../simulator/simulator.js). Tests in [terrain-check.mjs](../simulator/terrain-check.mjs) cover continuity, bounds, stable world positions, landmark variety, and vegetation contrast. Renderer checks verify equal foreground/root movement and slower background movement.

## Small life and food web

| Item | Appearance | What it does now |
| --- | --- | --- |
| Algae | Small green teal dot, ` . `, color `#4fb89d` | Starts with 76 cells. Regrows slowly near existing patches and receives occasional additions near the seabed. Declines through natural loss, plankton feeding, travel, and terrain changes. Limited to 100 cells. |
| Plankton | Small pale mint `o`, color `#8fffe0` | Starts with 34 cells. Can drift to neighboring water cells, consume adjacent algae, rarely divide, and naturally disappear. Incoming additions help maintain a light food supply. Limited to 45 cells. |
| Fry | One of the full fish drawings | Non-predator creature designs receive this role; the submarine is excluded. Each step, a fry with neighboring plankton has a 34 percent chance of consuming one adjacent plankton cell. Fry do not visibly grow into adults. |
| Hunter | One of the full fish drawings | Large ocean fish, silver spearfish, copper moray, and reef shark drawings receive this role. Only the selected encounter pair hunts at a time; other hunters keep cruising. |
| Empty water | Near-black background, `#02090c` | Open space between the creatures and scenery. Not an organism or particle effect. |

The model uses a 48 × 48 cell grid beneath the detailed drawings. Its text-only symbols are a dot for algae, o for plankton, > for fry, and @ for a hunter. Full-screen mode replaces the last two with fish artwork. If fish occupy the same grid cell, the hidden counters can undercount them; the swimmer list holds their individual identities.

The food chain is **algae → plankton → fry → hunters**, with the final link happening only during rare successful encounters. AI narration describes counts when requested; it does not select prey, create animals, or change their behavior.

## Plants and terrain

### Kelp and seaweed

Kelp is drawn using alternating parentheses for the stalk and slash marks for side fronds. Five greens give it variation: `#438b55`, `#62b878`, `#82c76b`, `#4fa66b`, and `#a0cd78`. Some rows use a neighboring shade to break up flat color.

Clumps belong to fixed positions in the traveling world. Their spacing and appearance depend on the world seed; they enter and leave at the edges as the camera moves. Height ranges from 2 to 22 text rows, scaled by habitat and patch density. Seagrass is capped at eight rows and has clustered blades. Broad patches alternate with bare ground. Roots stay fixed while upper fronds sway. These plants are scenery: fish do not eat them, and they are separate from the algae cells.

### Seabed contour

Underscore characters draw a rolling floor in muted blue green, `#36575a`. Sparse dots below it provide darker sediment texture, `#203b40`. Two smooth waves add hills and hollows to the habitat depth. Life cells below the floor are cleared, and fish artwork is positioned above it.

### Water and travel

The camera advances 0.08 world cells each tick, roughly 6.1 screen pixels per second. It takes about 3.5 minutes to travel one screen width at the normal update rate. The terrain and kelp stay attached to world positions; fish swim independently. The environmental grid shifts left as travel crosses whole columns.

Coral, shipwrecks, and peeking eels now join the scrolling scenery. Boulders, crevices, anchors, and wreck debris are also present. Castles, submerged ruins, surface waves, and three surface visitors now appear as described in the [surface scene guide](SURFACE-SCENES.md). Shells and treasure chests are not included. Sparse fish and diver bubbles are described below. Rocky reefs now include ledge-shaped contours and individual rock drawings. Objects elsewhere in the bundled upstream Asciiquarium source are not automatically part of this ocean.

## Habitats

The journey blends between these six habitat settings. Values below describe each habitat at its unblended setting, not sharp boundaries. The center-of-screen label picks the nearer habitat while the visible floor and plants vary smoothly across the screen.

| Habitat | Base floor depth in the 48-row world | Kelp height multiplier | Incoming plankton threshold | Algae addition interval |
| --- | --- | --- | --- | --- |
| Kelp meadow | 41 | 1.00 | 28 | 12 ticks, about 4.2 seconds |
| Rocky reef | 38 | 0.50 | 24 | 18 ticks, about 6.3 seconds |
| Open sand | 44 | 0.12 | 16 | 36 ticks, about 12.6 seconds |
| Coral garden | 39 | 0.22 | 26 | 16 ticks, about 5.6 seconds |
| Seagrass bed | 42 | 0.65 | 28 | 14 ticks, about 4.9 seconds |
| Shipwreck depths | 43 | 0.08 | 18 | 32 ticks, about 11.2 seconds |

Higher floor-depth numbers place the floor lower on the display. The rolling contour modifies these base depths. Nutrient additions are only attempted when the chosen cell is empty and the algae cap has room. Plankton additions are attempted every 20 ticks, about seven seconds, when the count is below the current threshold; that threshold is not a guaranteed population.

Each transition spans 64 world cells, about 4 minutes 40 seconds. The habitat settings repeat every 384 cells, about 28 minutes. Plant patterns depend on position and seed, so repeating habitat settings do not mean an identical still image. These timings assume continuous running at the intended tick rate; pauses and device delays extend them.

## Visitors and encounters

These behaviors run locally without API calls. They use the same 350-millisecond tick as the rest of the ocean. Pausing stops the visitor, bubbles, chase, and feeding animation; Step advances all of them once. New world resets all timers and visitors.

### Visiting diver

An original ASCII diver has a tank, mask, body, and two alternating flipper poses. Four images cover both poses and directions, cached alongside the fish artwork. The diver swims in the upper water at about 15 pixels per second and stays separate from the eight-fish population.

The first visit is scheduled 5 to 10 minutes after starting. After departure, another 5 to 10 minute wait begins. Active encounters can delay an arrival. Each visit starts and ends fully beyond the screen edges; there is only one diver at a time. Quiet mode keeps this peaceful visitor enabled.

Sparse bubbles rise from visible fish or the diver, changing from an `o` to a dot near the current waterline before vanishing. A shared cap of three and a 7–12-second emission cooldown keep the scene calm. They do not feed the ecosystem or reproduce; see [bubble details](SURFACE-SCENES.md#sparse-bubbles).

### Predators and prey

| Encounter role | Eligible drawings |
| --- | --- |
| Predator | Large ocean fish, silver spearfish, copper moray, reef shark |
| Prey | Tiny fish, little triangular fish, reef fish, box fish |
| Cruising only | Angelfish, striped fish, rounded fish, diamond fish, curly-fin fish, sunburst puffer, ribbon bannerfish, violet kite ray, blue lanternfish, rose squid, violet octopus, sea turtle, moon jellyfish, shore crab, reef lobster, peacock mantis shrimp, humpback whale |
| Decorative vehicle | Yellow submarine; no food-web interaction |

After a 2 to 4 minute cooldown, the simulation waits for two swimmer slots and no diver before bringing in a predator and prey from the same edge. Both begin outside the display and cruise into view together. Only one encounter can be active. The cooldown restarts when it ends, so visible encounters are farther apart than the cooldown alone.

The chase begins only when both fish are inside the screen. Prey and predator gradually accelerate into a burst faster than even the quickest ordinary swimmer. On the 1280-pixel display, cruising is about 14–34 pixels per second; pursuit targets are about 55–75 pixels per second. In an escape, the prey pulls ahead; in a possible catch, the predator gains ground. Only the selected pair speeds up. Acceleration takes about three to four seconds, and the pursuit lasts at most about ten seconds. An escape returns both fish smoothly to cruising speed; neither disappears or changes drawing.

### Catch and feeding

Twenty percent of encounter pairs are allowed to catch prey; actual catches can be less frequent because the pursuit must reach visible, aligned mouth contact before its time limit. Most encounters end in escape.

Contact uses the same artwork dimensions, mouth marks, and seabed placement as the renderer. At contact, the prey shrinks into the predator's mouth over about 2.5 seconds while the predator slows. Only then is the prey removed. A replacement later enters from beyond an edge. There is no blood, flashing, or sound.

### Quiet mode

Tap the water and select **Quiet mode: on** to stop chases and catches. An active encounter is cancelled without deleting either fish. Gentle travel, ordinary swimming, and occasional divers continue. Switch it off to allow encounters again.

The setting is remembered in the launcher's browser profile and survives New world and reopening the ocean. If browser storage is unavailable, the toggle still works for the current session. Clearing the browser profile clears the preference. The default is off, enabling these occasional encounters.

### Limits and validation

The implementation caps swimmers at eight, divers at one, surface visitors at one, and ordinary bubbles at three. Checks exercise both swimming directions, wholly off-screen arrivals, visible mouth contact, shrinking prey, escape survival, quiet-mode cancellation, cached drawing, pause, reset, and 30,000 ticks of bounded populations. The browser layout is checked at 1280 × 400; perceived pace still needs your assessment on the physical Pi screen.

## Creature parade

Tap the water and press **Creature parade · 2 min**. All 28 creature and vehicle designs, including the turtle, squid, and octopus, make a complete left-to-right crossing during a two-minute showcase. They are staggered across four swimming lanes, with crabs, lobsters, mantis shrimp, and octopuses rendered along the floor instead, with no more than eight parade swimmers at once. Every design starts fully beyond the left edge and leaves fully beyond the right edge. The diver is a visiting person and is not part of the sea-creature lineup.

The showcase uses separate swimmers and preserves the normal world's positions, ecosystem, terrain, and encounter timers. Ordinary swimmers blend out at the start; once the lineup has finished crossing, they blend back in during the final two seconds. The normal ocean resumes automatically at the end. There are no hunts during the parade, and quiet mode does not prevent it.

The countdown uses elapsed running time. Pause freezes it; Step advances it by one 350-millisecond tick. If started while paused, press Resume to run it. The parade button is disabled until it finishes, so repeated presses cannot extend the timer. New world cancels the parade. Parade state is not saved between launches.

Parade swimmers move at about 67 screen pixels per second for the current collection so the whole lineup can finish within two minutes. Their images use the existing cache. Checks verify that all designs become fully visible and fully exit, the population cap holds, the timer reaches 120 seconds, and the normal ecosystem is preserved and resumes correctly.

## Artwork and maintenance

Eleven designs come from Asciiquarium 1.1. The upstream code credits Kirk Baucom and credits most ASCII artwork to Joan Stark; expanded marine biodiversity was backported by Claudio Matsuoka. Fifteen creature and vehicle drawings are original to ASCII Genesis, including the squid, octopus, turtle, and jellyfish. All are distributed with this project under GPL-2.0-or-later. See [credits](../THIRD-PARTY.txt), [license](../LICENSE.txt), and the preserved [upstream source](../third-party/asciiquarium-upstream.pl).

The installed artwork is in [fish-art.js](../simulator/fish-art.js). Its source drawings and extraction rules are in [original-fish.mjs](../third-party/original-fish.mjs) and [restore-sprites.mjs](../third-party/restore-sprites.mjs). The running rules are in [aquarium.js](../simulator/aquarium.js); colors, terrain drawing, and sprite placement are in [simulator.js](../simulator/simulator.js).

When adding a design, preserve both swimming directions, color masks, credits, and enough off-screen margin for its full width. Update the design-count checks and this library alongside the artwork. The visitor and encounter implementation is in [ocean-life.js](../simulator/ocean-life.js), with checks in [life-check.mjs](../simulator/life-check.mjs). Keep this library in sync when changing behavior.
