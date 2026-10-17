# ESP32 1.47-inch firmware

For **Waveshare ESP32-S3-Touch-LCD-1.47** only. This is separate from the Raspberry Pi installer and the older local 4-inch firmware. Use a USB data cable for the first installation.

## Build and first installation

Use an **ESP-IDF 5.5.2** terminal in this folder:

```text
idf.py set-target esp32s3
idf.py build
idf.py -p COMx flash monitor
```

Replace COMx with the board's port. The first flash must include the bootloader, partition table, initial OTA data and application; `idf.py flash` handles those. Do not flash only the application onto a board with an unknown partition layout. An old SDK configuration must be regenerated when switching hardware. Generated build files are ignored by Git.

The optional release build creates `aquarium-usb.bin`, a merged first-install image starting at address **0x0**, and `ascii-genesis-147.bin`, the application-only image used by wireless updates. They are different files. The 16 MB flash layout reserves two 6 MiB application slots and OTA metadata, with rollback enabled in the bootloader.

## Join home Wi-Fi

1. Tap the ocean, then **Settings → Set up Wi-Fi with phone**.
2. Join the temporary `ASCII-Genesis-xxxx` Wi-Fi network from your phone using the random password shown on the aquarium.
3. Stay connected if the phone reports that this network has no internet. Open **http://192.168.4.1** in the phone browser.
4. Enter your **2.4 GHz** home Wi-Fi name and password, then save. Return your phone to its normal network.
5. The device closes its setup network and connects to home Wi-Fi. If the details are wrong, reopen setup and retry. Setup closes after ten minutes or when you tap Back.

The aquarium runs without Wi-Fi. Credentials are saved on the device, never committed, sent to GitHub or printed to logs. This prototype uses normal NVS storage without flash encryption; the initial flash and physical access should remain private.

## Wireless updates

The device checks once after startup and once per day while connected. **Settings → Check for updates** checks immediately. A compatible update changes the button to **Install vX.Y.Z & restart**. Installation requires that tap; checks never reboot the aquarium automatically. Network work runs separately from the ocean renderer.

The fixed channel is `esp32-147-stable/manifest.json` in this repository's GitHub releases. The manifest identifies the exact board, numeric version, binary length, SHA-256 digest and version-specific HTTPS download URL. Raspberry Pi releases and 4-inch firmware are rejected. Only a newer version from the expected ESP32 release path is accepted.

Downloads use certificate validation and are written to the inactive application slot. Size, digest, ESP image validity, embedded project name and version must match before changing the boot selection. Failed downloads keep the installed version. The new firmware is accepted after 30 seconds of successful render-loop operation, including PSRAM allocation, display transfers and a touch-controller probe. A watchdog reset/crash before that point causes the rollback-enabled bootloader to choose the previous image on the next boot. Wi-Fi availability is not a boot requirement.

Rollback is a boot-recovery mechanism, not a guarantee that every visual or behavioral bug will be detected. Power loss during the first verification period also rolls back. A working USB connection remains the recovery route for first-install or hardware problems. The first image has no previous image to restore.

HTTPS and the manifest digest protect the transport and download integrity; independent firmware signing and secure boot are not enabled. Anyone allowed to publish the repository's stable channel can authorize firmware for its devices.

## Release process

The **Prepare ESP32 1.47 release** GitHub workflow runs manually against main with a numeric X.Y.Z version. It compiles and produces downloadable test artifacts by default. After physical testing, run it with Publish enabled to create `esp32-147-vX.Y.Z` and promote its manifest to the dedicated stable channel. Existing version releases are immutable in this workflow. Neither release is marked as the repository's latest release. The Pi launcher continues to follow main through its existing updater.

There is no published stable ESP32 firmware yet; until a release is promoted, checking reports that no compatible release is available.

## What still needs the board

Check landscape rotation, all four touch corners, colors, frame timing, initial flash, phone provisioning, reconnect after a power cycle, wrong Wi-Fi credentials, interrupted downloads, first-boot watchdog rollback, and successful updates between two real versions. Browser tests model the workflow; they do not emulate radio, flash, bootloader, display or touch hardware.

This miniature is a decorative three-swimmer ocean with the existing 27 designs. It does not implement the Pi edition's full ecology or narration. The firmware is GPL-3.0-or-later so its GPL-2.0-or-later artwork can be combined with the Apache-2.0 vendor display driver. The Pi edition keeps its existing license. See COPYING, the driver's LICENSE, the font's BSD notice and the root credits.
