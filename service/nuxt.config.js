module.exports = {
	mode: 'universal',
	/*
	** Headers of the page
	*/
	head: {
		title: '힛갤',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no' },
			{ name: 'theme-color', content: '#29313D' },
			{ name: 'google-site-verification', content: 'BxPxwI8rlJTdR-pDX9EMgegVSy0dNLjXvgQLuRk8D5I' },
			{ name: 'robots', content: 'index, follow' },
			{ hid: 'description', name: 'description', content: '힛갤' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
			{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Nunito&display=swap' }
		],
		script: [
			{ src: 'https://www.google.com/recaptcha/api.js?render=6LfO7_0UAAAAAGPyu2MULjvStvaMMpzGADpWZOku' }
		]
	},
	/*
	** Customize the progress-bar color
	*/
	loading: { color: '#2D99E1' },
	/*
	** Global CSS
	*/
	css: [
		'~/assets/bootstrap.less',
		'~/assets/stylesheets.less',
		'~/assets/vue-toastification.css'
	],
	/*
	** Plugins to load before mounting the App
	*/
	plugins: [
		// { src: '@/plugins/socket.io.js' },
		{ src: '@/plugins/v-viewer.js', mode: 'client' },
		{ src: '@/plugins/vue-aplayer.js', mode: 'client' },
		{ src: '@/plugins/vue-avatar.js', mode: 'client' },
		{ src: '@/plugins/vue-poll.js', mode: 'client' },
		{ src: '@/plugins/vue-qriously.js', mode: 'client' },
		{ src: '@/plugins/vue-shortkey.js', mode: 'client' },
		{ src: '@/plugins/vue-spinners.js', mode: 'client' },
		{ src: '@/plugins/vue-toastification.js', mode: 'client' },
		{ src: '@/plugins/vue-waterfall.js', mode: 'client' }
	],
	/*
	** Nuxt.js dev-modules
	*/
	buildModules: [
		'@nuxtjs/eslint-module',
		['@nuxtjs/google-analytics', {
			id: 'UA-122960304-1'
		}]
	],
	/*
	** Nuxt.js modules
	*/
	modules: [
		'bootstrap-vue/nuxt',
		'nuxt-fontawesome',
		'nuxt-clipboard2',
		'@nuxtjs/proxy',
		['@nuxtjs/axios', { proxy: true }],
		['@nuxtjs/recaptcha', {
			hideBadge: true,
			siteKey: '6LfO7_0UAAAAAGPyu2MULjvStvaMMpzGADpWZOku',
			version: 3
		}],
		['@nuxtjs/google-adsense'],
		['@nuxtjs/moment', ['ko']],
	],
	'google-adsense': {
		id: 'ca-pub-4618344904272976'
	},
	fontawesome: {
		imports: [
			{
				set: '@fortawesome/free-solid-svg-icons',
				icons: ['fas']
			}
		]
	},
	/*
	** Axios module configuration
	** See https://axios.nuxtjs.org/options
	*/
	axios: {
	},
	/*
	** Build configuration
	*/
	build: {
		babel: {
			presets({ isServer }) {
				return [
					[
						require.resolve('@nuxt/babel-preset-app'),
						// require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
						{
							buildTarget: isServer ? 'server' : 'client',
							corejs: { version: 3 }
						}
					]
				]
			}
		},
		vendor: ['vuex'],
		// vendor: ['vuex', 'socket.io-client'],
	},
	proxy: {
		'/api': 'http://localhost:3000'
	},
	env: {
		SOCKET_HOST_URL: 'https://www.hitgall.com'
	},
}