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
echo Opening XAMPP and starting database...
:: Instead of just opening the control panel, we use xampp_start.exe to automatically boot the services!
if exist "C:\xampp\xampp_start.exe" (
    start "XAMPP" /MIN "C:\xampp\xampp_start.exe"
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
:: Wait a couple seconds to give the backend a head start
timeout /t 2 /nobreak > nul
start "Sireyo Frontend" cmd /k "npm run dev"

echo.
echo Servers have been launched in separate windows!
echo Make sure PHP and Node are installed and in your PATH.
echo You can close this launcher window now.
pause
