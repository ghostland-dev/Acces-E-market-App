#!/bin/bash

# Function to run a command in the background on Windows
run_in_background() {
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Windows
        start "./setup.sh"
    else
        "$1" &
    fi
}

# Activate the Python virtual environment
run_in_background "source ./venv/Scripts/activate"

# Run the Python app.py script
run_in_background "python app.py"

# Run the Node.js ace serve command
run_in_background "node ace serve --watch"

# Run the Python injecteur.py script
run_in_background "python injecteur.py"
