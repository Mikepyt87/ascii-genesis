# ASCII Genesis - Mini firmware

For **Waveshare ESP32-S3-Touch-LCD-1.47** only. This is separate from the Raspberry Pi installer and the older local 4-inch firmware. Use a USB data cable for the first installation.

**Status:** the firmware compiles and its software checks pass. Display, touch, Wi-Fi and recovery still need testing on a physical board. There is no stable ESP32 device release yet. Start with the source-build route below. Publishing source on GitHub does not send an update to a device.

## What you need

- Waveshare **ESP32-S3-Touch-LCD-1.47** or its pre-soldered-header variant. The similarly named non-touch LCD-1.47 uses different hardware.
- A computer for the first USB installation, a USB data cable, and an available USB port. No Raspberry Pi or extra controller is needed.
- A phone and a 2.4 GHz Wi-Fi network if you want wireless updates. An internet connection is needed to download build tools and updates. The aquarium itself runs offline.
- Git for downloading the project, and Espressif's ESP-IDF **5.5.2** development tools. Node.js 20+ is optional for the browser preview and software checks; it is not required to run the flashed board.

A microSD card, soldered headers and an API key are not required for this firmware. Do the first test with the bare board on a dry, nonconductive surface. The Pi enclosure and its print files do not fit this board.

## Set up a Windows computer

