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

  const taobaoEnv = await getTaobaoEnv(await localMirror.getUrl())
  for (const envName of Object.keys(taobaoEnv)) {
    if (process.env[envName] != null) {
      delete taobaoEnv[envName]
    }
  }
  const env = Object.assign({}, process.env, taobaoEnv)

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
  } else if (cmd === 'sync') {
    cmd = 'node'
    args.unshift(join(__dirname, './sync.js'))
  }

  const exec = execa(cmd, args, {
    env: env,
    cwd: cwd,
    stdio: 'inherit',
  })

  try {
    await exec
  } catch {}

  await localMirror.stop()

  const exitCode = exec.exitCode || 0

  // 测试时返回退出码
  if (process.env.JEST_WORKER_ID) {
    return exitCode
  }

  process.exit(exitCode)
}

if (!module.parent) {
  if (process.argv[2] === '-v' || process.argv[2] === '--version') {
    console.log(require(join(__dirname, '../package.json')).version)
  } else {
    run(process.argv[2], process.argv.slice(3))
  }
}
