#!/usr/bin/env node
import execa from 'execa'
import { getTaobaoEnv } from './env'
import { LocalMirror } from './LocalMirror'

export async function run(
  cmd: string,
  args = process.argv.slice(2),
  cwd = process.cwd(),
) {
  const localMirror = new LocalMirror()
  await localMirror.start()
  const env = Object.assign(
    {},
    process.env,
    getTaobaoEnv(await localMirror.getUrl()),
  )
  await execa(cmd, args, {
    env: env,
    cwd: cwd,
    stdio: 'inherit',
  })
  await localMirror.stop()
}

if (!module.parent) {
  run(process.argv[2], process.argv.slice(3))
}
