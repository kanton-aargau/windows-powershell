
const loudRejection = require('loud-rejection')
const trim = require('newline-remove')
const powershell = require('../')
const test = require('tape')

loudRejection()

const compose = powershell.compose
const toJson = powershell.toJson
const create = powershell.create
const shell = powershell.shell
const pipe = powershell.pipe

test('execute the command in powershell', (t) => {
  const str = 'executed from powershell'
  shell(`echo "${str}"`)
    .then((io) => {
      t.same(str, io.stdout.trim())
      t.end()
    })
})

test('pipe', (t) => {
  const cmd = pipe('get-itemproperty c:\\windows\\regedit.exe', 'select name')
  shell(toJson(cmd))
    .then((io) => {
      t.same(io.json.name, 'regedit.exe')
      t.end()
    })
})

test('convert objects to json and camelizes their keys' , (t) => {
  shell(toJson('get-help'))
    .then((io) => {
      t.true(io.json.value)
      t.true(io.json.category)
      t.end()
    })
})

test('individual statements', (t) => {
  t.plan(2)

  shell(compose('echo 1', 'echo 2'))
    .then((io) => t.same(trim(io.stdout), '12'))

  shell(compose('echo 1', 'echo 2', 'echo 3'))
    .then((io) => t.same(trim(io.stdout), '123'))
})

test('create', (t) => {
  const obj = create({ name: 'test', version: '0.0.1' })
  shell(toJson(obj))
    .then((io) => {
      t.same(io.json.name, 'test')
      t.same(io.json.version, '0.0.1')
      t.end()
    })
})

/*test('where', (t) => {
  shell(where('get-wmiobject Win32_LogicalDisk', { driveType: 3 }))
})*/