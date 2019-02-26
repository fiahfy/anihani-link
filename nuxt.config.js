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
    htmlAttrs: { lang: 'ja' },
    meta: [
      {
        hid: 'viewport',
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, minimal-ui, viewport-fit=cover'
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: '#ff4081' },
  /*
   ** Build configuration
   */
  build: {},
  /*
   ** Mode
   */
  mode: 'spa',
  /*
   ** Generate configuration
   */
  generate: {
    fallback: true
  },
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
          name: 'あにハニ.link (β)',
          short_name: 'あにハニ.link (β)',
          description:
            'バーチャルYouTuberユニット 「有閑喫茶あにまーれ」「ハニーストラップ」 非公式スケジュールサイト'
        },
        meta: {
          nativeUI: true,
          mobileAppIOS: true,
          appleStatusBarStyle: 'black',
          ogHost: 'https://fiahfy-anihani.firebaseapp.com'
        }
      }
    ],
    [
      '@nuxtjs/vuetify',
      {
        theme: {
          primary: '#ff4081',
          accent: '#ff4081'
        },
        options: {
          customProperties: true
        }
      }
    ]
  ],
  /*
   ** Plugins
   */
  plugins: [
    { src: '~/plugins/filter', ssr: false },
    { src: '~/plugins/firebase', ssr: false },
    { src: '~/plugins/vue-awesome-swiper', ssr: false }
  ],
  /*
   ** Router
   */
  router: {}
}
