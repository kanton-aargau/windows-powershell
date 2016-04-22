
const loudRejection = require('loud-rejection')
const powershell = require('../')
const test = require('tape')

loudRejection()

const shell = powershell.shell
const toJson = powershell.toJson
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