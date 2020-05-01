#!/usr/bin/env node
import execa from 'execa'
import { getTaobaoEnv } from './getTaobaoEnv'
import { join } from 'path'
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

  // 兼容 nvm
  if (cmd === 'nvm' && env.NVM_DIR != null) {
    cmd = 'sh'
    args.unshift(join(__dirname, './bin/nvm'))
  }

  try {
    await execa(cmd, args, {
      env: env,
      cwd: cwd,
      stdio: 'inherit',
    })
  } catch {}

  await localMirror.stop()
}

if (!module.parent) {
  run(process.argv[2], process.argv.slice(3))
}
