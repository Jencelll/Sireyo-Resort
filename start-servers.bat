@echo off
title Sireyo Server Launcher

:: Temporarily add XAMPP PHP to the path if it exists
if exist "C:\xampp\php\php.exe" (
    set "PATH=%PATH%;C:\xampp\php"
)

echo =======================================
echo Starting Sireyo Admin Dashboard Servers
echo =======================================

echo.
echo Opening XAMPP Control Panel and Services...
if exist "C:\xampp\xampp-control.exe" (
    start "" "C:\xampp\xampp-control.exe"
)

if exist "C:\xampp\xampp_start.exe" (
    start "XAMPP Services" /MIN "C:\xampp\xampp_start.exe"
    :: Give the database a few seconds to fully initialize
    timeout /t 3 /nobreak > nul
) else (
    echo XAMPP not found at C:\xampp, skipping automatic db start.
)

echo.
echo Starting Laravel Backend (API)...
where php >nul 2>nul
if %errorlevel% neq 0 (
    start "Sireyo Backend Error" cmd /k "echo ERROR: PHP is not installed or not added to your system's PATH. && echo Please install PHP (e.g. download from windows.php.net, or install XAMPP) and add it to your Windows Environment Variables. && echo Then restart this launcher."
) else (
    start "Sireyo Backend" cmd /k "cd backend && php artisan serve"
)

echo.
echo Starting React Frontend (Vite)...
set "CAN_RUN_FRONTEND=1"
where npm >nul 2>nul
if %errorlevel% neq 0 (
    set "CAN_RUN_FRONTEND=0"
    start "Sireyo Frontend Error" cmd /k "echo ERROR: npm is not installed or not added to your system's PATH. && echo Please install Node.js (https://nodejs.org) and ensure npm is available. && echo Then restart this launcher."
    start https://nodejs.org/en/download
)

if "%CAN_RUN_FRONTEND%"=="1" (
    :: Wait a couple seconds to give the backend a head start
    timeout /t 2 /nobreak > nul
    start "Sireyo Frontend" cmd /k "npm run dev"
)

echo.
echo Automatically opening the dashboard in your browser...
if "%CAN_RUN_FRONTEND%"=="1" (
    :: Wait a couple seconds for Vite to compile and start
    timeout /t 3 /nobreak > nul
    start http://localhost:5173
)

echo.
echo Servers have been launched and the browser opened!
echo Make sure PHP and Node are installed and in your PATH.
echo You can close this launcher window now.
pause
