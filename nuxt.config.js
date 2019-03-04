module.exports = {
  /*
   ** Global CSS
   */
  css: ['~/assets/css/app.css'],
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
            'バーチャルYouTuberユニット 「有閑喫茶あにまーれ」「ハニーストラップ」 非公式スケジュールサイト',
          background_color: '#212121',
          theme_color: '#212121'
        },
        meta: {
          nativeUI: true,
          mobileAppIOS: true,
          appleStatusBarStyle: 'black-translucent',
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
    { src: '~/plugins/firebase', ssr: false }
  ],
  /*
   ** Router
   */
  router: {
    scrollBehavior: (to, from, savedPosition) => {
      // if the returned position is falsy or an empty object,
      // will retain current scroll position.
      let position = false

      // if no children detected
      if (to.matched.length < 2) {
        // scroll to the top of the page
        position = { x: 0, y: 0 }
      } else if (
        to.matched.some((r) => r.components.default.options.scrollToTop)
      ) {
        // if one of the children has scrollToTop option set to true
        position = { x: 0, y: 0 }
      }

      // savedPosition is only available for popstate navigations (back button)
      if (savedPosition) {
        position = savedPosition
      } else if (to.name === 'index') {
        const d = new Date()
        const y =
          66 * (d.getHours() + 2 + d.getMinutes() / 60) - window.innerHeight / 2
        position = { x: 0, y }
      }

      return new Promise((resolve) => {
        // wait for the out transition to complete (if necessary)
        window.$nuxt.$once('triggerScroll', () => {
          // coords will be used if no selector is provided,
          // or if the selector didn't match any element.
          if (to.hash && document.querySelector(to.hash)) {
            // scroll to anchor by returning the selector
            position = { selector: to.hash }
          }
          resolve(position)
        })
      })
    }
  }
}
