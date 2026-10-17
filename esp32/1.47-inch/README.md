# ASCII Genesis — ESP32-S3 1.47-inch edition

This is the miniature edition for **Waveshare ESP32-S3-Touch-LCD-1.47**, used sideways at **320 × 172**. The board has its own ESP32-S3, 8 MB PSRAM, 16 MB flash, and capacitive touch.

**Current stage: local visual simulation for review. Firmware has not been built or flashed. Nothing in this folder is an uploadable firmware image.**

## Preview first

The preview uses the existing project's 27 colored ASCII creature designs with a 5 × 7 bitmap font in 6 × 8 cells. Three creatures fit at once. Plants sway, bubbles rise, and terrain moves slowly through six habitat labels. Tap the water to reveal Pause and New World; the controls fade after eight seconds. Pause freezes the ocean. New World starts a fresh scene.

The browser draws at exactly 320 × 172 pixels, enlarged for inspection. Native pixels disables enlargement; physical inches still depend on your monitor. This is a design simulation, not ESP32 emulation. The miniature currently has decorative swimmers rather than the Pi edition's food web, hunting, schools, diver, narration, and full habitat scenery. Those features are not represented as working firmware.

From this folder, run `node preview/serve.mjs`, then open the printed local address. It needs Node.js 20+ and no packages or API keys.

## Separate editions

- [Raspberry Pi ocean](../../README.md): current 1280 × 400 ocean and existing installation instructions.
- **This folder:** small ESP32-S3 1.47-inch edition under development. Do not use the Pi installer or Pi enclosure for it.

The earlier local 4-inch Waveshare firmware remains in the original workspace's `firmware` folder; this preview does not replace or flash it.

## Hardware work after the visual review

Use the vendor's initialization for the **JD9853 SPI display** and **AXS5106L I2C touch controller**. The similarly named non-touch LCD-1.47 is a different board. Display reset is GPIO40; touch reset is GPIO47. Verify landscape touch alignment and all four corners on the real unit. The vendor Arduino demo uses a custom display initialization even though its wrapper class is named ST7789.

Display/touch, power, frame timing, memory use, and firmware compilation still require verification. Browser animation does not validate any of those.

Sources: [Waveshare board documentation](https://docs.waveshare.com/ESP32-S3-Touch-LCD-1.47), [vendor examples](https://docs.waveshare.com/ESP32-S3-Touch-LCD-1.47/Resources-And-Documents). Artwork credits remain in [CREDITS.md](../../CREDITS.md) and [THIRD-PARTY.txt](../../THIRD-PARTY.txt). The bitmap font carries the BSD notice in `preview/FONT-LICENSE.txt`.
