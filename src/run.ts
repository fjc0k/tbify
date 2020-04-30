#!/usr/bin/env node
import execa from 'execa'
import { taobaoEnv } from './env'

export function run(
  cmd: string,
  args = process.argv.slice(2),
  cwd = process.cwd(),
) {
  const env = Object.assign({}, process.env, taobaoEnv)
  execa.sync(cmd, args, {
    env: env,
    cwd: cwd,
    stdio: 'inherit',
  })
}

if (!module.parent) {
  run(process.argv[2], process.argv.slice(3))
}
