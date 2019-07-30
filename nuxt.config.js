import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: { lang: 'ja' },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, minimal-ui, viewport-fit=cover'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: colors.pink.accent2 },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/filter', ssr: false },
    { src: '~/plugins/firebase', ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  devModules: [
    '@nuxtjs/eslint-module',
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
          ogHost: 'https://fiahfy-anihani.web.app'
        }
      }
    ],
    [
      '@nuxtjs/vuetify',
      {
        customVariables: ['~/assets/variables.scss'],
        treeShake: true,
        dark: true,
        theme: {
          themes: {
            dark: {
              primary: colors.pink.accent2,
              accent: colors.pink.accent2
            }
          }
        }
      }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },

  srcDir: 'src',
  generate: {
    fallback: true
  },
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
