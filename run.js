#!/usr/bin/env node
'use strict'

var path = require('path')
var dir = process.argv[2] || process.cwd()
var plugin = require(dir)
var pjson = require(path.join(dir, 'package.json'))
const Documenter = require('./src/documenter')

let readme = Documenter.buildReadme(plugin, pjson)
console.log(readme)
