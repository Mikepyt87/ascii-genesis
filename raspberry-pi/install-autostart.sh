#!/bin/bash
set -euo pipefail
APP_ROOT="$(cd -- "$(dirname -- "$0")/.." && pwd)"
TASK_AUTOSTART_DIR="$HOME/.config/autostart"
chmod +x "$APP_ROOT/raspberry-pi/launch.sh"
if command -v labwc >/dev/null; then
  TASK_AUTOSTART_DIR="$HOME/.config/labwc"
  mkdir -p "$TASK_AUTOSTART_DIR"
  if [[ ! -f "$TASK_AUTOSTART_DIR/autostart" ]]; then
    if [[ -f /etc/xdg/labwc/autostart ]]; then
      cp /etc/xdg/labwc/autostart "$TASK_AUTOSTART_DIR/autostart"
    else
      touch "$TASK_AUTOSTART_DIR/autostart"
    fi
  fi
  printf -v TASK_LAUNCH '%q' "$APP_ROOT/raspberry-pi/launch.sh"
  TASK_ENTRY="/bin/bash $TASK_LAUNCH &"
  if ! grep -Fqx "$TASK_ENTRY" "$TASK_AUTOSTART_DIR/autostart"; then
    printf '\n%s\n' "$TASK_ENTRY" >> "$TASK_AUTOSTART_DIR/autostart"
  fi
  echo "Aquarium added to labwc desktop startup."
  exit 0
fi
mkdir -p "$TASK_AUTOSTART_DIR"
cat > "$TASK_AUTOSTART_DIR/ascii-genesis.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=ASCII Genesis Aquarium
Exec=/bin/bash "$APP_ROOT/raspberry-pi/launch.sh"
Terminal=false
EOF
echo "Aquarium will launch on the next desktop login."
