//Setsumeisho literally means 'instructions' in Japanese

const _ = require('lodash')

let Setsumeisho = function () {}

Setsumeisho.buildFlag = function (flag) {
  const flagDescription = flag.description || ''
  if (flag['char'] && flag.name) {
    return `\`-${flag.char}, --${flag.name}\` ${flagDescription}`
  } else if (flag.name) {
    return `\`--${flag.name}\` ${flagDescription}`
  } else if (flag.char) {
    return `\`-${flag.char}\` ${flagDescription}`
  }
}

Setsumeisho.buildCommand = function (command) {
  if (command.hidden) return ''
  let lines = []
  let cmd = '### `heroku '
  if (command.command) {
    cmd += command.topic + ':' + command.command
  } else if (command.default) {
    cmd += command.default.topic
    if (command.default.command) cmd += ':' + command.default.command
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
  cmd += '`'
  lines.push(cmd)
  //lines.push(cmd.replace(/./g, '-'))
  lines.push('')
  if (!command.description && (!command.default || !command.default.description)) {
    lines.push('MISSING DESCRIPTION')
  } else {
    const desc = command.description || command.default.description
    lines.push('*' + desc + '*')
  }
  Setsumeisho.addAliases(lines, command)

  lines.push('')
  lines.push('#### Flags')
  Setsumeisho.buildFlags(lines, command)

  if (command.help) {
    lines.push(Setsumeisho.termFormat(command.help))
  }
  lines.push('')
  lines.push(`[(top)](#table-of-contents)\n`)
  lines.push('')
  lines = lines.join('\n')
  return lines
}

Setsumeisho.termFormat = function (lines) {
  let open = false
  let splitLines = lines.split('\n')
  for (let i in splitLines) {
    if (!open) {
      if (splitLines[i].match(/^[\s]{4,4}/)) {
        open = true
        splitLines[i - 1] = '\n```term'
      }
      if (Number(i) + 1 === splitLines.length && open) {
        open = false
        splitLines[i] = splitLines[i] + '\n```\n'
      }
      splitLines[i] = splitLines[i].replace(/^[\s]+/, '')
    } else {
      if (Number(i) + 1 === splitLines.length) {
        splitLines[i] = splitLines[i] + '\n```\n'
        open = false
      } else if (splitLines[i].match(/^[\s]*$/) && splitLines[Number(i) + 1].match(/^[\s]{4,4}[\w]+/)) {
        //do nothing
      } else if (splitLines[i].match(/^[\s]*$/) && splitLines[Number(i) + 1].match(/^[\s]{0,3}[\w]+/)) {
        splitLines[i] = splitLines[i] + '\n```\n'
        open = false
      }
      splitLines[i] = splitLines[i].replace(/^[\s]+/, '')
    }
  }
  return splitLines.join('\n').replace(/\s?Example/g, '#### Example').replace(/^Overview/m, '### Overview')
}

Setsumeisho.buildFlags = function (lines, command) {
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
      lines.push(Setsumeisho.buildFlag(flag))
      lines.push('')
    }
  } else {
    lines.push('This command has no flags\n')
  }
}

Setsumeisho.addAliases = function (lines, command) {
  if (command.aliases && command.aliases.length > 0) {
    lines.push('Aliases:')
    for (const alias in command.aliases) {
      command.aliases.push(' * ' + alias.name)
    }
  }
}
Setsumeisho.topicLinks = {}

Setsumeisho.groupByTopic = function (commands) {

}
Setsumeisho.build = function (dirs) {
  let path = require('path')
  let allCommands = []
  let topicObjs = []
  let coreCommands = require('cli-engine/lib/commands').commands///.map((command) => { new command() })
  let corePjson = require('cli-engine/package')
  topicObjs.push(require('cli-engine').topic)
  coreCommands.forEach((c) => { c.homepage = corePjson.homepage }) //; c.topic === undefined ? c.topic = 'core' : noop() })

  allCommands = coreCommands
  for (const dir of dirs) {
    let plugin
    const pluginPath = path.join(process.cwd(), dir)
    plugin = require(pluginPath)
    topicObjs.push(plugin.topic)
    let pjson = require(path.join(pluginPath, 'package.json'))
    plugin.commands.forEach((c) => c.homepage = pjson.homepage)
    allCommands = allCommands.concat(plugin.commands)
  }
  allCommands.forEach((c) => { c.default ? (c.topic = c.default.topic) : _.noop() })
  let groupedCommands = _.groupBy(allCommands, 'topic')
  let lines = []

  lines.push('')
  lines.push('Commands')
  lines.push('========')
  lines.push('')

  const topics = _.keys(groupedCommands).sort()
  for (let topic of topics) {
    if (topic.match(/^_/)) continue
    const sortedCommands = Setsumeisho.cmdSort(groupedCommands[topic])
    if (topic !== undefined && topic !== "undefined") lines.push(`## ${topic}\n`)
    const topicObj = _.find(topicObjs, (t) => t && t.name === topic && t.overview)
    if (topicObj && topicObj.overview) lines.push(Setsumeisho.termFormat(topicObj.overview + '\n'))
    lines = lines.concat(sortedCommands.map(Setsumeisho.buildCommand))
  }

  return lines.join('\n').trim()
}

Setsumeisho.cmdSort = function (commands) {
  return _.sortBy(commands, [(c) => { return c.command || 0 }])
}

module.exports = Setsumeisho
