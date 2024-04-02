#!/bin/bash

# Set script settings
# Exit on error
# Error on undefined variables
# Don't expand commands to hide sensitive parameters
set -eu
npm install tsc -g
npm install
npm tsc -p .
