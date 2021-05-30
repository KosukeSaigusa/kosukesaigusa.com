const createSitemapRoutes = async () => {
  const routes = []
  const { $content } = require('@nuxt/content')
  const techArticles = await $content('tech').fetch()
  const noteArticles = await $content('note').fetch()
  for (const article of techArticles) {
    routes.push(`tech/${article.slug}`)
  }
  for (const article of noteArticles) {
    routes.push(`note/${article.slug}`)
  }
  return routes
}

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Kosuke Saigusa | 技術・雑記ブログ、ポートフォリオ',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'description',
        name: 'description',
        content:
          '技術・雑記ブログとポートフォリオのサイト。Software Developer, Flutter, Dart, Python, Django, TypeScript, Nuxt.js, Vue.js, Firebase, ...',
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'Kosuke Saigusa | 技術・雑記ブログ、ポートフォリオ',
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: '技術・雑記ブログ、ポートフォリオ',
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website',
      },
      {
        hid: 'og:locale',
        property: 'og:locale',
        content: 'ja_JP',
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://kosukesaigusa.github.io',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          '技術・雑記ブログとポートフォリオのサイト。Software Developer, Flutter, Dart, Python, Django, TypeScript, Nuxt.js, Vue.js, Firebase, ...',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: '/ogp.jpg',
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Kosuke Saigusa | 技術・雑記ブログ、ポートフォリオ',
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content:
          '技術・雑記ブログとポートフォリオのサイト。Software Developer, Flutter, Dart, Python, Django, TypeScript, Nuxt.js, Vue.js, Firebase, ...',
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: '/ogp.jpg',
      },
    ],
    link: [
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        sizes: '32x32',
        type: 'image/png',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        sizes: '16x16',
        type: 'image/png',
        href: '/favicon-16x16.png',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'nuxt-fontawesome',
    '@nuxtjs/sitemap',
    '@nuxtjs/google-analytics',
  ],

  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas'],
      },
      {
        set: '@fortawesome/free-brands-svg-icons',
        icons: ['faGithub', 'faTwitter'],
      },
    ],
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-vs.css',
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // 404 ページの設定
  router: {
    // TODO: any 型やめる
    base: '/',
    extendRoutes(routes: any, resolve: any) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue'),
      })
    },
  },

  // Google Analytics の設定
  googleAnalytics: {
    id: 'UA-132467750-1',
  },

  // sitemap の生成
  sitemap: {
    path: '/sitemap.xml',
    hostname: 'https://kosukesaigusa.github.io',
    // generate: true,
    exclude: ['/404'],
    routes: createSitemapRoutes,
  },
}
