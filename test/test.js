let expect = require('chai').expect
const Documenter = require('../src/documenter')
describe('.buildCommand', () => {
  it('adds the topic to the output', () => {
    const cmd = {topic: 'addons'}
    const output = Documenter.buildCommand(cmd)
    expect(output).to.contain(`heroku ${cmd.topic}`)
  })
  it('adds the command to the output', () => {
    const cmd = {topic: 'addons'}
    const output = Documenter.buildCommand(cmd)
    expect(output).to.contain(`heroku ${cmd.topic}`)
  })
  it('returns an informational message when there are no flags', () => {
    const cmd = {topic: 'addons'}
    const output = Documenter.buildCommand(cmd)
    expect(output).to.contain('This command has no flags')
  })
  it('italicizes the first line/description', () => {
    const desc = 'create an add-on resource'
    const cmd = {topic: 'addons', description: desc}
    const output = Documenter.buildCommand(cmd)
    expect(output).to.contain(`*${desc}*`)
  })
  it('capitalizes arg names', () => {
    const cmd = {topic: 'addons', args: [{name: 'computer', optional: true}, {name: 'monitor', optional: false}]}
    const output = Documenter.buildCommand(cmd)
    expect(output).to.contain('COMPUTER')
    expect(output).to.contain('MONITOR')
  })
})
describe('.buildFlag', () => {
  it('combines name, char, and description when they are present', () => {
    const flag = {char: 'h', name: 'help', description: 'prints this help message'}
    let result = Documenter.buildFlag(flag)
    expect(result).to.equal('`-h, --help` prints this help message')
  })
  it('combines the name and description when only they are preset', () => {
    const flag = {name: 'help', description: 'prints this help message'}
    let result = Documenter.buildFlag(flag)
    expect(result).to.equal('`--help` prints this help message')
  })
  it('combines only the char and description when only they are present', () => {
    const flag = {char: 'h', description: 'prints this help message'}
    let result = Documenter.buildFlag(flag)
    expect(result).to.equal('`-h` prints this help message')
  })
})

describe('.buildCommandList', () => {
  it('takes a list of commands')
})

describe('.sortedCommands', () => {
  it('sorts the commands alphabetically by topic, then command', () => {
    let commands = _.clone(testCommands)
    commands[0].topic = 'zebras'
    const result = Documenter.sortedCommands(testCommands)
    const correctlySorted = _.sortBy(commands, (a,b) => a.topic)
    // expect(result).
  })
})

let testCommands = [
  {
    command: 'upgrade',
    topic: 'addons',
    description: 'change add-on plan',
    help:'something helpful',
    needsAuth: true,
    wantsApp: true,
    args: [{name: 'addon'}, {name: 'plan', optional: true}]
  },
  {
    topic: 'addons',
    command: 'attach',
    description: 'attach add-on resource to a new app',
    needsAuth: true,
    needsApp: true,
    flags: [{
      name: 'as',
      description: 'name for add-on attachment',
      hasValue: true
    },
      {
        name: 'confirm',
        description: 'overwrite existing add-on attachment with same name',
        hasValue: true
      }],
    args: [{name: 'addon_name'}]
  },
  {
    command: 'create',
    topic: 'addons',
    description: 'create an add-on resource',
    needsAuth: true,
    needsApp: true,
    args: [{name: 'service:plan'}],
    variableArgs: true,
    flags: [{
      name: 'name',
      description: 'name for the add-on resource',
      hasValue: true
    },
      {
        name: 'as',
        description: 'name for the initial add-on attachment',
        hasValue: true
      },
      {
        name: 'confirm',
        description: 'overwrite existing config vars or existing add-on attachments',
        hasValue: true
      },
      {
        name: 'wait',
        description: 'watch add-on creation status and exit when complete'
      }]
  },
  {
    command: 'add',
    hidden: true,
    topic: 'addons',
    description: 'create an add-on resource',
    needsAuth: true,
    needsApp: true,
    args: [{name: 'service:plan'}],
    variableArgs: true,
    flags: [{
      name: 'name',
      description: 'name for the add-on resource',
      hasValue: true
    },
      {
        name: 'as',
        description: 'name for the initial add-on attachment',
        hasValue: true
      },
      {
        name: 'confirm',
        description: 'overwrite existing config vars or existing add-on attachments',
        hasValue: true
      },
      {
        name: 'wait',
        description: 'watch add-on creation status and exit when complete'
      }]
  }
]

