#!/bin/bash
# Environment variables set script
#
# Copies the example environment file and sets the correct values through a string find and replace.

echo "Executing script from: $PWD"
cp $PWD/src/environments/environment.prod.ts $PWD/src/environments/environment.ts
