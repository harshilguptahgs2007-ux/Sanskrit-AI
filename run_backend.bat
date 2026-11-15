@echo off
title Sanskrit AI Backend Server
echo ========================================================
echo        Starting Sanskrit AI Translator Backend
echo ========================================================
echo.

cd /d "%~dp0"

if exist "backend\venv\Scripts\python.exe" (
    echo [OK] Using virtual environment Python...
    set PYTHON_CMD=backend\venv\Scripts\python.exe
) else (
    echo [!] Using system Python...
    set PYTHON_CMD=python
)

echo Starting FastAPI server at http://127.0.0.1:8000 ...
start http://127.0.0.1:8000

%PYTHON_CMD% -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000

pause
