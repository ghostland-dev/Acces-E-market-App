import os
import platform
import subprocess

def execute_command(command):
    process = subprocess.Popen(command, shell=True)
    process.wait()

 
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
