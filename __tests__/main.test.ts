import {wait} from '../src/wait'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as os from 'os'

import {destination} from '../src/destination'

test('throws invalid number', async () => {
  const input = parseInt('foo', 10)
  await expect(wait(input)).rejects.toThrow('milliseconds not a number')
})

test('wait 500 ms', async () => {
  const start = new Date()
  await wait(500)
  const end = new Date()
  var delta = Math.abs(end.getTime() - start.getTime())
  expect(delta).toBeGreaterThan(450)
})

// shows how the runner will run a javascript action with env / stdout protocol
test('install completes successfully', () => {
  process.env['INPUT_MILLISECONDS'] = '500'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: {
      ...process.env,
      RUNNER_TEMP: os.tmpdir()
    }
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})

// attempts to run the installed binary
// init is used because it provides a successful/zero exit code
test('cli init runs', () => {
  process.env['INPUT_MILLISECONDS'] = '500'
  const ip = path.join(destination, 'approovcli', 'bin', 'approov');
  console.log(cp.execSync(`${ip} init`).toString())
})

