"""Install native Raspberry Pi OS desktop launchers for the current user."""
from pathlib import Path
import os
import subprocess

root = Path(__file__).resolve().parent.parent
home = Path.home()
try:
    desktop = Path(subprocess.check_output(['xdg-user-dir', 'DESKTOP'], text=True).strip())
except (FileNotFoundError, subprocess.CalledProcessError):
    desktop = home / 'Desktop'
if not desktop.is_absolute() or desktop == home:
    desktop = home / 'Desktop'
applications = home / '.local/share/applications'

def quoted(value):
    # Exec values use desktop-entry escaping, not shell interpolation.
    text = str(value).replace('\\', '\\\\').replace('"', '\\"').replace('`', '\\`').replace('$', '\\$')
    return '"' + text.replace('%', '%%') + '"'

for slug, name, script, comment in [
    ('ascii-genesis', 'ASCII Genesis', 'launch.sh', 'Open your quiet traveling ocean'),
    ('ascii-genesis-update', 'Update ASCII Genesis', 'update.sh', 'Get the latest ocean and fish from GitHub'),
]:
    contents = '\n'.join([
        '[Desktop Entry]', 'Version=1.0', 'Type=Application', f'Name={name}',
        f'Comment={comment}', f'Exec=/bin/bash {quoted(root / "raspberry-pi" / script)}',
        f'Icon={root / "raspberry-pi/ocean.svg"}', 'Terminal=false',
        'Categories=Game;', 'StartupNotify=false', '',
    ])
    for folder in (desktop, applications):
        folder.mkdir(parents=True, exist_ok=True)
        destination = folder / (slug + '.desktop')
        destination.write_text(contents, encoding='utf-8')
        destination.chmod(0o755)
        try:
            subprocess.run(['gio', 'set', str(destination), 'metadata::trusted', 'true'],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
        except FileNotFoundError:
            pass
print(f'Installed Raspberry Pi desktop icons in {desktop}')