1. Install [Git for Windows](https://git-scm.com/downloads/win) if `git --version` is not recognized.
2. Follow [Waveshare's ESP-IDF setup guide for this exact board](https://docs.waveshare.com/ESP32-S3-Touch-LCD-1.47/ESP-IDF). Use Espressif's official installer and select **ESP-IDF 5.5.2** with the ESP32-S3 tools. Install the USB drivers offered by the installer. A short tools path without spaces makes troubleshooting easier.
3. Open the **ESP-IDF PowerShell** environment supplied by the installer. If you use VS Code instead, open an ESP-IDF terminal from Espressif's extension. An ordinary terminal does not automatically have the compiler environment loaded.
4. Run `idf.py --version`. It should report ESP-IDF 5.5.2. If it is not recognized, return to the installed ESP-IDF terminal before continuing.
5. In that terminal, choose a folder for the project and download it:

```powershell
git clone https://github.com/Mikepyt87/ascii-genesis.git ASCII-Genesis
cd ASCII-Genesis
git switch main
cd esp32/1.47-inch/firmware
```

If you already cloned the repository, open its folder and run `git status` first. With a clean checkout on main, use `git pull --ff-only`, then enter `esp32/1.47-inch/firmware`. Keep any personal changes before updating; do not discard them just to follow this guide. Do not run the Raspberry Pi installer on the ESP32.

For Linux or macOS, use [Espressif's ESP-IDF 5.5.2 getting-started guide](https://docs.espressif.com/projects/esp-idf/en/v5.5.2/esp32s3/get-started/index.html) to install and activate the tools. The project and build commands are the same; use the device's serial path in place of COMx.

## Find the board's USB port

1. Connect the board directly to the computer using a known data cable.
2. On Windows, open **Device Manager → Ports (COM & LPT)**. Note the port that appears when you plug in the board, such as COM7. Its label can vary with the installed USB driver.
3. Close other serial monitors or applications using that port before flashing. If no port appears, try another data cable and USB port, then check the driver installation.
4. If automatic download mode fails, hold **BOOT**, press and release **RESET**, then release BOOT. If necessary, hold BOOT while reconnecting USB, then release it after the computer detects the board. Recheck the port because it can change in download mode. Follow [Waveshare's flashing guide](https://docs.waveshare.com/ESP32-S3-Touch-LCD-1.47/Firmware-Flashing) for the board's button locations and USB recovery procedure.

## Build and first installation

Use an **ESP-IDF 5.5.2** terminal in this folder:

```text
idf.py set-target esp32s3
idf.py build
idf.py -p COMx flash monitor
```

Replace COMx with the board's port. The first flash must include the bootloader, partition table, initial OTA data and application; `idf.py flash` handles those. Do not flash only the application onto a board with an unknown partition layout. An old SDK configuration must be regenerated when switching hardware. Generated build files are ignored by Git.

For example, if Windows lists COM7, the last command is `idf.py -p COM7 flash monitor`. Leave USB connected until flashing finishes. If the board remains in download mode afterward, press RESET once without holding BOOT. Exit the serial monitor with **Ctrl+]** before using that port elsewhere.

After a successful flash, the screen should show the landscape aquarium with three swimmers. Tap the water to reveal **Pause**, **New World**, and **Settings**. The controls disappear after eight seconds; there is no permanent instruction banner. Leave it powered for at least 30 seconds before testing a restart. No Wi-Fi connection is required for the ocean to run. A blank or misaligned display is a board-test failure to investigate, not proof that the installation succeeded.

If you accidentally built this folder using another ESP-IDF version, open a 5.5.2 terminal, run `idf.py fullclean`, and build again. `fullclean` removes generated build output on the computer; it does not erase the board. Keep this edition in its own firmware folder so its configuration is not mixed with the 4-inch project.

The optional release build creates `aquarium-usb.bin`, a merged first-install image starting at address **0x0**, and `ascii-genesis-147.bin`, the application-only image used by wireless updates. They are different files. The 16 MB flash layout reserves two 6 MiB application slots and OTA metadata, with rollback enabled in the bootloader.

## Install a downloaded release, once one is available

Use only a release titled **ESP32 1.47-inch vX.Y.Z** from [this repository's releases](https://github.com/Mikepyt87/ascii-genesis/releases). Download and extract its files before flashing. The `esp32-147-stable` release is a channel pointer, not the first-install package. Raspberry Pi downloads and binaries for other Waveshare boards will not work here.

For a first USB installation, open an ESP-IDF 5.5.2 terminal in the folder containing **aquarium-usb.bin** and run:

```text
python -m esptool --chip esp32s3 --port COM7 write_flash 0x0 aquarium-usb.bin
```

Replace COM7 with your port. This command uses the merged image at address 0x0. Never substitute `ascii-genesis-147.bin` into this command: that file is application-only. The esptool tool bundled with the selected ESP-IDF environment is the intended one; later standalone esptool releases may use different command spelling. The source-build route above avoids manually choosing image addresses.

Keep power connected, wait for completion, press RESET if needed, then do the same display, touch and 30-second startup checks as the source-build route. A USB reinstallation is a fresh bootloader/application installation, so record your current version first and be prepared to enter Wi-Fi details again.

## Join home Wi-Fi

1. Tap the ocean, then **Settings → Set up Wi-Fi with phone**.
2. Join the temporary `ASCII-Genesis-Mini-xxxx` Wi-Fi network from your phone using the random password shown on the aquarium. Firmware before v0.1.2 uses `ASCII-Genesis-xxxx`. The network name and password appear in a larger font in v0.1.2 and later.
3. Stay connected if the phone reports that this network has no internet. Open **http://192.168.4.1** in the phone browser.
4. Enter your **2.4 GHz** home Wi-Fi name and password, then save. Return your phone to its normal network.
5. The device closes its setup network and connects to home Wi-Fi. If the details are wrong, reopen setup and retry. Setup closes after ten minutes or when you tap Back.

The aquarium runs without Wi-Fi. Credentials are saved on the device, never committed, sent to GitHub or printed to logs. This prototype uses normal NVS storage without flash encryption; the initial flash and physical access should remain private.

Open Settings after saving to confirm **Wi-Fi online**. If it remains offline, check the exact spelling and password, move closer to the router, and repeat setup. This implementation accepts an open network or a personal-network password; it does not provide enterprise username/certificate login or a hotel-style captive-portal login. A 5 GHz-only network will not work. A router using one name for both bands can work if its 2.4 GHz band is enabled.

Use the same setup steps whenever the router name or password changes. Do not enter your home Wi-Fi password into the browser simulation: its Connect demo button only models this process and cannot provision a physical board.

## Wireless updates

The device checks once after startup and once per day while connected. **Settings → Check for updates** checks immediately. A compatible update changes the button to **Install vX.Y.Z & restart**. Installation requires that tap; checks never reboot the aquarium automatically. Network work runs separately from the ocean renderer.

The fixed channel is `esp32-147-stable/manifest.json` in this repository's GitHub releases. The manifest identifies the exact board, numeric version, binary length, SHA-256 digest and version-specific HTTPS download URL. Raspberry Pi releases and 4-inch firmware are rejected. Only a newer version from the expected ESP32 release path is accepted.

Downloads use certificate validation and are written to the inactive application slot. Size, digest, ESP image validity, embedded project name and version must match before changing the boot selection. Failed downloads keep the installed version. The new firmware is accepted after 30 seconds of successful render-loop operation, including PSRAM allocation, display transfers and a touch-controller probe. A watchdog reset/crash before that point causes the rollback-enabled bootloader to choose the previous image on the next boot. Wi-Fi availability is not a boot requirement.

Rollback is a boot-recovery mechanism, not a guarantee that every visual or behavioral bug will be detected. Power loss during the first verification period also rolls back. A working USB connection remains the recovery route for first-install or hardware problems. The first image has no previous image to restore.

HTTPS and the manifest digest protect the transport and download integrity; independent firmware signing and secure boot are not enabled. Anyone allowed to publish the repository's stable channel can authorize firmware for its devices.

## Release process

The **Prepare ESP32 1.47 release** GitHub workflow runs manually against main with a numeric X.Y.Z version. It compiles and produces downloadable test artifacts by default. After physical testing, run it with Publish enabled to create `esp32-147-vX.Y.Z` and promote its manifest to the dedicated stable channel. Existing version releases are immutable in this workflow. Neither release is marked as the repository's latest release. The Pi launcher continues to follow main through its existing updater.

There is no published stable ESP32 firmware yet; until a release is promoted, checking reports that no compatible release is available.

### Maintainer: prepare a release without publishing it

1. Make sure the intended changes are merged into main and GitHub's **Check miniature ESP32** and **Check ocean** runs are green.
2. If artwork changed, run `node esp32/1.47-inch/tools/generate-assets.mjs` from the repository root and commit the regenerated `assets.h` before building. The release check rejects stale generated assets.
3. Open **GitHub → Actions → Prepare ESP32 1.47 release → Run workflow**. Choose **main**, enter a new numeric version such as 0.1.1, and leave **Publish unchecked**.
4. Wait for the workflow to finish successfully. Open the completed run and download the `esp32-147-X.Y.Z` artifact from its Artifacts section. GitHub may require you to sign in to download build artifacts.
5. Extract it. Confirm it contains `aquarium-usb.bin`, `ascii-genesis-147.bin` and `manifest.json`. Install the merged image on a test board using the instructions above. Artifacts are test packages, not public stable releases.
6. Verify display, touch, power, phone provisioning and offline operation. Wireless update and rollback tests require two versions on an isolated test setup; do not promote an untested build to the shared stable channel just to test it.

### Maintainer: publish a tested version

Run the same workflow from **main**, use the tested version number and enable **Publish**. Use the same source commit that was tested; if main changed in the meantime, prepare and test a new build from the intended commit first. The workflow builds again, publishes a version-specific release, then replaces the stable channel manifest. Devices only offer a version newer than the one they are running, and still require a tap to install it.

The workflow refuses to replace an existing version release. Use a new version number for a corrected build. Do not manually replace a published version's binary without a matching manifest. To correct a bad promoted version, prepare a fixed higher version and test it before promotion. Pointing the channel at an older version will not downgrade devices that already accepted a newer one.

## Troubleshooting and USB recovery

| What you see | What to do |
| --- | --- |
| `idf.py` is not recognized | Open the installed ESP-IDF 5.5.2 terminal; verify `idf.py --version`. |
| No COM port, or the board only receives power | Try a known data cable, a direct USB port and the installed drivers. Check Device Manager while unplugging and reconnecting. |
| Port busy or access denied | Exit serial monitors with Ctrl+], close other flashing tools, and retry. |
| Connecting dots or failure to enter download mode | Use BOOT/RESET as described above, recheck the port, and retry flashing. |
| Flash succeeds but the screen is blank or colors/touch are wrong | Confirm the exact Touch-LCD-1.47 model and this firmware folder. Capture the serial startup error. Display and touch alignment still require bench verification. |
| Picture works but touch does not | Use v0.1.1 or later, which matches the vendor's separate I2C register-select and read operations. USB serial diagnostics report touch initialization, read errors and press coordinates. Reopen the monitor on the board's current USB port and tap once; report any `touch` messages. |
| Setup Wi-Fi is missing | Reopen Settings and start phone setup. The temporary network closes after ten minutes, saving details, or tapping Back. |
| Browser says "Join the device setup network first" while connected to the aquarium | Use v0.1.2 or later. Earlier versions misread IPv4 connections reported through the dual-stack HTTP server. Reopen setup and visit http://192.168.4.1 after installing the correction. |
| Phone leaves setup Wi-Fi automatically | Stay connected despite the no-internet notice; temporarily disable automatic switching/mobile data if it keeps changing networks. Open http://192.168.4.1 directly. |
| Home Wi-Fi remains offline | Check 2.4 GHz availability, signal, network name and password; repeat setup. The aquarium will continue offline. |
| Clock not ready | Wait for internet time synchronization, then tap Check for updates again. Time service and HTTPS access must be allowed by the network. |
| No compatible release available | No stable release may exist yet, or the offered manifest is unsuitable. Check the repository's ESP32 release notes. |
| Update failed, current version kept | Keep the current version running; check Wi-Fi/internet and retry. The inactive slot can be overwritten on a later attempt. |
| New version resets during its first startup | Leave it powered for recovery. The bootloader should return to the previous accepted version on the next boot; Settings shows the version. If it does not recover, use USB. |

For USB recovery, reconnect the data cable, enter download mode, and use `idf.py -p COM7 flash monitor` from this firmware folder, or flash a known-good merged release image at 0x0. Replace COM7 with your actual port. This reinstalls the software even if the aquarium interface is unusable.

If damaged saved settings prevent recovery, **only when you intend to remove all settings and installed images**, run `idf.py -p COM7 erase-flash`, then immediately run `idf.py -p COM7 flash monitor`. Erasing removes saved Wi-Fi credentials, both application slots and rollback history. It is not a routine update step. Do not unplug between erasing and reinstalling unless you are prepared to resume USB recovery later.

When reporting a problem, include the exact board model, firmware version, what happened, and the serial error text. Remove any Wi-Fi names, passwords, setup passwords or other private details before sharing logs.

## What still needs the board

Check landscape rotation, all four touch corners, colors, frame timing, initial flash, phone provisioning, reconnect after a power cycle, wrong Wi-Fi credentials, interrupted downloads, first-boot watchdog rollback, and successful updates between two real versions. Browser tests model the workflow; they do not emulate radio, flash, bootloader, display or touch hardware.

This miniature is a decorative ocean with up to three swimmers with the existing 27 designs. It does not implement the Pi edition's full ecology or narration. The firmware is GPL-3.0-or-later so its GPL-2.0-or-later artwork can be combined with the Apache-2.0 vendor display driver. The Pi edition keeps its existing license. See COPYING, the driver's LICENSE, the font's BSD notice and the root credits.

