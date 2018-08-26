#!/usr/bin/env bash

npm run build
npm run export
git add .
git commit -am "New Build"
git subtree push --prefix out origin master
git push