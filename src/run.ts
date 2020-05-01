#!/usr/bin/env node
import execa from 'execa'
import { getTaobaoEnv } from './getTaobaoEnv'
import { join } from 'path'
import { LocalMirror } from './LocalMirror'
import { TAOBAO_MIRROR } from './consts'

export async function run(
  cmd: string,
  args = process.argv.slice(2),
  cwd = process.cwd(),
) {
  const localMirror = new LocalMirror(cwd)
  await localMirror.start()

  const env = Object.assign(
    {},
    process.env,
    getTaobaoEnv(await localMirror.getUrl()),
  )

  // 兼容 nvm
  if (cmd === 'nvm') {
    if (process.platform === 'win32') {
      try {
        await Promise.all(
          // ref: https://github.com/coreybutler/nvm-windows#usage
          [
            `nvm node_mirror ${TAOBAO_MIRROR}/node/`,
            `nvm npm_mirror ${TAOBAO_MIRROR}/npm/`,
          ].map(command =>
            execa(command, {
              env: env,
              cwd: cwd,
              stdio: 'ignore',
            }),
          ),
        )
      } catch {}
    } else if (env.NVM_DIR != null) {
      cmd = 'sh'
      args.unshift(join(__dirname, './bin/nvm'))
    }
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
