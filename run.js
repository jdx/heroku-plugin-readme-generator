#!/usr/bin/env node
'use strict'
const _ = require('lodash')

let path = require('path')
const dirs = process.argv.slice(2) || process.cwd()
const Setsumeisho = require('./src/setsumeisho')
let instructions = Setsumeisho.build(dirs)
console.log(instructions)
