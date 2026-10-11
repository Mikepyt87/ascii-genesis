#!/bin/bash
set -euo pipefail
main(){
  APP_ROOT="$(cd -- "$(dirname -- "$0")/.." && pwd)"
  CONFIG_DIR="$HOME/.config/ascii-genesis"
  CACHE_DIR="$HOME/.cache/ascii-genesis"
  mkdir -p "$CACHE_DIR"
  if [[ -f "$CONFIG_DIR/auto-update" && ! -f "$CONFIG_DIR/no-auto-update" ]]; then
    /bin/bash "$APP_ROOT/raspberry-pi/update.sh" --quiet >>"$CACHE_DIR/update.log" 2>&1 || true
  fi
  exec 9>"$CACHE_DIR/app.lock"
  flock -n 9 || { zenity --info --text='ASCII Genesis is already running or updating.' 2>/dev/null || true; exit 0; }
  exec >>"$CACHE_DIR/launch.log" 2>&1
  trap 'zenity --error --title="ASCII Genesis" --text="The ocean could not start. See ~/.cache/ascii-genesis/launch.log" 2>/dev/null || true' ERR
  if [[ -f "$CONFIG_DIR/openai.env" ]]; then set -a; source "$CONFIG_DIR/openai.env"; set +a; fi
  if command -v chromium >/dev/null; then BROWSER=chromium
  elif command -v chromium-browser >/dev/null; then BROWSER=chromium-browser
  else echo 'Install Chromium using the setup instructions.'; exit 1; fi
  node "$APP_ROOT/simulator/server.mjs" &
  SERVER_PID=$!
  trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT
  trap 'exit 0' INT TERM
  for attempt in {1..40}; do
    kill -0 "$SERVER_PID" 2>/dev/null || { echo 'Server stopped. Is port 4173 already in use?'; return 1; }
    if curl --fail --silent http://127.0.0.1:4173/pi >/dev/null; then break; fi
    sleep .25
  done
  curl --fail --silent http://127.0.0.1:4173/pi >/dev/null
  "$BROWSER" --kiosk --noerrdialogs --disable-session-crashed-bubble \
    --user-data-dir="$CACHE_DIR/chromium" \
    'http://127.0.0.1:4173/pi'
}
main "$@"
