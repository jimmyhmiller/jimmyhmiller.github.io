#!/usr/bin/env bash

yarn run build
yarn run export
touch out/.nojekyll
git add .
git commit -am "New Build"
git subtree push --prefix out origin master
git push