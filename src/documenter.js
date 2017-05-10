
let Documenter = function () {}

Documenter.buildFlag = function (flag) {
  if (flag['char'] && flag.name) return `\`-${flag.char}, --${flag.name}\` ${flag.description}`
  if (flag.name) return `\`--${flag.name}\` ${flag.description}`
  if (flag.char) return `\`-${flag.char}\` ${flag.description}`
}

Documenter.buildCommand = function (command) {
  let lines = []
  let cmd = 'heroku ' + command.topic
  if (command.command) {
    cmd += ':' + command.command
  }
  for (let arg of (command.args || [])) {
    cmd += ' ' + (arg.optional ? `[${arg.name}]` : arg.name)
  }
  lines.push(cmd)
  lines.push(cmd.replace(/./g, '-'))
  lines.push('')
  lines.push(command.description || 'MISSING DESCRIPTION')
  lines.push('')
  for (let flag of (command.flags || [])) {
    lines.push(Documenter.buildFlag(flag))
    lines.push('')
  }
  if (command.help) {
    lines.push('```')
    lines.push(command.help)
    lines.push('```')
  }
  lines.push('')
  return lines.join('\n')
}

Documenter.buildReadme = function (plugin, pjson) {
  let lines = []
  lines.push(pjson.name)
  lines.push(pjson.name.replace(/./g, '='))
  lines.push('')

  // TODO: parse out owner and repo name
  lines.push(`[![Build Status](https://travis-ci.org/heroku/${pjson.name}.svg?branch=master)](https://travis-ci.org/heroku/${pjson.name})`)
  lines.push(`[![License](https://img.shields.io/github/license/heroku/${pjson.name}.svg)](https://github.com/heroku/${pjson.name}/blob/master/LICENSE)`)

  lines.push('')
  lines.push(pjson.description)

  lines.push('')
  lines.push('Commands')
  lines.push('========')
  lines.push('')

  lines.push('TODO: developing locally')

  lines = lines.concat(plugin.commands.map(Documenter.buildCommand))

  return lines.join('\n').trim()
}

module.exports = Documenter
