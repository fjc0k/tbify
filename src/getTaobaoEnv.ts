/* eslint-disable @typescript-eslint/camelcase */

import { TAOBAO_MIRROR, TAOBAO_REGISTRY } from './consts'

export function getTaobaoEnv(LOCAL_MIRROR: string): Record<string, string> {
  return {
    // NPM registry
    npm_config_registry: TAOBAO_REGISTRY,

    // Yarn registry
    yarn_registry: TAOBAO_REGISTRY,

    // nvm
    NVM_NODEJS_ORG_MIRROR: `${TAOBAO_MIRROR}/node`,
    NVM_IOJS_ORG_MIRROR: `${TAOBAO_MIRROR}/iojs`,

    // node-gyp
    NODEJS_ORG_MIRROR: `${TAOBAO_MIRROR}/node`,

    // node-canvas
    npm_config_canvas_binary_host_mirror: `${TAOBAO_MIRROR}/node-canvas-prebuilt`,

    // node-inspector
    npm_config_profiler_binary_host_mirror: `${TAOBAO_MIRROR}/node-inspector/`,

    // node-sqlite3
    npm_config_node_sqlite3_binary_host_mirror: TAOBAO_MIRROR,

    // node-sass
    npm_config_sass_binary_site: `${TAOBAO_MIRROR}/node-sass`,

    // Browser drivers
    npm_config_phantomjs_cdnurl: `${TAOBAO_MIRROR}/phantomjs`,
    npm_config_chromedriver_cdnurl: `${TAOBAO_MIRROR}/chromedriver`.replace(
      'https://',
      'http://',
    ),
    npm_config_operadriver_cdnurl: `${TAOBAO_MIRROR}/operadriver`,

    // Electron
    npm_config_electron_mirror: `${TAOBAO_MIRROR}/electron/`,
    npm_config_electron_builder_binaries_mirror: `${TAOBAO_MIRROR}/electron-builder-binaries/`,

    // Python
    npm_config_python_mirror: `${TAOBAO_MIRROR}/python`,

    // Couchbase
    npm_config_couchbase_binary_host: `${TAOBAO_MIRROR}/couchbase`,

    // Chrome Puppeteer
    npm_config_puppeteer_download_host: TAOBAO_MIRROR,

    // Cypress
    npm_config_CYPRESS_DOWNLOAD_MIRROR: `${LOCAL_MIRROR}/cypress`,
  }
}
