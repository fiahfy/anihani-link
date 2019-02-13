const pkg = require('./package.json')

module.exports = {
  /*
   ** Global CSS
   */
  css: ['~/assets/css/app.css'],
  /*
   ** Headers of the page
   ** Common headers are already provided by @nuxtjs/pwa preset
   */
  head: {},
  /*
   ** Customize the progress bar color
   */
  loading: { color: '#8BC34A' },
  /*
   ** Build configuration
   */
  build: {},
  /*
   ** Mode
   */
  mode: 'spa',
  /*
   ** Source directory
   */
  srcDir: 'src',
  /*
   ** Modules
   */
  modules: [
    ['@nuxtjs/dotenv', { path: process.cwd() }],
    [
      '@nuxtjs/google-analytics',
      {
        id: 'XXXXX'
      }
    ],
    [
      '@nuxtjs/pwa',
      {
        manifest: {
          name: pkg.productName,
          short_name: pkg.productName
        },
        meta: {
          nativeUI: true,
          mobileAppIOS: true
        }
      }
    ],
    [
      '@nuxtjs/vuetify',
      {
        theme: {
          primary: '#ff4081',
          accent: '#ff4081'
        }
      }
    ]
  ],
  /*
   ** Plugins
   */
  plugins: ['~/plugins/firebase'],
  /*
   ** Router
   */
  router: {}
}
