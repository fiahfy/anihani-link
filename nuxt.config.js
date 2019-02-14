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
  head: { htmlAttrs: { lang: 'ja' } },
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
        id: 'UA-41512550-11'
      }
    ],
    [
      '@nuxtjs/pwa',
      {
        manifest: {
          name: pkg.productName,
          short_name: pkg.productShortName
        },
        meta: {
          nativeUI: true,
          mobileAppIOS: true,
          appleStatusBarStyle: 'black'
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
