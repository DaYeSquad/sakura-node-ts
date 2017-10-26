#!/usr/bin/env bash

export ENTERPRISE_ID=1917856451201954
export ACCESS_ID=LTAIbuVHTjdhr0Nz
export ACCESS_SECRET=6obMhpcupEB8J287J2QG7EiCJTe4lj
export OSS_REGION=oss-cn-beijing

gulp

node lib/js/src/tools/sendchangelog.js
