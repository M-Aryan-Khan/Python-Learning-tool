@echo off
cd /d "%~dp0"
echo Python Path is starting at http://localhost:8765  (close this window to stop)
start "" http://localhost:8765
python -m http.server 8765 --bind 127.0.0.1
