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
  let cmd = 'heroku '
  if (command.command) {
    if (Documenter.topicLinks[command.topic]) {
      cmd += `[${command.topic}:${command.command}](${Documenter.topicLinks[command.topic]})`
    } else {
      cmd += command.topic + ':' + command.command
    }
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
  lines = lines.join('\n')
  return lines
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
Documenter.topicLinks = {}

Documenter.buildReadMe = function (dirs) {
  let path = require('path')
  let allCommands = []
  //TODO: Remove this for public consumption
  let coreCommands = require('cli-engine/lib/commands').commands.map((command) => { new command() })

  allCommands = coreCommands.commands

  for (const dir of dirs) {
    let plugin
    const pluginPath = path.join(process.cwd(), dir)
    plugin = require(pluginPath)
    let pjson = require(path.join(pluginPath, 'package.json'))
    _.chain(plugin.commands.map(c => c.topic)).uniq().each((t) => { Documenter.topicLinks[t] = pjson.homepage }).value()
    allCommands = allCommands.concat(plugin.commands)
  }
  let groupedCommands = _.groupBy(allCommands, 'topic')
  let lines = []

  // lines.push('')
  // lines.push(pjson.description)

  lines.push('')
  lines.push('Commands')
  lines.push('========')
  lines.push('')

  for (let topic in groupedCommands) {
    const sortedCommands = _.sortBy(groupedCommands[topic], 'command')
    lines = lines.concat(sortedCommands.map(Documenter.buildCommand))
  }

  return lines.join('\n').trim()
}

module.exports = Documenter
