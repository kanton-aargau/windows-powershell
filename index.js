
const toCamelCase = require('to-camel-case')
const spawn = require('buffered-spawn')
const rename = require('deep-rename-keys')

function shell (command) {
  return spawn('powershell.exe', ['-command', command])
    .then((io) => {
      try {
        const json = rename(JSON.parse(io.stdout), toCamelCase)
        return Object.assign(io, { json })
      } catch (err) {
        return io
      }
    })
}

function create (obj) {
  const identifier = 'a'
  const newObj = assign(identifier, 'new-object PSObject')

  const cmd = Object.keys(obj).reduce(
    (acc, key) => {
      const val = obj[key]
      return compose(acc, addMember(identifier, key, val))
    },
    newObj
  )
  
  // return variable for further manipulation
  return compose(cmd, variable(identifier))
}

function compose () {
  const args = Array.prototype.slice.call(arguments)
  if (args.length == 1) return args[0]
  return args.reduce((acc, arg) => `${statement(acc)} ${arg}`, '')
}

function toJson (command) {
  return pipe(command, 'convertto-json')
}

function addMember (identifier, key, val) {
  return pipe(variable(identifier), `add-member ${key} ${val}`)
}

function pipe(a, b) {
  return `${a} | ${b}`
}

function statement (cmd) {
  return `${cmd};`
}

function assign(a, b) {
  return `${variable(a)} = ${b}`
}

function variable (a) {
  return `$${a}`
}

exports.compose = compose
exports.toJson = toJson
exports.create = create
exports.shell = shell
exports.pipe = pipe
