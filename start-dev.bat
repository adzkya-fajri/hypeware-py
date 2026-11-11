@echo off
echo ========================================
echo Starting Hypeware Development Servers
echo ========================================
echo.
echo [1] Starting Main Website (Port 8080)
echo [2] Starting Studio React App (Port 5173)
echo.
echo Press Ctrl+C to stop all servers
echo ========================================
echo.

REM Start main website dengan Python HTTP Server
start "Main Website" cmd /k "python -m http.server 8080 || python3 -m http.server 8080"

REM Tunggu 2 detik
timeout /t 2 /nobreak >nul

REM Start React Studio
start "Studio React" cmd /k "cd custome && npm run dev"

echo.
echo ========================================
echo Servers Started!
echo ========================================
echo Main Website: http://localhost:8080
echo Studio React: http://localhost:5173
echo ========================================
echo.
echo Press any key to open browsers...
pause >nul

REM Buka browser
start http://localhost:8080
start http://localhost:5173

echo.
echo Servers are running. Close this window to stop all servers.
pause
