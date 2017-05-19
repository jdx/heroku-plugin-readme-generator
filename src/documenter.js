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

Documenter.buildReadMe = function (dirs) {
	var path = require('path')
	let plugins = []
  for(const dir of dirs){
		let plug = {}
		plug['plugin'] = require(dir)
		plug['pjson'] = require(path.join(dir, 'package.json'))
		plugins.push(plug)
	}
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

  Documenter.buildCommandList(allCommands, lines)

  return lines.join('\n').trim()
}

Documenter.buildCommandList = function (commands, lines) {
	const sortedCommands = _.sortBy(commands,[(c) => c.topic, (c) => c.command ] )
  lines = lines.concat(sortedCommands.map(Documenter.buildCommand))
  return lines
}

module.exports = Documenter
