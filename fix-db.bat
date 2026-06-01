@echo off
cd "c:\Users\Jencel Sofer\Desktop\system boi\sireyo-admin-dashboard (2)\sireyo-admin-dashboard\backend"
echo Clearing cache...
C:\xampp\php\php.exe artisan config:clear
C:\xampp\php\php.exe artisan cache:clear
C:\xampp\php\php.exe artisan optimize:clear
echo Running migrations and seed...
C:\xampp\php\php.exe artisan migrate:fresh --seed
echo Done! Please restart your terminal with php artisan serve.
pause