let expect = require('chai').expect
const _ = require('lodash')
const Setsumeisho = require('../src/setsumeisho')
describe('.buildCommand', () => {
  it('adds the topic to the output', () => {
    const cmd = {topic: 'addons'}
    const output = Setsumeisho.buildCommand(cmd)
    expect(output).to.contain(`heroku ${cmd.topic}`)
  })
  it('adds the command to the output', () => {
    const cmd = {topic: 'addons', command: 'list'}
    const output = Setsumeisho.buildCommand(cmd)
    expect(output).to.contain(`heroku ${cmd.topic}:${cmd.command}`)
  })
  it('returns an informational message when there are no flags', () => {
    const cmd = {topic: 'addons'}
    const output = Setsumeisho.buildCommand(cmd)
    expect(output).to.contain('This command has no flags')
  })
  it('italicizes the first line/description', () => {
    const desc = 'create an add-on resource'
    const cmd = {topic: 'addons', description: desc}
    const output = Setsumeisho.buildCommand(cmd)
    expect(output).to.contain(`*${desc}*`)
  })
  it('capitalizes arg names', () => {
    const cmd = {topic: 'addons', args: [{name: 'computer', optional: true}, {name: 'monitor', optional: false}]}
    const output = Setsumeisho.buildCommand(cmd)
    expect(output).to.contain('COMPUTER')
    expect(output).to.contain('MONITOR')
  })
  describe('for v6 commands', () => {
    it('adds the command and topic to the output')
  })
})

describe('.termFormat', () => {
  it('wraps 4-space-indented code in the terminal markdown', () => {
    const sample = `Example:

    echo "hello world, world"
    sudo /sbin/telinit 0

`
    const expectedResult = `
\`\`\`term
    echo "hello world, world"
    sudo /sbin/telinit 0


\`\`\``
    const result = Setsumeisho.termFormat(sample)
    expect(result).to.contain(expectedResult)
  })
})
describe('.buildFlag', () => {
  it('combines name, char, and description when they are present', () => {
    const flag = {char: 'h', name: 'help', description: 'prints this help message'}
    let result = Setsumeisho.buildFlag(flag)
    expect(result).to.equal('`-h, --help` prints this help message')
  })
  it('combines the name and description when only they are preset', () => {
    const flag = {name: 'help', description: 'prints this help message'}
    let result = Setsumeisho.buildFlag(flag)
    expect(result).to.equal('`--help` prints this help message')
  })
  it('combines only the char and description when only they are present', () => {
    const flag = {char: 'h', description: 'prints this help message'}
    let result = Setsumeisho.buildFlag(flag)
    expect(result).to.equal('`-h` prints this help message')
  })
})
describe('.cmdSort', () => {
  it('puts the plain topic command before the sub-commands', () => {
    const result = Setsumeisho.cmdSort(orgCommands)
    expect(result[0]).to.not.have.property('command')
    expect(result[0]).to.have.property('topic', 'access')
  })
})

