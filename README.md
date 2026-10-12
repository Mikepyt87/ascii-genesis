# ASCII Genesis

A quiet traveling ASCII ocean for **Raspberry Pi 4 Model B and the Waveshare 7.9-inch HDMI touchscreen**, used horizontally at **1280 × 400**.

Seventeen fish designs, a squid, and an octopus swim through kelp meadows, rocky reefs, and open sand. Terrain travels slowly, food and plant cover change by habitat, and fish enter and leave beyond the edges. The ocean runs offline. Optional narration is separate from the simulation.

## Built on work worth celebrating

**This project exists because other people shared their ideas and artwork.** Huge thanks to **Kirk Baucom**, the creator of [Asciiquarium](https://github.com/cmatsuoka/asciiquarium); **Joan Stark**, credited upstream for most of its ASCII art; and **Claudio Matsuoka**, who expanded its marine biodiversity. Eleven of the fish designs here come from that work.

Thanks also to **xanderchinxyz and the [OpenGhost](https://github.com/xanderchinxyz/OpenGhost) contributors**. Their Pepper's Ghost display inspired the initial physical-display exploration that led to this desk ocean. This build uses a Pi 4 and a direct-view screen; its included enclosure is Mikepyt87's design.

Please explore those original projects as well as this one. Read [Credits and project origins](CREDITS.md) for the full story, preserved notices, and what each project contributed.

## See the ocean

![ASCII Genesis fish and seaweed across the full ocean display](docs/screenshots/ocean.jpg)

**[Explore the screenshot tour](docs/SCREENSHOTS.md)** for the changing habitats, squid and octopus, visiting diver, predator encounters, and touch controls. Captures use the browser renderer at the display's native 1280 × 400 resolution; they are not photographs of the Pi hardware.

The ocean works offline, launches from a Raspberry Pi desktop icon, and includes a remembered quiet-mode setting. OpenAI narration is optional and requires its own API setup. Installation and updates are explained below.

## Ocean library

Browse the [Ocean Library](docs/OCEAN-LIBRARY.md) for all 19 fish and cephalopod designs with both directional drawings, their colors and sizes, the diver in both poses and directions, bubbles, small life, kelp, terrain, sediment, water, controls, habitat settings, and current behavior. It also describes the occasional diver, short predator encounters, rare catches, and quiet-mode control.

## Hardware and screen setup

- Raspberry Pi 4 Model B, with cooling and a microSD card (32 GB or larger suggested).
- Waveshare 7.9-inch 400 × 1280 HDMI touchscreen.
- A good 5 V / 3 A USB-C supply for the Pi 4. The official 15 W Raspberry Pi supply is the intended choice.
- Micro-HDMI to HDMI cable for video, plus the USB data cable for the display's TOUCH connection.
- **3D printer access or a printing service, plus filament, to make one case and two legs for the included enclosure build.** See [print instructions](3d-printing/README.md).
- Keyboard/mouse for first setup. After installation, use the Raspberry Pi desktop icon to launch.

The display's USB connection provides touch and can supply display power from the Pi. Check the total load of your USB devices; if the display resets or low-voltage warnings appear, check cables/power and use the manufacturer's separate-power arrangement as needed. Physical power and touch operation still need testing on your unit.

Install **Raspberry Pi OS Desktop, 64-bit** using [Raspberry Pi Imager](https://www.raspberrypi.com/software/). Use Desktop, not Lite. Rotate the display in the OS settings until the desktop is **1280 pixels wide by 400 high**. Check touch alignment after rotation. Make it the primary display and disable screen blanking if desired.

References: [Pi 4 specifications](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/specifications/), [recommended power supply](https://www.raspberrypi.com/products/power-supply/), [Waveshare display instructions](https://www.waveshare.com/wiki/7.9inch_HDMI_LCD).

## Printed enclosure and legs

For the complete enclosure build, **print one case and two copies of the leg model** before final assembly. You need access to a 3D printer or a service that can print the files.

1. Download [Case.stl](3d-printing/Case.stl) and [Legs(x2).stl](3d-printing/Legs%28x2%29.stl), or their original 3MF versions from the [model guide](3d-printing/README.md).
2. Import the STL files in **millimeters at 100% scale**. The legs file is one model: duplicate it in your slicer or print it twice.
3. Choose the bed orientation and print settings for your printer. The files preserve the CAD orientation, and verified layer height, infill, supports, and fastener specifications have not yet been supplied.
4. Print the parts, check their fit with your screen and Pi, then assemble the enclosure and legs. Keep cable openings and Pi ventilation clear.

You can install and test the software while the parts print. The model guide includes dimensions and conversion details.

## Install from GitHub — one-time setup

Open a terminal on the **Raspberry Pi** and run:

```bash
sudo apt update
sudo apt install -y git
git clone https://github.com/Mikepyt87/ascii-genesis.git "$HOME/ASCII-Genesis"
bash "$HOME/ASCII-Genesis/raspberry-pi/install.sh"
```

Run the installer as your normal desktop user, without putting `sudo` before it. It asks for sudo only to install packages. It installs Chromium, Node.js, and desktop helpers, runs checks, then puts **ASCII Genesis** and **Update ASCII Genesis** icons on your Raspberry Pi desktop and in the application menu. Node.js 20 or newer is required. If your OS supplies an older version, upgrade Node using its [official instructions](https://nodejs.org/en/download), then rerun the installer.

## Everyday use

**Double-click ASCII Genesis on the Raspberry Pi desktop.** It opens the ocean full-screen. If Raspberry Pi OS asks whether to trust or execute the desktop launcher, choose Execute/Allow Launching. The installer attempts to mark the icon trusted, but desktop behavior varies by OS release.

Tap the water to show controls. They fade after eight seconds. Pause stops travel and swimming; Step advances once; New world starts over. **Alt+F4** closes the ocean and returns to the desktop. Opening the icon twice will not start two oceans. There is no saved-world state; each launch starts a new scene. Quiet mode is saved separately in the browser profile.

The layout is fixed to 1280 × 400. Browser zoom should stay at 100%. This project has no other hardware profiles or cube modes.

## Occasional visitors and hunting

A diver may arrive after 5–10 minutes, then wait another 5–10 minutes after departing before visiting again. Predator encounters have a 2–4 minute cooldown, followed by the wait for free swimmer slots and the pair to enter from off screen. Most chases end in escape; rare catches visibly shrink the prey into the predator's mouth. All of this works offline.

Tap the water and turn **Quiet mode: on** to disable hunting. Divers and gentle swimming continue. The preference survives restarting the app. Pause and Step apply to every animation. See the [Ocean Library](docs/OCEAN-LIBRARY.md#visitors-and-encounters) for eligibility, timing, and limits.

## Updates and new fish

The launcher checks the public repository's **main** branch each time you open the ocean. When new commits are available, it tests the downloaded version before applying a fast-forward update. The network check times out after 20 seconds; offline operation continues with the installed version. It does not interrupt an ocean already running.

To update manually, close the ocean and double-click **Update ASCII Genesis** on the Pi desktop. Updates preserve your private settings outside the project folder. If you edit tracked project files or switch branches, updates stop rather than overwrite your work.

Future changes must first be committed and pushed to GitHub. The Pi then downloads them; it does not push files or need a GitHub account/token for this public repository. Updates may execute new application code from this repository, so keep write access to the repository limited to people you trust. New system dependencies still require rerunning the installer; updates never run sudo automatically.

To disable automatic checks, run once:

```bash
touch "$HOME/.config/ascii-genesis/no-auto-update"
```

To enable them again, remove that one file. The update desktop icon works regardless of this setting.

## Optional startup at boot

To start the ocean on desktop login:

```bash
bash "$HOME/ASCII-Genesis/raspberry-pi/install-autostart.sh"
```

Enable desktop auto-login in Raspberry Pi OS if you want unattended startup. Normal desktop-icon launch works without enabling this. To disable boot startup, remove only the ASCII-Genesis launch line from `~/.config/labwc/autostart`, or remove `~/.config/autostart/ascii-genesis.desktop` if the fallback installer used that file. Keep the project in the same location after installation.

## Optional narration

The ocean requires no API key. The included OpenAI bridge is an optional prototype and was tested with mocked responses only. If you enable it, the Pi makes the request itself, only after tapping AI event; the result does not control the ecosystem.

Put your private settings in `~/.config/ascii-genesis/openai.env`, outside this repository:

```bash
OPENAI_API_KEY='your-own-key'
```

Restrict that file with `chmod 600 ~/.config/ascii-genesis/openai.env`. Restart the ocean after editing. The bridge currently specifies `gpt-6-luna`; live availability and billing have not been verified for your API account. Check the model before enabling real calls. Do not commit your key or share the private settings file.

## Performance and validation

The Pi 4 renderer rasterizes the 38 directional fish and cephalopod images and four diver images once and reuses them. It retains the 350 ms simulation interval, fixed 1280 × 400 canvas, and eight-swimmer limit, plus at most one diver and five short-lived bubbles. There are no npm dependencies, continuous API requests, or 60-fps rendering loop. This reduces repeated fish text drawing; actual CPU usage and frame timing must be measured on your Pi 4.

Checks cover all 19 designs appearing in rotation, ecological limits, continuous terrain, off-screen departures, rare catches at visible mouth contact, escape survival, diver limits, quiet mode, cached sprite rendering, pause/reset behavior, and mock narration. Desktop installation is tested in a temporary folder. Linux CI checks script syntax as well. These checks do not replace physical display, touch, power, and OS startup testing.

```bash
node simulator/core-check.mjs
node simulator/render-check.mjs
node simulator/openai_bridge_check.mjs
python3 raspberry-pi/desktop-check.py
```

## Troubleshooting

- **No desktop icon:** rerun `python3 ~/ASCII-Genesis/raspberry-pi/install-desktop.py` as your normal desktop user. The installer uses your OS's configured Desktop folder, including translated folder names.
- **Does not start:** read `~/.cache/ascii-genesis/launch.log`. Confirm Node 20+ and Chromium are installed, and no other preview server is using port 4173.
- **Update unavailable:** check `~/.cache/ascii-genesis/update.log`, internet access, and local Git changes. The current ocean still runs offline.
- **Borders or wrong orientation:** set the OS desktop to 1280 × 400, use the intended screen as primary, and reset Chromium zoom to 100%.
- **Touch reversed or rotated:** adjust OS/vendor touch mapping; the app does not configure hardware rotation.
- **Moved project folder:** rerun the desktop installer and reinstall any startup entry with the new path.
- **ZIP download:** extract it and run `bash raspberry-pi/install.sh` inside its folder. Desktop launch works, but Git updates require installing with the clone instructions above.

## Artwork and license

The [Asciiquarium creators and OpenGhost community](CREDITS.md) deserve prominent credit for the work that brought us here. Eleven designs derive from Asciiquarium; eight are original ASCII Genesis creature drawings. See [THIRD-PARTY.txt](THIRD-PARTY.txt) and [LICENSE.txt](LICENSE.txt), GPL-2.0-or-later. Source drawings and their generator are in `third-party/`. Regenerate the fish collection from the project root with `node third-party/restore-sprites.mjs`.

### Diagnose an API connection

Close the ocean, use the Update ASCII Genesis icon, and reopen it. Tap AI event: the app now reports missing-key, authentication, billing, permission, model-access or connection errors separately. Luna narration uses no reasoning and a 128-token response allowance. A successful narration is still needed to confirm your account works.

To check the saved file against the running server without showing the key or calling OpenAI, run on the Pi:

```bash
node ~/ASCII-Genesis/simulator/api-doctor.mjs
```

This prints only a configuration result. Share that result or the on-screen error code; never share openai.env or the secret key.
