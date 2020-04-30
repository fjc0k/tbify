/* eslint-disable @typescript-eslint/camelcase */

// ref: https://github.com/yiminghe/tyarn/blob/master/env.js
// ref: https://github.com/cnpm/cnpm/pull/289/files
// ref: https://npm.taobao.org/mirrors

const taobaoRegistry = 'https://r.npm.taobao.org'
const taobaoMirrors = 'https://cdn.npm.taobao.org/dist'

export const taobaoEnv: Record<string, string> = {
  // NPM registry
  npm_config_registry: taobaoRegistry,

  // Yarn registry
  yarn_registry: taobaoRegistry,

  // nvm
  NVM_NODEJS_ORG_MIRROR: `${taobaoMirrors}/node`,
  NVM_IOJS_ORG_MIRROR: `${taobaoMirrors}/iojs`,

  // node-gyp
  NODEJS_ORG_MIRROR: `${taobaoMirrors}/node`,

  // node-canvas
  npm_config_canvas_binary_host_mirror: `${taobaoMirrors}/node-canvas-prebuilt`,

  // node-inspector
  npm_config_profiler_binary_host_mirror: `${taobaoMirrors}/node-inspector/`,

  // node-sqlite3
  npm_config_node_sqlite3_binary_host_mirror: taobaoMirrors,

  // node-sass
  npm_config_sass_binary_site: `${taobaoMirrors}/node-sass`,

  // Browser drivers
  npm_config_phantomjs_cdnurl: `${taobaoMirrors}/phantomjs`,
  npm_config_chromedriver_cdnurl: `${taobaoMirrors}/chromedriver`.replace(
    'https://',
    'http://',
  ),
  npm_config_operadriver_cdnurl: `${taobaoMirrors}/operadriver`,

  // Electron
  npm_config_electron_mirror: `${taobaoMirrors}/electron/`,
  npm_config_electron_builder_binaries_mirror: `${taobaoMirrors}/electron-builder-binaries/`,

  // Python
  npm_config_python_mirror: `${taobaoMirrors}/python`,

  // Couchbase
  npm_config_couchbase_binary_host: `${taobaoMirrors}/couchbase`,

  // Chrome Puppeteer
  npm_config_puppeteer_download_host: taobaoMirrors,
}
