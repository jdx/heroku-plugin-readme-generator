const _ = require('lodash')
let Documenter = function () {}

Documenter.buildFlag = function (flag) {
  const flagDescription = flag.description || ''
  if (flag['char'] && flag.name) {
    return `\`-${flag.char}, --${flag.name}\` ${flagDescription}`
  } else if (flag.name) {
    return `\`--${flag.name}\` ${flagDescription}`
  } else if (flag.char) {
    return `\`-${flag.char}\` ${flagDescription}`
  }
}

Documenter.buildCommand = function (command) {
  if (command.hidden) return ''
  let lines = []
  let cmd = 'heroku ' + command.topic
  if (command.command) {
    cmd += ':' + command.command
  }
  for (let arg of (command.args || [])) {
    cmd += ' ' + (arg.optional ? `[${arg.name.toUpperCase()}]` : arg.name.toUpperCase())
  }
  lines.push(cmd)
  lines.push(cmd.replace(/./g, '-'))
  lines.push('')
  if (!command.description) {
    lines.push('MISSING DESCRIPTION')
  } else {
    lines.push('*' + command.description + '*')
  }
  Documenter.addAliases(lines, command)

  lines.push('')
  Documenter.buildFlags(lines, command)

  if (command.help) {
    lines.push(command.help)
  }
  lines.push('')
  return lines.join('\n')
}

Documenter.buildFlags = function (lines, command) {
  if (!command.flags || command.flags.length === 0) {
    lines.push('This command has no flags\n')
  } else {
    for (let flag of (command.flags || [])) {
      lines.push(Documenter.buildFlag(flag))
      lines.push('')
    }
  }
}

Documenter.addAliases = function (lines, command) {
  if (command.aliases && command.aliases.length > 0) {
    lines.push('Aliases:')
    for (const alias in command.aliases) {
      command.aliases.push(' * ' + alias.name)
    }
  }
}

Documenter.buildReadme = function (plugin, pjson) {
  let lines = []
  lines.push(pjson.name)
  lines.push(pjson.name.replace(/./g, '='))
  lines.push('')

  lines.push('')
  lines.push(pjson.description)

  lines.push('')
  lines.push('Commands')
  lines.push('========')
  lines.push('')

  // console.dir(plugin, { colors: true, depth: null })
  const sortedPlugins = _.sortBy(plugin.commands, [(c) => c.topic, (c) => c.name])
  lines = lines.concat(sortedPlugins.map(Documenter.buildCommand))

  return lines.join('\n').trim()
}

module.exports = Documenter
