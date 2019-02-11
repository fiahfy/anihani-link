const pkg = require('./package.json')

module.exports = {
  /*
   ** Global CSS
   */
  css: ['swiper/dist/css/swiper.css', '~/assets/css/app.css'],
  /*
   ** Headers of the page
   ** Common headers are already provided by @nuxtjs/pwa preset
   */
  head: {
    meta: [
      {
        hid: 'og:url',
        name: 'og:url',
        property: 'og:url',
        content: 'https://fiahfy.github.io/paddy/'
      }
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        href: 'apple-touch-icon.png',
        sizes: '512x512'
      }
    ]
  },
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
    '@nuxtjs/vuetify'
  ],
  /*
   ** Plugins
   */
  plugins: [
    '~/plugins/firebase',
    '~/plugins/vue-awesome-swiper',
    '~/plugins/vuex-persistedstate'
  ],
  /*
   ** Router
   */
  router: {}
}
