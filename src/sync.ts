// ref: https://github.com/cnpm/cnpm/blob/master/bin/cnpm-sync
import got from 'got'

async function showLog(
  packageName: string,
  logUrl: string,
  lastLines = 0,
): Promise<{
  ok: boolean
  message?: string
}> {
  const res = await got.get<{
    log: string
  }>(`${logUrl}?offset=${lastLines}`, {
    responseType: 'json',
    throwHttpErrors: false,
  })

  if (res.statusCode !== 200) {
    return {
      ok: false,
      message: `${res.statusCode}: ${res.statusMessage || '-'}`,
    }
  }

  if (res.body.log) {
    const log = res.body.log.trim()
    console.log(log)
    lastLines += log.split('\n').length
    if (log.indexOf(`[done] Sync ${packageName}`) >= 0) {
      return { ok: true }
    }
  }

  await new Promise(resolve => setTimeout(resolve, 2000))
  return showLog(packageName, logUrl, lastLines)
}

export async function sync(packageNames: string[]) {
  if (!packageNames || !packageNames.length) {
    console.log('Can not find any packages to sync')
    process.exit(0)
  }
  console.log('Start sync %j', packageNames)
  const failedPackages: string[] = []
  const successPackages: string[] = []
  for (const packageName of packageNames) {
    const syncUrl = `https://registry-direct.npmmirror.com/${packageName}/sync?${new URLSearchParams(
      {
        publish: 'false',
        nodeps: 'false',
      },
    ).toString()}`
    console.log('sync %s, PUT %s', packageName, syncUrl)
    const syncRequestRes = await got.put<{
      ok: boolean
      logId: string
      error: string
      reason: string
      message: string
    }>(syncUrl, {
      responseType: 'json',
      throwHttpErrors: false,
    })
    if (!syncRequestRes.body.ok) {
      console.error(
        '[%s] %s: %s',
        syncRequestRes.statusCode,
        syncRequestRes.body.error || '-',
        syncRequestRes.body.reason || syncRequestRes.body.message || '-',
      )
      failedPackages.push(packageName)
    } else {
      const logUrl = `https://registry.npmmirror.com/${packageName}/sync/log/${syncRequestRes.body.logId}`
      console.log('logurl: %s', logUrl)
      const res = await showLog(packageName, logUrl)
      if (!res.ok) {
        console.error(res.message!)
        failedPackages.push(packageName)
      } else {
        successPackages.push(packageName)
      }
    }
  }
  console.log(
    'Sync all packages done, successed: %j, failed: %j',
    successPackages,
    failedPackages,
  )
  process.exit(0)
}

if (!module.parent) {
  sync(process.argv.slice(2))
}
