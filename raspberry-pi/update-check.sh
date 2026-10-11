#!/bin/bash
# Isolated Linux integration check: no real home, remote, or desktop changes.
set -euo pipefail
SOURCE="$(cd -- "$(dirname -- "$0")/.." && pwd)"
TEST_ROOT="$(mktemp -d)"
trap 'rm -rf -- "$TEST_ROOT"' EXIT
export HOME="$TEST_ROOT/home"
mkdir -p "$HOME" "$TEST_ROOT/source"
cp -R "$SOURCE/simulator" "$SOURCE/raspberry-pi" "$TEST_ROOT/source/"
git -C "$TEST_ROOT/source" init -b main -q
git -C "$TEST_ROOT/source" config user.name 'Ocean Test'
git -C "$TEST_ROOT/source" config user.email 'test@example.invalid'
git -C "$TEST_ROOT/source" add .
git -C "$TEST_ROOT/source" commit -qm initial
git clone -q --bare "$TEST_ROOT/source" "$TEST_ROOT/remote.git"
git clone -q "$TEST_ROOT/remote.git" "$TEST_ROOT/client"
git -C "$TEST_ROOT/client" remote set-url origin https://github.com/Mikepyt87/ascii-genesis.git
git -C "$TEST_ROOT/client" config "url.$TEST_ROOT/remote.git.insteadOf" https://github.com/Mikepyt87/ascii-genesis.git
# git remote get-url expands insteadOf, so inject a wrapper only for that query.
mkdir -p "$TEST_ROOT/bin"
REAL_GIT="$(command -v git)"; export REAL_GIT
cat > "$TEST_ROOT/bin/git" <<'WRAPPER'
#!/bin/bash
if [[ "$*" == 'remote get-url origin' ]]; then echo 'https://github.com/Mikepyt87/ascii-genesis.git'; else exec "$REAL_GIT" "$@"; fi
WRAPPER
chmod +x "$TEST_ROOT/bin/git"
export PATH="$TEST_ROOT/bin:$PATH"
echo new-fish > "$TEST_ROOT/source/release.txt"
git -C "$TEST_ROOT/source" add .
git -C "$TEST_ROOT/source" commit -qm update
git -C "$TEST_ROOT/source" push -q "$TEST_ROOT/remote.git" main
bash "$TEST_ROOT/client/raspberry-pi/update.sh" --quiet
test "$(cat "$TEST_ROOT/client/release.txt")" = new-fish
echo changed >> "$TEST_ROOT/client/release.txt"
if bash "$TEST_ROOT/client/raspberry-pi/update.sh" --quiet; then echo 'Dirty checkout was accepted'; exit 1; fi
git -C "$TEST_ROOT/client" restore release.txt
exec 8>"$HOME/.cache/ascii-genesis/app.lock"
flock -n 8
if bash "$TEST_ROOT/client/raspberry-pi/update.sh" --quiet; then echo 'Running-app lock was ignored'; exit 1; fi
flock -u 8
# A bad candidate must leave the current HEAD untouched.
BEFORE="$(git -C "$TEST_ROOT/client" rev-parse HEAD)"
echo 'throw new Error("broken candidate")' > "$TEST_ROOT/source/simulator/render-check.mjs"
git -C "$TEST_ROOT/source" add .
git -C "$TEST_ROOT/source" commit -qm broken
git -C "$TEST_ROOT/source" push -q "$TEST_ROOT/remote.git" main
if bash "$TEST_ROOT/client/raspberry-pi/update.sh" --quiet; then echo 'Broken update was accepted'; exit 1; fi
test "$(git -C "$TEST_ROOT/client" rev-parse HEAD)" = "$BEFORE"
echo 'Updater: clean update, dirty checkout, app lock and failed-candidate checks passed.'
