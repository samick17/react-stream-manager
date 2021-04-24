#!/usr/bin/env sh

rm -rf ./dist
mkdir -p ./dist

npm run build:main
cp ./dist/index.min.js ./example/index.min.js