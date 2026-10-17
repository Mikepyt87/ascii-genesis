# ASCII Genesis — ESP32-S3 1.47-inch edition

This is the miniature edition for **Waveshare ESP32-S3-Touch-LCD-1.47**, used sideways at **320 × 172**. The board has its own ESP32-S3, 8 MB PSRAM, 16 MB flash, and capacitive touch.

**Current stage: browser simulation plus prototype ESP-IDF firmware with Wi-Fi and wireless updates. No firmware has been flashed or promoted to the update channel. Physical board testing is still required.** See the [firmware setup and update guide](firmware/README.md).

## Preview first

The preview uses the existing project's 27 colored ASCII creature designs with a 5 × 7 bitmap font in 6 × 8 cells. Three creatures fit at once. Plants sway, bubbles rise, and terrain moves slowly through six habitat labels. Tap the water to reveal Pause, New World and Settings; the controls fade after eight seconds. Pause freezes the ocean. New World starts a fresh scene. The ocean fills the bottom area when the controls are hidden, without an instruction banner.

Open **Settings** to try the simulated phone connection and update screens. Tap Set up Wi-Fi, then use Connect demo home Wi-Fi outside the screen. Tap Check for updates, followed by Install. The Update test selector also lets you try a damaged download and failed restart. These are deliberately simulated and send no network requests, passwords or firmware. The real firmware implements provisioning and OTA separately.

The browser draws at exactly 320 × 172 pixels, enlarged for inspection. Native pixels disables enlargement; physical inches still depend on your monitor. This is a design simulation, not ESP32 emulation. The miniature currently has decorative swimmers rather than the Pi edition's food web, hunting, schools, diver, narration, and full habitat scenery. Those features are not represented as working firmware.

From this folder, run `node preview/serve.mjs`, then open the printed local address. It needs Node.js 20+ and no packages or API keys.

## Separate editions

- [Raspberry Pi ocean](../../README.md): current 1280 × 400 ocean and existing installation instructions.
- **This folder:** small ESP32-S3 1.47-inch edition under development. Do not use the Pi installer or Pi enclosure for it.

The earlier local 4-inch Waveshare firmware remains in the original workspace's `firmware` folder; this preview does not replace or flash it.

## Hardware implementation

Use the vendor's initialization for the **JD9853 SPI display** and **AXS5106L I2C touch controller**. The similarly named non-touch LCD-1.47 is a different board. Display reset is GPIO40; touch reset is GPIO47. Verify landscape touch alignment and all four corners on the real unit. The vendor Arduino demo uses a custom display initialization even though its wrapper class is named ST7789.

The firmware uses the vendor JD9853 driver and board pin map, a direct bitmap renderer, a phone setup page, certificate-validated HTTPS downloads, a dedicated ESP32 release manifest, and a rollback-enabled bootloader. The build check compiles with ESP-IDF 5.5.2. Display/touch, power, frame timing, memory use, radio operation, flash writes and boot recovery still require physical verification. Browser animation does not validate those.

Sources: [Waveshare board documentation](https://docs.waveshare.com/ESP32-S3-Touch-LCD-1.47), [vendor examples](https://docs.waveshare.com/ESP32-S3-Touch-LCD-1.47/Resources-And-Documents). Artwork credits remain in [CREDITS.md](../../CREDITS.md) and [THIRD-PARTY.txt](../../THIRD-PARTY.txt). The bitmap font carries the BSD notice in `preview/FONT-LICENSE.txt`.
