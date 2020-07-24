#!/bin/bash
# Environment variables set script
#
# Copies the example environment file and sets the correct values through a string find and replace.

echo "Executing script from: $PWD"

cp $PWD/src/environments/environment.example.ts $PWD/src/environments/environment.prod.ts
sed -i 's/production\: false/production\: true/' $PWD/src/environments/environment.prod.ts
SEDCMD="s|http\:\/\/api\.com\/api|$1|"
sed -i $SEDCMD $PWD/src/environments/environment.prod.ts
cp $PWD/src/environments/environment.prod.ts $PWD/src/environments/environment.ts
