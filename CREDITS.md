# Credits and project origins

ASCII Genesis grew from other people's work. The original Asciiquarium creators gave us the character art and the idea of a living ASCII sea. OpenGhost inspired the early exploration of a small physical display. Their willingness to share their projects made this one possible, and their names belong alongside it wherever it is shared.

## Asciiquarium and its creators

Start with [Asciiquarium](https://github.com/cmatsuoka/asciiquarium), the terminal aquarium that inspired this ocean. The preserved upstream source also points to [Kirk Baucom's original project site](http://robobunny.com/projects/asciiquarium/).

| Person or community | Contribution credited upstream | Connection to ASCII Genesis |
| --- | --- | --- |
| **Kirk Baucom** | Author of Asciiquarium; copyright holder in the bundled source | The original aquarium, source drawings, color masks, and permission to build on them under GPL-2.0-or-later. |
| **Joan Stark** | Most of the ASCII artwork | The hand-drawn character style that prompted us to retain the original fish instead of replacing them with simpler shapes. Upstream credits most art to Joan; it does not identify the author of every individual drawing. |
| **Claudio Matsuoka** | Expanded marine biodiversity, backported from the Asciiquarium Android live wallpaper | The expanded upstream fish collection and repository from which our bundled source was obtained. |
| **Asciiquarium contributors and maintainers** | Ongoing shared work around the original project | Keeping the source and creative foundation available for people to learn from and adapt. |

Eleven of our nineteen creature designs are adapted from Asciiquarium 1.1. Their directional drawings, spacing, and component color masks are preserved in the browser adaptation. The duplicate diamond design was omitted. The original notices and full source remain in [asciiquarium-upstream.pl](third-party/asciiquarium-upstream.pl); the adapted collection is in [fish-art.js](simulator/fish-art.js). See [THIRD-PARTY.txt](THIRD-PARTY.txt) and [LICENSE.txt](LICENSE.txt), GPL-2.0-or-later.

The original terminal program uses Term::Animation and Curses. We also acknowledge that terminal-animation foundation, while this version renders through a browser canvas.

## OpenGhost and the display idea

Thank you to **[xanderchinxyz](https://github.com/xanderchinxyz) and the OpenGhost contributors** for [OpenGhost](https://github.com/xanderchinxyz/OpenGhost), an open-source Pepper's Ghost display project. Exploring its screen, beam-splitter cube, and physical presentation helped start our conversation about making an ASCII ocean as a desk decoration.

That exploration included an ESP32-S3 and reflective cube concept before this project settled on a Raspberry Pi 4 with a direct-view Waveshare 7.9-inch HDMI display. OpenGhost is credited here as an inspiration: its program and enclosure files are not included in this repository. The case and leg models supplied here are Mikepyt87's designs. OpenGhost retains its own authorship and license.

## The hardware and software foundation

Thanks also to the [Raspberry Pi](https://www.raspberrypi.com/) and Raspberry Pi OS communities, [Waveshare](https://www.waveshare.com/wiki/7.9inch_HDMI_LCD), [Node.js](https://nodejs.org/), and [Chromium](https://www.chromium.org/). Their hardware, documentation, and software make it practical to run this display on a small computer.

## What this project adds

Mikepyt87 built and tested the desk display and supplied its printable enclosure and legs. Development used assistance from OpenAI tools. The additions in this repository include six new fish drawings, a squid, an octopus, the diver, browser rendering, traveling terrain, the simplified food web, occasional encounters, desktop launchers, updates, and optional API narration. These additions build on the earlier projects' ideas and artwork.

## Sharing and contributing

When sharing ASCII Genesis, please include a link to Asciiquarium and credit its creators. When discussing the origins of the physical display idea, include OpenGhost. A short credit you can use is:

> ASCII Genesis builds on Asciiquarium by Kirk Baucom, with most ASCII artwork credited upstream to Joan Stark and expanded marine biodiversity by Claudio Matsuoka. OpenGhost by xanderchinxyz and its contributors inspired the initial display exploration.

Keep upstream copyright and license notices with redistributed source and artwork. Give new contributors credit for their own work, and distinguish adapted assets from new ones. See [contribution guidance](CONTRIBUTING.md). Links and acknowledgments do not imply endorsement by the original creators.
