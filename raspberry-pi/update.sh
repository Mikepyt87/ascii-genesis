#!/bin/bash
set -euo pipefail
main(){
APP_ROOT="$(cd -- "$(dirname -- "$0")/.." && pwd)"
QUIET="${1:-}"
message(){ if [[ "$QUIET" != '--quiet' ]]; then zenity --info --title='ASCII Genesis Update' --text="$1" 2>/dev/null || printf '%s\n' "$1"; fi; }
fail(){ message "$1"; exit 1; }
mkdir -p "$HOME/.cache/ascii-genesis"
exec 9>"$HOME/.cache/ascii-genesis/app.lock"
flock -n 9 || fail 'Close the ocean before updating. It will use the new version when you reopen it.'
cd "$APP_ROOT"
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail 'This is a ZIP installation. Install from the GitHub clone instructions to enable updates.'
[[ "$(git rev-parse --show-toplevel)" == "$APP_ROOT" ]] || fail 'The aquarium must be its own Git repository.'
[[ "$(git branch --show-current)" == 'main' ]] || fail 'Updates require the main branch.'
[[ -z "$(git status --porcelain)" ]] || fail 'Local edits were found. Save or commit your changes before updating; nothing was overwritten.'
REMOTE="$(git remote get-url origin)"
[[ "$REMOTE" == 'https://github.com/Mikepyt87/ascii-genesis.git' || "$REMOTE" == 'git@github.com:Mikepyt87/ascii-genesis.git' ]] || fail 'The update remote does not match Mikepyt87/ascii-genesis.'
GIT_TERMINAL_PROMPT=0 timeout 20 git fetch origin main >/dev/null 2>&1 || fail 'GitHub is unavailable. Your installed ocean is unchanged and works offline.'
OLD="$(git rev-parse HEAD)"; NEW="$(git rev-parse FETCH_HEAD)"
[[ "$OLD" != "$NEW" ]] || { message 'You already have the latest ocean.'; exit 0; }
git merge-base --is-ancestor "$OLD" "$NEW" || fail 'Local and remote history differ. No files were changed.'
CHECK_DIR="$(mktemp -d)"
trap 'rm -rf -- "$CHECK_DIR"' EXIT
git archive "$NEW" | tar -x -C "$CHECK_DIR"
node "$CHECK_DIR/simulator/core-check.mjs" >/dev/null || fail 'The new simulation failed its checks. Keeping your current version.'
node "$CHECK_DIR/simulator/openai_bridge_check.mjs" >/dev/null || fail 'The new API bridge failed its checks. Keeping your current version.'
node "$CHECK_DIR/simulator/render-check.mjs" >/dev/null || fail 'The new renderer failed its checks. Keeping your current version.'
for script in "$CHECK_DIR"/raspberry-pi/*.sh; do bash -n "$script" || fail 'The new launcher failed its checks.'; done
git merge --ff-only "$NEW" >/dev/null || fail 'Update could not be applied. Check local changes.'
python3 "$APP_ROOT/raspberry-pi/install-desktop.py" >/dev/null
message 'ASCII Genesis is updated. Open the ocean from its desktop icon.'

}
main "$@"