const orgCommands = [
  {
    'topic': 'access',
    'description': 'list who has access to an app',
    'needsAuth': true,
    'needsApp': true,
    'flags': [
      {
        'name': 'json',
        'description': 'output in json format'
      }
    ],
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'sharing',
    'command': 'access',
    'help': 'This command is now heroku access',
    'variableArgs': true,
    'hidden': true,
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'access',
    'needsAuth': true,
    'needsApp': true,
    'command': 'add',
    'description': 'Add new users to your app',
    'help': 'heroku access:add user@email.com --app APP # Add a collaborator to your app\n\nheroku access:add user@email.com --app APP --permissions deploy,manage,operate # permissions must be comma separated',
    'args': [
      {
        'name': 'email',
        'optional': false
      }
    ],
    'flags': [
      {
        'name': 'permissions',
        'description': 'list of permissions comma separated',
        'hasValue': true,
        'optional': true
      },
      {
        'name': 'privileges',
        'hasValue': true,
        'optional': true,
        'hidden': true
      }
    ],
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'sharing',
    'command': 'add',
    'help': 'this command is now heroku access:add',
    'variableArgs': true,
    'hidden': true,
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'access',
    'needsAuth': true,
    'needsApp': true,
    'command': 'remove',
    'description': 'Remove users from your app',
    'help': 'heroku access:remove user@email.com --app APP',
    'args': [
      {
        'name': 'email',
        'optional': false
      }
    ],
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'sharing',
    'command': 'remove',
    'help': 'this command is now heroku access:remove',
    'variableArgs': true,
    'hidden': true,
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'access',
    'needsAuth': true,
    'needsApp': true,
    'command': 'update',
    'description': 'Update existing collaborators in an org app',
    'help': 'heroku access:update user@email.com --app APP --privileges deploy,manage,operate',
    'args': [
      {
        'name': 'email',
        'optional': false
      }
    ],
    'flags': [
      {
        'name': 'permissions',
        'hasValue': true,
        'description': 'comma-delimited list of permissions to update (deploy,manage,operate)'
      },
      {
        'name': 'privileges',
        'hasValue': true,
        'hidden': true
      }
    ],
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'apps',
    'command': 'join',
    'description': 'add yourself to an organization app',
    'needsAuth': true,
    'needsApp': true,
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'join',
    'command': null,
    'description': 'add yourself to an organization app',
    'needsAuth': true,
    'needsApp': true,
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'apps': {
      'topic': 'apps',
      'command': 'leave',
      'description': 'remove yourself from an organization app',
      'needsAuth': true,
      'needsApp': true
    },
    'root': {
      'topic': 'leave',
      'command': null,
      'description': 'remove yourself from an organization app',
      'needsAuth': true,
      'needsApp': true
    },
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'apps',
    'command': 'lock',
    'description': 'prevent organization members from joining an app',
    'needsAuth': true,
    'needsApp': true,
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'lock',
    'description': 'prevent organization members from joining an app',
    'needsAuth': true,
    'needsApp': true,
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'apps',
    'command': 'transfer',
    'description': 'transfer applications to another user, organization or team',
    'needsAuth': true,
    'wantsApp': true,
    'args': [
      {
        'name': 'recipient',
        'description': 'user, organization or team to transfer applications to'
      }
    ],
    'flags': [
      {
        'name': 'locked',
        'char': 'l',
        'hasValue': false,
        'required': false,
        'description': 'lock the app upon transfer'
      },
      {
        'name': 'bulk',
        'hasValue': false,
        'required': false,
        'description': 'transfer applications in bulk'
      }
    ],
    'help': '\nExamples:\n\n  $ heroku apps:transfer collaborator@example.com\n  Transferring example to collaborator@example.com... done\n\n  $ heroku apps:transfer acme-widgets\n  Transferring example to acme-widgets... done\n\n  $ heroku apps:transfer --bulk acme-widgets\n  ...\n  ',
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'sharing',
    'command': 'transfer',
    'help': 'this command is now heroku apps:transfer',
    'variableArgs': true,
    'hidden': true,
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'apps': {
      'topic': 'apps',
      'command': 'unlock',
      'description': 'unlock an app so any organization member can join',
      'needsAuth': true,
      'needsApp': true
    },
    'root': {
      'topic': 'unlock',
      'command': null,
      'description': 'unlock an app so any organization member can join',
      'needsAuth': true,
      'needsApp': true
    },
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'members',
    'description': 'list members of an organization or a team',
    'needsAuth': true,
    'wantsOrg': true,
    'flags': [
      {
        'name': 'role',
        'char': 'r',
        'hasValue': true,
        'description': 'filter by role'
      },
      {
        'name': 'pending',
        'hasValue': false,
        'description': 'filter by pending team invitations'
      },
      {
        'name': 'team',
        'char': 't',
        'hasValue': true,
        'description': 'team to use'
      },
      {
        'name': 'json',
        'description': 'output in json format'
      }
    ],
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'members',
    'command': 'add',
    'description': 'adds a user to an organization or a team',
    'needsAuth': true,
    'wantsOrg': true,
    'args': [
      {
        'name': 'email'
      }
    ],
    'flags': [
      {
        'name': 'role',
        'char': 'r',
        'hasValue': true,
        'required': true,
        'description': 'member role (admin, collaborator, member, owner)'
      },
      {
        'name': 'team',
        'char': 't',
        'hasValue': true,
        'description': 'team to use'
      }
    ],
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'members',
    'command': 'set',
    'description': 'sets a members role in an organization or a team',
    'needsAuth': true,
    'wantsOrg': true,
    'args': [
      {
        'name': 'email'
      }
    ],
    'flags': [
      {
        'name': 'role',
        'char': 'r',
        'hasValue': true,
        'required': true,
        'description': 'member role (admin, collaborator, member, owner)'
      },
      {
        'name': 'team',
        'char': 't',
        'hasValue': true,
        'description': 'team to use'
      }
    ],
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'members',
    'command': 'remove',
    'description': 'removes a user from an organization or a team',
    'needsAuth': true,
    'wantsOrg': true,
    'args': [
      {
        'name': 'email'
      }
    ],
    'flags': [
      {
        'name': 'team',
        'char': 't',
        'hasValue': true,
        'description': 'team to use'
      }
    ],
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'orgs',
    'description': 'list the organizations that you are a member of',
    'needsAuth': true,
    'flags': [
      {
        'name': 'json',
        'description': 'output in json format'
      },
      {
        'name': 'enterprise',
        'hasValue': false,
        'description': 'filter by enterprise orgs'
      },
      {
        'name': 'teams',
        'hasValue': false,
        'description': 'filter by teams'
      }
    ],
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'orgs',
    'command': 'default',
    'hidden': true,
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'orgs',
    'command': 'open',
    'description': 'open the organization interface in a browser window',
    'needsAuth': true,
    'needsOrg': true,
    'homepage': 'https://github.com/heroku/heroku-orgs'
  },
  {
    'topic': 'teams',
    'description': 'list the teams that you are a member of',
    'needsAuth': true,
    'flags': [
      {
        'name': 'json',
        'description': 'output in json format'
      }
    ],
    'homepage': 'https://github.com/heroku/heroku-orgs'
  }
]

let testCommands = [
  {
    command: 'upgrade',
    topic: 'addons',
    description: 'change add-on plan',
    help: 'something helpful',
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

