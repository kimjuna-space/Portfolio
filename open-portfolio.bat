@echo off
setlocal
cd /d "%~dp0"
start "" "http://127.0.0.1:4177"
"C:\Users\UserPC\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" serve-dist.mjs
pause
