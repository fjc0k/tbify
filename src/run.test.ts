import tmp from 'tempy'
import { getTaobaoEnv } from './getTaobaoEnv'
import { readFileSync, unlinkSync } from 'fs'
import { run } from './run'

const port = 40033

jest.mock('get-port', () => () => port)

describe('run', () => {
  test('正确设置环境变量', async () => {
    const envFilePath = tmp.file()
    const jsFilePath = tmp.writeSync(`
      const fs = require('fs')
      fs.writeFileSync(
        ${JSON.stringify(envFilePath)},
        JSON.stringify(process.env, null, 2),
      )
    `)
    await run('node', [jsFilePath])
    expect(JSON.parse(readFileSync(envFilePath).toString())).toEqual(
      expect.objectContaining(await getTaobaoEnv(`http://127.0.0.1:${port}`)),
    )
    unlinkSync(envFilePath)
    unlinkSync(jsFilePath)
  })

  test('应继承退出码', async () => {
    const jsFilePath = tmp.writeSync(`
      process.exit(100)
    `)
    const exitCode = await run('node', [jsFilePath])
    expect(exitCode).toBe(100)
    unlinkSync(jsFilePath)
  })
})
