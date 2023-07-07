@echo off

npm install
node ace serve
call ./.venv\Scripts\activate.bat
py ./API/app.py
