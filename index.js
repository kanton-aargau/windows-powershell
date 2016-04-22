
const toCamelCase = require('to-camel-case')
const spawn = require('buffered-spawn')
const rename = require('rename-keys')

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

function pipe(a, b) {
  return `${a} | ${b}`
}

function toJson (command) {
  return pipe(command, 'convertto-json')
}

exports.shell = shell
exports.pipe = pipe
exports.toJson = toJson