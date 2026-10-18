# Pi surface scenes and landmarks

The Pi ocean now includes occasional sailing boats, surfacing whales with animated water spouts, a long-necked sea monster, castles, and submerged ruins. They run offline and are separate from the regular collection of 28 creature and vehicle designs.

## Journey and timing

A surface stretch occupies about two minutes of a world-seeded four-to-five-minute cycle, with twelve-second rises and descents. The rest of the cycle is deeper water. The boat, whale, and sea monster each have a thirty-second window; only one surface visitor is active at a time. Their order depends on the world seed. The regular parade order is unchanged.

Castles and ruins are anchored to world coordinates and scroll with the seabed. These new landmarks remain within the bottom third of the screen; the renderer uses compact drawings and scales or skips a landmark when the local terrain leaves too little room. The waterline waits above existing swimmers, leaving room below the waves. Surface transitions never remove creatures or push their drawings into another lane. The surface transition does not raise the seabed. Existing tall kelp and the large wreck have their own drawings and placement rules.

## Boats, whales, and the monster

The boat follows the waterline. The compact surface whale rises, briefly spouts water, and settles below the line as it crosses. It is separate from both the regular humpback whale and the older distant-whale discovery. The sea monster uses two poses adapted from Asciiquarium’s original long-necked, looping-body drawing. None of these visitors join the ordinary swimmer count or the creature parade.

The exact scene drawings are below. Colors and rasterized character sizes come from the Pi renderer; this text reference is not a physical-display photograph.

### Sailing boat

```text
      |
     /|\
    /_|_\
 \________/
```

### Surface whale

```text
      __..__
  ___/      \
~\__    o   _)
    \_______/
```

### Sea monster: first pose

```text
                                ____
          __                   / o  \
        /    \       _       /  ____ >
 _     |  __  |    /   \     |  |
| \____|  ||  |___|     |____|  |
```

### Sea monster: second pose

```text
                                ____
                       __      / o  \
          _          /    \  /  ____ >
  _     /   \      |  __  |  |  |
 | \___|     |_____|  ||  |__|  |
```

### Castle

```text
 []  ^  []
 || / \ ||
 |[]|n|[]|
_|__|_|__|_
```

### Submerged ruins

```text
 []    _
 || []| |
_|n_||n_|_
```

## Sparse bubbles

Ordinary fish and the occasional diver share a limit of **three bubbles**. Fish emission attempts are spaced **7–12 seconds** apart; an attempt can produce nothing when there is no visible emitter or the limit is full. A diver can also attempt an emission after its longer interval when the shared timer allows it.

Bubbles rise **0.45 world cells per 350 ms tick**, about 10.7 screen pixels per second on the 1280 × 400 display, and drift left 0.025 cells per tick. A bubble changes from an o to a dot near the waterline, then disappears at the line or after 180 ticks, whichever comes first. Most expire well before that safety limit. Plankton is now drawn as small mint dots, so it does not resemble a screen full of extra bubbles. Whale spray is its own brief animation, not a persistent bubble source.

## Controls and updates

Pause freezes the journey and bubbles. Step advances one simulation tick. New World resets the world and its timers. The creature parade hides surface visitors and new landmarks and holds the normal-world clock; the preserved ocean resumes afterward. Quiet mode disables hunting while keeping peaceful scenery and surface visits.

Close the ocean and run **Update ASCII Genesis**, then reopen it. The Pi follows its own GitHub repository’s main branch; Mini and Mid firmware releases do not update it. See [Pi setup](../raspberry-pi/SETUP.md), [the full library](OCEAN-LIBRARY.md), and [credits](../CREDITS.md).

## Validation

The source update passed [Check ocean](https://github.com/Mikepyt87/ascii-genesis/actions/runs/39127558694), including the simulation, renderer, desktop launcher, and updater checks. Additional renderer checks cover surface scenes, a shared three-bubble limit, bottom-third castle/ruin placement, and plankton drawn separately from bubbles. The scenes were visually inspected in the browser. The new scene changes have not yet been confirmed on the physical Pi display.

The waterline preservation fix passed [Check ocean](https://github.com/Mikepyt87/ascii-genesis/actions/runs/39132004873) at source commit `e71eb2ea9a2dcd796ab9459db3f47ed8fde3b24b`. Its regression checks hold each of the 28 creature designs, in both directions, through ten minutes of surface changes and verify unchanged drawing positions and full wave clearance. Physical-display confirmation of this fix is still pending.
