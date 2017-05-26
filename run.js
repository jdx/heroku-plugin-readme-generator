#!/usr/bin/env node
'use strict'
const _ = require('lodash')

let path = require('path')
const dirs = process.argv.slice(2) || process.cwd()
const Documenter = require('./src/documenter')
let readme = Documenter.buildReadMe(dirs)
console.log(readme)
