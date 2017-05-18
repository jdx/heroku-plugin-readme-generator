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
