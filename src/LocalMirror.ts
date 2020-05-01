import getPort from 'get-port'
import got from 'got'
import http from 'http'
import onExit from 'signal-exit'
import url from 'url'
import { TAOBAO_MIRROR } from './consts'

export class LocalMirror {
  private host = '127.0.0.1'

  private port: number | null = null

  private server: http.Server | null = null

  async getPort() {
    if (!this.port) {
      this.port = await getPort()
    }
    return this.port
  }

  async getUrl() {
    return `http://${this.host}:${await this.getPort()}`
  }

  async start() {
    const port = await this.getPort()
    this.server = http
      .createServer(async (req, res) => {
        const { pathname, search } = url.parse(req.url || '')
        const [, packageName = '', ...packagePaths] = (pathname || '').split(
          '/',
        )
        const packagePath = packagePaths.join('/')
        const packageQuery = search || ''
        switch (packageName) {
          case 'cypress': {
            const { headers } = await got.head(
              `https://download.cypress.io/${packagePath}${packageQuery}`,
              {
                followRedirect: false,
              },
            )
            const taobaoUrl = `${TAOBAO_MIRROR}/cypress/${
              headers.location?.split('/desktop/')[1]
            }`
            res.writeHead(302, {
              location: taobaoUrl,
            })
            break
          }
          default: {
            break
          }
        }
        res.end()
      })
      .listen(port, this.host)
    onExit(() => this.stop())
  }

  async stop() {
    return new Promise(resolve => {
      this.server?.close(resolve)
    })
  }
}
