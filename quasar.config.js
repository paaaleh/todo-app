const { configure } = require('quasar/wrappers')

module.exports = configure(function (ctx) {
  return {
    eslint: {
      warnings: true,
      errors: true,
    },

    boot: [],

    css: [],

    extras: ['material-icons'],

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node20',
      },

      vueRouterMode: 'history',
      publicPath: '/todo-app/',

      minify: true,
      sourcemap: false,

      vitePlugins: [
        ['vite-plugin-checker', {
          typescript: true,
        }, { server: false }],
      ],

      extendViteConf(viteConf) {
        viteConf.build = viteConf.build ?? {}
        viteConf.build.rollupOptions = {
          output: {
            manualChunks: {
              'vue-vendor': ['vue', 'vue-router', 'pinia'],
              'quasar-vendor': ['quasar', '@quasar/extras'],
              'axios-vendor': ['axios'],
            },
          },
        }
      },
    },

    devServer: {
      open: true,
    },

    framework: {
      config: {},
      plugins: [],
      iconSet: 'material-icons',
    },

    animations: [],

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ['render'],
    },

    pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentials: false,
    },
  }
})
