const webpack = require('webpack')
module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: '힛갤저장소 - 실시간 인기글 저장소',
    meta: [
      {charset: 'utf-8'},
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no'
      },
      {name: 'theme-color', content: '#EDA7B2'},
      {
        name: 'google-site-verification',
        content: 'BxPxwI8rlJTdR-pDX9EMgegVSy0dNLjXvgQLuRk8D5I'
      },
      {name: 'robots', content: 'index, follow'},
      {hid: 'description', name: 'description', content: '힛갤저장소 - 실시간 인기글 저장소'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.png'},
      {
        href: 'https://fonts.googleapis.com/css2?family=Nunito&display=swap'
      }
    ],
    script: [
      {
        defer: true,
        hid: 'adsense',
        src: '/adsense.js',
      },
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {color: '#EDA7B2'},
  /*
   ** Global CSS
   */
  css: [
    '@/assets/bootstrap.less',
    '@/assets/stylesheets.less',
    '@/assets/vue-nestable.less'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {src: '@/plugins/event-bus.js'},
    {src: '@/plugins/service-worker.js', mode: 'client'},
    // { src: '@/plugins/socket.io.js' },
    {src: '@/plugins/toast.js', mode: 'client'},
    {src: '@/plugins/v-viewer.js', mode: 'client'},
    {src: '@/plugins/vue-aplayer.js', mode: 'client'},
    {src: '@/plugins/vue-avatar.js', mode: 'client'},
    {src: '@/plugins/vue-nestable.js', mode: 'client'},
    {src: '@/plugins/vue-poll.js', mode: 'client'},
    {src: '@/plugins/vue-qriously.js', mode: 'client'},
    {src: '@/plugins/vue-shortkey.js', mode: 'client'},
    {src: '@/plugins/vue-spinners.js', mode: 'client'},
    {src: '@/plugins/vue-waterfall.js', mode: 'client'}
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/eslint-module',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-122960304-1',
        onPageLoad: true
      }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    'bootstrap-vue/nuxt',
    'nuxt-fontawesome',
    'nuxt-clipboard2',
    '@nuxtjs/proxy',
    '@nuxtjs/pwa',
    '@nuxtjs/sentry',
    'nuxtjs-darkmode-js-module',
    ['@nuxtjs/axios', {proxy: true}],
    [
      '@nuxtjs/recaptcha',
      {
        hideBadge: true,
        siteKey: '6LdGdsAZAAAAAHs2tez4PI-6H0kwQ-AnQeIzW6Lw',
        version: 3
      }
    ],
    ['@nuxtjs/moment', ['ko']]
  ],
  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      }
    ]
  },
  darkmodejs: {
    bottom: '4.5rem', // default: '32px'
    right: '1rem', // default: '32px' 
    time: '0.1s', // default: '0.3s'
    mixColor: '#DDDDDD', // default: '#fff'
    backgroundColor: '#fff',  // default: '#fff'
    buttonColorDark: '#100f2c',  // default: '#100f2c'
    buttonColorLight: '#eda7b2', // default: '#fff'
    saveInCookies: true, // default: true,
    label: '🌓', // default: ''
    autoMatchOsTheme: false, // default: true
    disableWidget: true // default: false
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    babel: {
      compact: true,
      presets({isServer}) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            // require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: {version: 3}
            }
          ]
        ]
      }
    },
    //vendor: ["vuex"]
    // vendor: ['vuex', 'socket.io-client'],
    filenames: {
      app: ({isDev}) => isDev ? '[name].js' : '[contenthash].js',
      chunk: ({isDev}) => isDev ? '[name].js' : '[contenthash].js',
      css: ({isDev}) => isDev ? '[name].css' : '[contenthash].css',
      img: ({isDev}) => isDev ? '[path][name].[ext]' : 'img/[contenthash:7].[ext]',
      font: ({isDev}) => isDev ? '[path][name].[ext]' : 'fonts/[contenthash:7].[ext]',
      video: ({isDev}) => isDev ? '[path][name].[ext]' : 'videos/[contenthash:7].[ext]'
    },
    plugins: [
      new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 512000 // 50kb
      })
    ]
  },
  proxy: {
    '/api': 'http://localhost:3000'
  },
  env: {
    SOCKET_HOST_URL: 'https://hitgall.com',
    packageVersionNumber: process.env.npm_package_version_number
  },
  telemetry: false,

  sentry: {
    dsn: 'https://c656f3b5d1614676b82103417f4a94ea@o438188.ingest.sentry.io/5402459',
    config: {}
  },

  pwa: {
    manifest: {
      name: 'hitgall',
      short_name: 'hitgall',
      start_url: '/',
      scope: '/',
      lang: 'ko',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#FFFFFF',
      theme_color: '#00C7AE',
      crossorigin: 'use-credentials'
    },

    icon: {
      source: '/service/component/static/favicon.png',
      fileName: 'favicon.png'
    },

    workbox: {
      offline: false,
      enabled: true,
      cacheAssets: false,
      runtimeCaching: [
        {
          handler: 'cacheFirst',
          urlPattern: '/_nuxt/*',
          method: 'GET',
          strategyOptions: {
            cacheName: process.env.npm_package_version_number,
            cacheExpiration: {
              maxAgeSeconds: 48 * 60 * 60
            }
          }
        },
        {
          handler: 'StaleWhileRevalidate',
          urlPattern: 'https://fonts.googleapis.com/*',
          method: 'GET',
          strategyOptions: {
            cacheName: process.env.npm_package_version_number,
            cacheExpiration: {
              maxAgeSeconds: 48 * 60 * 60
            }
          }
        }
      ]
    },

    meta: {
      viewport: 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no',
      name: '힛갤',
      theme_color: '#29313D',
      lang: 'ko',
      description: '힛갤',
      mobileApp: 'mobile-web-app-capable'
    }
  }
}
