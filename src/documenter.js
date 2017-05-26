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
    if (command.homepage) {
      cmd += `[${command.topic}:${command.command}](${command.homepage})`
    } else {
      cmd += command.topic + ':' + command.command
    }
  } else if (command.default) {
    if (command.homepage) {
      cmd += `[${command.default.topic}`
      if (!!command.default.command) {
        cmd += `:${command.default.command}`
      }
      cmd += `](${command.homepage})`
    } else {
      cmd += command.default.topic
      if (command.default.command) cmd += ':' + command.default.command
    }
    // cmd += command.topic + ':'
  } else if (command.topic) {
    cmd += command.topic
  } else if (command.default && command.default.topic) {
    cmd += command.default.topic
  } else {
    return ''
  }
  for (let arg of (command.args || [])) {
    cmd += ' ' + (arg.optional ? `[${arg.name.toUpperCase()}]` : arg.name.toUpperCase())
  }
  lines.push(cmd)
  lines.push(cmd.replace(/./g, '-'))
  lines.push('')
  if (!command.description && (!command.default || !command.default.description)) {
    lines.push('MISSING DESCRIPTION')
  } else {
    const desc = command.description || command.default.description
    lines.push('*' + desc + '*')
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
  let flags = []
  if (command.default && command.default.flags) {
    lines.push('')
    flags = command.default.flags
    //TODO: figure out v6 flags
    // for(let flag in flags){
    //   console.dir(flags[flag], { colors: true, depth: null })
    // }
  } else if (command.flags && command.flags.length) {
    flags = command.flags
    for (let flag of (command.flags || [])) {
      lines.push(Documenter.buildFlag(flag))
      lines.push('')
    }
  } else {
    lines.push('This command has no flags\n')
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
  let coreCommands = require('cli-engine/lib/commands').commands///.map((command) => { new command() })
  let corePjson = require('cli-engine/package')
  coreCommands.forEach((c) => c.homepage = corePjson.homepage)

  allCommands = coreCommands

  //end removal

  for (const dir of dirs) {
    let plugin
    const pluginPath = path.join(process.cwd(), dir)
    plugin = require(pluginPath)
    let pjson = require(path.join(pluginPath, 'package.json'))
    plugin.commands.forEach((c) => c.homepage = pjson.homepage)
    allCommands = allCommands.concat(plugin.commands)
  }
  let groupedCommands = _.groupBy(allCommands, 'topic')
  let lines = []

  lines.push('')
  lines.push('Commands')
  lines.push('========')
  lines.push('')

  const topics = _.keys(groupedCommands).sort()
  for (let topic of topics) {
    const sortedCommands = Documenter.cmdSort(groupedCommands[topic])
    lines = lines.concat(sortedCommands.map(Documenter.buildCommand))
  }

  return lines.join('\n').trim()
}

Documenter.cmdSort = function (commands) {
  return _.sortBy(commands, [(c) => { return c.command || 0 }])
}

module.exports = Documenter
