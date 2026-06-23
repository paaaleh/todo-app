const { configure } = require('quasar/wrappers')

module.exports = configure(function () {
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

      vueRouterMode: 'hash',
      publicPath: '/todo-app/',

      minify: true,
      sourcemap: false,
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
  }
})
