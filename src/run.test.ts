import tmp from 'tempy'
import { readFileSync, unlinkSync } from 'fs'
import { run } from './run'
import { taobaoEnv } from './env'

test('正确设置环境变量', () => {
  const envFilePath = tmp.file()
  const jsFilePath = tmp.writeSync(`
    const fs = require('fs')
    fs.writeFileSync(
      ${JSON.stringify(envFilePath)},
      JSON.stringify(process.env, null, 2),
    )
  `)
  run('node', [jsFilePath])
  expect(JSON.parse(readFileSync(envFilePath).toString())).toEqual(
    expect.objectContaining(taobaoEnv),
  )
  unlinkSync(envFilePath)
  unlinkSync(jsFilePath)
})
