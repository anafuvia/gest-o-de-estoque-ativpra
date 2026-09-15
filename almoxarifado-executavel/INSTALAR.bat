@echo off
cd /d "%~dp0"
echo Instalando dependencias...
call npm.cmd install
pause
