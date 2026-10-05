@echo off
chcp 65001 > nul
title PSU SLF AI Chatbot - Public Runner (Cloudflare Tunnel)
echo ========================================================
echo     PSU SLF AI Chatbot - กำลังเปิดระบบและลิงก์สาธารณะ
echo ========================================================
echo.

echo [1/3] กำลังเริ่ม Backend (FastAPI พอร์ต 8000)...
start "PSU Chatbot - Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo [2/3] กำลังเริ่ม Frontend (Vite พอร์ต 5173)...
start "PSU Chatbot - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo รอระบบเริ่มทำงานสักครู่...
timeout /t 3 > nul

echo [3/3] กำลังเปิดทางเข้าสู่สาธารณะผ่าน Cloudflare Tunnel...
python -u "%~dp0run_tunnel.py"
pause
