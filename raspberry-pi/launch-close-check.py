"""Linux integration check using a fake browser and an isolated desktop profile."""
from pathlib import Path
import os,subprocess,tempfile,time,urllib.request,socket
if os.name!='posix':
    print('Launcher close integration requires Linux; not run on this host.')
    raise SystemExit(0)
source=Path(__file__).resolve().parent/'launch.sh'
with tempfile.TemporaryDirectory(prefix='ocean-close-') as folder:
    task=Path(folder);home=task/'home';home.mkdir();binary=task/'bin';binary.mkdir()
    browser=binary/'chromium'
    browser.write_text('''#!/bin/bash
echo "$$" > "$ASCII_GENESIS_TEST_DIR/browser.pid"
trap 'touch "$ASCII_GENESIS_TEST_DIR/browser.closed"; exit 0' TERM INT
while true; do sleep .1; done
''')
    browser.chmod(0o755)
    with socket.socket() as check:check.bind(('127.0.0.1',4173))
    env={**os.environ,'HOME':str(home),'PATH':str(binary)+os.pathsep+os.environ['PATH'],
         'ASCII_GENESIS_TEST_DIR':str(task),'ASCII_GENESIS_PORT':'4173','OPENAI_API_KEY':''}
    app=subprocess.Popen(['/bin/bash',str(source)],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        for attempt in range(100):
            if app.poll() is not None:raise AssertionError('Launcher exited before browser started')
            if (task/'browser.pid').exists():break
            time.sleep(.05)
        else:raise AssertionError('Browser did not start')
        request=urllib.request.Request('http://127.0.0.1:4173/api/close',data=b'{}',
            headers={'Origin':'http://127.0.0.1:4173','Content-Type':'application/json'})
        with urllib.request.urlopen(request,timeout=3) as response:assert response.status==200
        assert app.wait(timeout=5)==0,'Close should end the launcher cleanly'
        for attempt in range(50):
            if (task/'browser.closed').exists():break
            time.sleep(.05)
        assert (task/'browser.closed').exists(),'Only the launched browser must receive its close signal'
        lock=home/'.cache/ascii-genesis/app.lock'
        assert subprocess.run(['flock','-n',str(lock),'true']).returncode==0,'Close must release the app lock'
        try:urllib.request.urlopen('http://127.0.0.1:4173/pi',timeout=1)
        except OSError:pass
        else:raise AssertionError('The local server should have stopped')
    finally:
        if app.poll() is None:
            app.terminate()
            try:app.wait(timeout=5)
            except subprocess.TimeoutExpired:app.kill();app.wait()
print('Launcher close: dedicated browser and server stop, clean exit, and app lock release passed.')
