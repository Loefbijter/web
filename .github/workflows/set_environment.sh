#!/bin/bash
# Environment variables set script
#
# Copies the example environment file and sets the correct values through a string find and replace.

cp ./src/environments/environment.example.ts ./src/environments/environment.prod.ts
sed -i 's/production\: false/production\: true/' ./src/environments/environment.prod.ts
SEDCMD="s|http\:\/\/api\.com\/api|$1|"
sed -i $SEDCMD ./src/environments/environment.prod.ts
