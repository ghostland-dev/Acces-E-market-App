import os
import platform
import subprocess

def execute_command(command):
    process = subprocess.Popen(command, shell=True)
    process.wait()

# Execute npm install
execute_command('npm install')

# Execute node ace serve
execute_command('node ace serve')

# Activate virtual environment based on the current operating system
if platform.system() == 'Windows':
    # Windows
    activate_command = 'call ./.venv/Scripts/activate.bat'
else:
    # Unix-like systems
    activate_command = 'source ./.venv/bin/activate'

execute_command(activate_command)

# Execute the Python script
execute_command('py ./API/app.py')
