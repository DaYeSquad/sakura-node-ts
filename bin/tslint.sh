#!/bin/sh

BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$BIN_DIR")"

./node_modules/.bin/tslint -c ./node_modules/tslint-sakura-contrib/tslint.json src/**/*.ts -e src/example/*.ts src/test/*.ts
