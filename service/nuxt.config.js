module.exports = {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: "힛갤",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no"
      },
      { name: "theme-color", content: "#29313D" },
      {
        name: "google-site-verification",
        content: "BxPxwI8rlJTdR-pDX9EMgegVSy0dNLjXvgQLuRk8D5I"
      },
      { name: "robots", content: "index, follow" },
      { hid: "description", name: "description", content: "힛갤" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Nunito&display=swap"
      }
    ],
    script: [
      {
        src:
          "https://www.google.com/recaptcha/api.js?render=6LdGdsAZAAAAAHs2tez4PI-6H0kwQ-AnQeIzW6Lw"
      },
      { src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#2D99E1" },
  /*
   ** Global CSS
   */
  css: [
    "~/assets/bootstrap.less",
    "~/assets/stylesheets.less",
    "~/assets/vue-toastification.css"
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: "@/plugins/service-worker.js" },
    //{ src: "@/plugins/workbox-range-request.js" },
    //{ src: "@/plugins/firebase-sw.js" },
    // { src: '@/plugins/socket.io.js' },
    { src: "@/plugins/v-viewer.js", mode: "client" },
    { src: "@/plugins/vue-aplayer.js", mode: "client" },
    { src: "@/plugins/vue-avatar.js", mode: "client" },
    { src: "@/plugins/vue-poll.js", mode: "client" },
    { src: "@/plugins/vue-qriously.js", mode: "client" },
    { src: "@/plugins/vue-shortkey.js", mode: "client" },
    { src: "@/plugins/vue-spinners.js", mode: "client" },
    { src: "@/plugins/vue-toastification.js", mode: "client" },
    { src: "@/plugins/vue-waterfall.js", mode: "client" },
    { src: "@/plugins/service-worker.js", ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "@nuxtjs/eslint-module",
    [
      "@nuxtjs/google-analytics",
      {
        id: "UA-122960304-1"
      }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    "bootstrap-vue/nuxt",
    "nuxt-fontawesome",
    "nuxt-clipboard2",
    "@nuxtjs/proxy",
    "@nuxtjs/pwa",
    "@nuxtjs/sentry",
    ["@nuxtjs/axios", { proxy: true }],
    [
      "@nuxtjs/recaptcha",
      {
        hideBadge: true,
        siteKey: "6LdGdsAZAAAAAHs2tez4PI-6H0kwQ-AnQeIzW6Lw",
        version: 3
      }
    ],
    ["@nuxtjs/google-adsense"],
    ["@nuxtjs/moment", ["ko"]]
  ],
  "google-adsense": {
    id: "ca-pub-4618344904272976"
  },
  fontawesome: {
    imports: [
      {
        set: "@fortawesome/free-solid-svg-icons",
        icons: ["fas"]
      }
    ]
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
      presets({ isServer }) {
        return [
          [
            require.resolve("@nuxt/babel-preset-app"),
            // require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
            {
              buildTarget: isServer ? "server" : "client",
              corejs: { version: 3 }
            }
          ]
        ];
      }
    },
    vendor: ["vuex"]
    // vendor: ['vuex', 'socket.io-client'],
  },
  proxy: {
    "/api": "http://localhost:3000"
  },
  env: {
    SOCKET_HOST_URL: "https://www.hitgall.com",
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
    start_url: "/",
    scope: '/',
    lang:'ko',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FFFFFF',
    theme_color: '#00C7AE',
    crossorigin: 'use-credentials',
    gcm_sender_id: '103953800507'
  },

  icon: {
    source:'/service/component/static/favicon.png',
    fileName:'favicon.png'
  },

  workbox: {
    //cachingExtensions: '@/plugins/workbox-range-request.js',
    offline: false,
    enabled: true,
    cacheAssets: false,
    runtimeCaching: [
      {
        handler: 'cacheFirst',
        urlPattern: "/_nuxt/*",
        method: "GET",
        strategyOptions: {
          cacheName: process.env.npm_package_version_number,
          cacheExpiration: {
            maxAgeSeconds: 30 * 60
          }
        }
      },
      {
        handler: 'StaleWhileRevalidate',
        urlPattern: "https://pagead2.googlesyndication.com/js/*",
        method: "GET",
        strategyOptions: {
          cacheName: process.env.npm_package_version_number,
          cacheExpiration: {
            maxAgeSeconds: 30 * 60
          }
        }
      },
      {
        handler: 'StaleWhileRevalidate',
        urlPattern: "https://fonts.googleapis.com/*",
        method: "GET",
        strategyOptions: {
          cacheName: process.env.npm_package_version_number,
          cacheExpiration: {
            maxAgeSeconds: 30 * 60
          }
        }
      },
      {
        handler: 'cacheFirst',
        urlPattern: "/board/*",
        method: "GET",
        strategyOptions: {
          cacheName: process.env.npm_package_version_number,
          cacheExpiration: {
            maxAgeSeconds: 30 * 60
          }
        }
      },
    ]
  },

  meta: {
    viewport:'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no',
    name:'힛갤',
    theme_color:'#29313D',
    lang:'ko',
    description:'힛갤',
    mobileApp:'mobile-web-app-capable'
  }
 },
  // firebase:  {
  //   config: {
  //     apiKey: 'AIzaSyDLM1hRPZUx6386HL6SFDoiNcIa93ITP9U',
  //     authDomain: 'hitgall.firebaseapp.com',
  //     databaseURL: 'https://hitgall.firebaseio.com',
  //     projectId: 'hitgall',
  //     storageBucket: 'hitgall.appspot.com',
  //     messagingSenderId: '307237237837',
  //     appId: '1:307237237837:web:28979138a3e0a6439f1804',
  //     //measurementId: '<measurementId>'
  //   },
  //   services: {
  //     auth: false,
  //     firestore: false,
  //     functions: false,
  //     storage: false,
  //     realtimeDb: false,
  //     messaging: true,
  //     performance: false,
  //     analytics: false,
  //     remoteConfig: false
  //   }
  // }
};
