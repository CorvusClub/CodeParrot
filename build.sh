#!/bin/bash

npm install
npm run gulp
cp -r index.html assets -t build
