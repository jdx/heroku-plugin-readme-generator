#!/usr/bin/env node
'use strict'
const _ = require('lodash')

var path = require('path')
const dirs = process.argv.slice(2) || process.cwd()
let readme = Documenter.buildReadme(dirs)
console.log(readme)


var plugin = require(dir)
var pjson = require(path.join(dir, 'package.json'))
const Documenter = require('./src/documenter')

//TODO: remove this when packaging for public consumption


// end removal area

