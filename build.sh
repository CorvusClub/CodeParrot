#!/bin/bash

npm install
npm run gulp
cp index.html assets -t build
