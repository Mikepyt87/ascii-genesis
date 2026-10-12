# ASCII Genesis Screenshot Tour

ASCII Genesis is a quiet, traveling ASCII ocean for a Raspberry Pi 4 and a Waveshare 7.9-inch HDMI touchscreen. Fish pass through the scene at different speeds while the seabed and seaweed scroll slowly past. This tour shows what to expect before building your own.

These are captures of the current browser renderer at **1280 × 400**, taken on a desktop rather than photographed on the Pi. Scenes were advanced and held still for capture, including the rare visitor and encounter. Actual visits are spaced out during normal use, and every new world varies.

## Thanks to the original creators

Much of the character of this ocean comes from [Asciiquarium](https://github.com/cmatsuoka/asciiquarium): **Kirk Baucom** created the original project, **Joan Stark** is credited upstream for most of its ASCII art, and **Claudio Matsuoka** expanded its marine biodiversity. Eleven fish designs here adapt their shared work. **xanderchinxyz and the [OpenGhost](https://github.com/xanderchinxyz/OpenGhost) contributors** inspired the initial physical-display exploration. Please visit their projects and read [Credits and project origins](../CREDITS.md).

## Traveling ocean

![Fish cruising through tall green seaweed above a rolling seabed](screenshots/ocean.jpg)

Different fish shapes and muted colors share the water with algae and plankton. Seaweed varies in height and shade. The camera moves slowly through kelp meadow, rocky reef, and open sand settings; plants and terrain enter and leave at the edges. Fish crossing an edge are intentional arrivals and departures.

The collection has **17 fish designs**, each facing both directions. There are at most eight swimmers at once, including those still outside the visible area. The [Ocean Library](OCEAN-LIBRARY.md) shows every drawing and explains its role.

## Open sand

![Small fish crossing an open sandy habitat with a low seabed and sparse plants](screenshots/open-sand.jpg)

Travel gradually changes the setting. Open sand has a lower seabed and shorter, more widely visible gaps between plants than the denser regions. Food availability also changes with habitat. Transitions blend smoothly instead of cutting between separate scenes.

## A visiting diver

![An ASCII diver with a tank and fins crossing the upper water above seaweed](screenshots/diver.jpg)

A diver occasionally swims across with gently alternating flippers and a small trail of bubbles. The first visit is scheduled after 5–10 minutes; another wait begins after departure. An active encounter can delay the visit. The diver stays separate from the eight-fish limit, and its bubbles fade away instead of accumulating.

## Predator encounter

![A silver spearfish following a smaller reef fish toward the left side of the screen](screenshots/predator-encounter.jpg)

A silver spearfish follows a smaller reef fish in this example. Encounter pairs arrive together from beyond an edge, then briefly accelerate once both are in view. Most chases end in escape. Rare successful catches visibly shrink the prey into the predator's mouth; there is no blood, flashing, or sound.

Only one encounter can run at a time. A 2–4 minute cooldown, available swimmer slots, and the time to enter the scene keep these moments spaced apart. **Quiet mode** disables hunting while keeping normal swimming and diver visits.

## Touch controls

![Ocean controls showing Pause, Step, New world, AI event, and Quiet mode on](screenshots/controls.jpg)

Tap the water to reveal this panel. It fades after eight seconds so the ocean can fill the display again.

| Control | What it does |
| --- | --- |
| Pause or Resume | Stops or resumes swimming, travel, visitors, and encounters. |
| Step | Advances the whole simulation by one tick, useful while paused. |
| New world | Starts a fresh scene and resets its timers. |
| AI event | Requests optional narration through your own configured OpenAI API connection. It does not control the ocean. |
| Quiet mode | Turns hunting off or on. The preference is remembered in the browser profile. |

The ocean, diver, and encounters all work **offline without an API key**. The AI button requires separate setup and working API access; the screenshot does not demonstrate a successful API call.

## Build and run it

The supported setup is a **Raspberry Pi 4 Model B, Raspberry Pi OS Desktop 64-bit, and the Waveshare 7.9-inch screen rotated to 1280 × 400**. For the included enclosure build, print **one case and two legs** from the [print guide](../3d-printing/README.md). The installer adds native Raspberry Pi desktop launch and update icons. Open the ocean with its desktop icon; use Alt+F4 to return to the desktop.

See the [README](../README.md) for the hardware list, installation from GitHub, updates, and troubleshooting. See [artwork credits](../THIRD-PARTY.txt) for the Asciiquarium sources and original project drawings, distributed under GPL-2.0-or-later.
