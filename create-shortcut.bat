@echo off
setlocal
echo Creating Sireyo Dashboard desktop shortcut...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0create-shortcut.ps1"
set "ERR=%ERRORLEVEL%"
if not "%ERR%"=="0" (
    echo.
    echo Script failed with exit code %ERR%.
    echo Keep this window open and share the error above.
    pause
    exit /b %ERR%
)
echo.
echo Done.
pause
