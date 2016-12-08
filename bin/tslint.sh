#!/bin/sh

BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$BIN_DIR")"

tslint -c ""${ROOT_DIR}"/tslint.json" ""${ROOT_DIR}"/src/*/*.ts" ""${ROOT_DIR}"/src/*/*/*.ts" ""${ROOT_DIR}"/*.ts"
