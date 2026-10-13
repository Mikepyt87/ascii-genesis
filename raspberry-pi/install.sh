#!/bin/bash
set -euo pipefail
APP_ROOT="$(cd -- "$(dirname -- "$0")/.." && pwd)"
if [[ $EUID -eq 0 ]]; then echo 'Run this as your normal Pi desktop user, without sudo.'; exit 1; fi
sudo apt update
sudo apt install -y nodejs chromium curl git python3 xdg-user-dirs zenity util-linux
node -e 'if(Number(process.versions.node.split(".")[0])<20)process.exit(1)' || { echo 'Node.js 20 or newer is required. Upgrade Node and run this installer again.'; exit 1; }
node "$APP_ROOT/simulator/core-check.mjs"
node "$APP_ROOT/simulator/openai_bridge_check.mjs"
node "$APP_ROOT/simulator/render-check.mjs"
node "$APP_ROOT/simulator/close-check.mjs"
python3 "$APP_ROOT/raspberry-pi/install-desktop.py"
mkdir -p "$HOME/.config/ascii-genesis"
if [[ ! -e "$HOME/.config/ascii-genesis/no-auto-update" ]]; then touch "$HOME/.config/ascii-genesis/auto-update"; fi
echo 'Ready. Double-click ASCII Genesis on your Raspberry Pi desktop.'
