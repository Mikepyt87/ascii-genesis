# ASCII Genesis

A quiet traveling ASCII ocean for **Raspberry Pi 4 Model B and the Waveshare 7.9-inch HDMI touchscreen**, used horizontally at **1280 × 400**.

Seventeen fish designs swim through kelp meadows, rocky reefs, and open sand. Terrain travels slowly, food and plant cover change by habitat, and fish enter and leave beyond the edges. The ocean runs offline. Optional narration is separate from the simulation.

## Ocean library

Browse the [Ocean Library](docs/OCEAN-LIBRARY.md) for all 17 fish designs with both directional drawings, their colors and sizes, small life, kelp, terrain, habitat settings, and current behavior. It also records the proposed occasional diver and calm predator encounters separately from working features.

## Hardware and screen setup

- Raspberry Pi 4 Model B, with cooling and a microSD card (32 GB or larger suggested).
- Waveshare 7.9-inch 400 × 1280 HDMI touchscreen.
- A good 5 V / 3 A USB-C supply for the Pi 4. The official 15 W Raspberry Pi supply is the intended choice.
- Micro-HDMI to HDMI cable for video, plus the USB data cable for the display's TOUCH connection.
- Keyboard/mouse for first setup. After installation, use the Raspberry Pi desktop icon to launch.

The display's USB connection provides touch and can supply display power from the Pi. Check the total load of your USB devices; if the display resets or low-voltage warnings appear, check cables/power and use the manufacturer's separate-power arrangement as needed. Physical power and touch operation still need testing on your unit.

Install **Raspberry Pi OS Desktop, 64-bit** using [Raspberry Pi Imager](https://www.raspberrypi.com/software/). Use Desktop, not Lite. Rotate the display in the OS settings until the desktop is **1280 pixels wide by 400 high**. Check touch alignment after rotation. Make it the primary display and disable screen blanking if desired.

References: [Pi 4 specifications](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/specifications/), [recommended power supply](https://www.raspberrypi.com/products/power-supply/), [Waveshare display instructions](https://www.waveshare.com/wiki/7.9inch_HDMI_LCD).

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

Tap the water to show controls. They fade after eight seconds. Pause stops travel and swimming; Step advances once; New world starts over. **Alt+F4** closes the ocean and returns to the desktop. Opening the icon twice will not start two oceans. There is no saved-world state; each launch starts a new scene.

The layout is fixed to 1280 × 400. Browser zoom should stay at 100%. This project has no other hardware profiles or cube modes.

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

The Pi 4 renderer rasterizes the 34 directional fish images once and reuses them. It retains the 350 ms simulation interval, fixed 1280 × 400 canvas, and eight-swimmer limit. There are no npm dependencies, continuous API requests, or 60-fps rendering loop. This reduces repeated fish text drawing; actual CPU usage and frame timing must be measured on your Pi 4.

Checks cover all 17 designs appearing in rotation, ecological limits, continuous terrain, off-screen departures, cached sprite rendering, pause/reset behavior, and mock narration. Desktop installation is tested in a temporary folder. Linux CI checks script syntax as well. These checks do not replace physical display, touch, power, and OS startup testing.

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

Eleven designs derive from Asciiquarium; six are original ASCII Genesis drawings. See [THIRD-PARTY.txt](THIRD-PARTY.txt) and [LICENSE.txt](LICENSE.txt), GPL-2.0-or-later. Source drawings and their generator are in `third-party/`. Regenerate the fish collection from the project root with `node third-party/restore-sprites.mjs`.

### Diagnose an API connection

Close the ocean, use the Update ASCII Genesis icon, and reopen it. Tap AI event: the app now reports missing-key, authentication, billing, permission, model-access or connection errors separately. Luna narration uses no reasoning and a 128-token response allowance. A successful narration is still needed to confirm your account works.

To check the saved file against the running server without showing the key or calling OpenAI, run on the Pi:

```bash
node ~/ASCII-Genesis/simulator/api-doctor.mjs
```

This prints only a configuration result. Share that result or the on-screen error code; never share openai.env or the secret key.
