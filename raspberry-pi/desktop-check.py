"""Verify desktop launchers without modifying the machine's real desktop."""
from pathlib import Path
from unittest.mock import patch
import tempfile
import runpy

with tempfile.TemporaryDirectory(prefix='ocean-desktop-') as folder:
    home = Path(folder)
    desktop = home / 'My Desktop'
    with patch.object(Path, 'home', return_value=home), \
         patch('subprocess.check_output', return_value=str(desktop)), \
         patch('subprocess.run'):
        runpy.run_path(str(Path(__file__).with_name('install-desktop.py')))
    for slug in ('ascii-genesis', 'ascii-genesis-update'):
        path = desktop / (slug + '.desktop')
        contents = path.read_text(encoding='utf-8')
        assert 'Terminal=false' in contents
        assert 'Exec=/bin/bash "' in contents
        assert 'ocean.svg' in contents
        assert (home / '.local/share/applications' / path.name).read_text(encoding='utf-8') == contents
print('Desktop launchers and application-menu entries passed in an isolated test folder.')
