
# windows-powershell

> :zap: Lightweight, functional, promise-based powershell wrapper

[![NPM version][version-image]][version-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Js Standard Style][standard-image]][standard-url]

## Installation

```bash
npm install windows-powershell
```

## Features

* Promise API
* Composable API via `#pipe()`
* Converts powershell like objects to json
* Converts pascal case keys to camel case (`LastErrorCode` -> `lastErrorCode`)

## Example

In this example we get the name of `regedit.exe`. As you can see we don't need to parse the output since it has already been converted to json.


```js
import { shell, pipe, toJson } from 'windows-powershell'

function process (io) {
  const { json, stdout, stderr } = io
  // json -> { name: 'regedit.exe' }
  // stdout -> raw output from the cli
}

const cmd = pipe('get-itemproperty c:\\windows\\regedit.exe', 'select name')
shell(toJson(cmd)).then(process)
```

### Creating objects

#### `native powershell`

```
$a = new-object PSObject; $a | add-member name test; $a | add-member version 0.0.1; $a
```

#### `windows-powershell`
```js
shell(create({ name: 'test', version: '0.0.1' })).then(logStdout)
```

#### `output`

```
name    version        
----    -------                       
test    0.0.1     
```

### Composing

Composing commands allows as to create intermediate values.

#### `native powershell`

```
$a = 1; $a = 2; echo $a + $b;
```

#### `windows-powershell`

```js
shell(compose('$a = 1', '$a = 2', 'echo $a + $b')).then(logStdout)
```

#### `output`

```
3
```

### Piping

#### `native powershell`

```
get-wmiobject Win32_LogicalDisk | select name
```

#### `windows-powershell`

```js
const cmd = pipe(
  'get-wmiobject Win32_LogicalDisk',
  'select name'
)

shell(cmd).then(logStdout)
```

#### `output`

```
name
----
C:
D:
H:
```

## Tests

```bash
npm test
```

## License

[MIT][license-url]

[version-image]: https://img.shields.io/npm/v/windows-powershell.svg?style=flat-square
[version-url]: https://npmjs.org/package/windows-powershell
[david-image]: http://img.shields.io/david/kanton-aargau/windows-powershell.svg?style=flat-square
[david-url]: https://david-dm.org/kanton-aargau/windows-powershell
[standard-image]: https://img.shields.io/badge/code-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[license-image]: http://img.shields.io/npm/l/windows-powershell.svg?style=flat-square
[license-url]: ./license