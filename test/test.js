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
describe('.buildReadme', () => {
  // const path = require('path')
  // const dir = '/home/moriger/Heroku/heroku-cli-addons'
  // const plugin = require(dir)
  // const pjson = require(path.join(dir, 'package.json'))
  //
  // it('does some stuff', () => {
  //   const readme = Documenter.buildReadme(plugin, pjson)
  // })
})

