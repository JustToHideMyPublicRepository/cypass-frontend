// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  site: {
    url: 'https://cypass.bj',
    name: 'CYPASS',
  },

  sitemap: {
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '12.5%' },
      { label: 'Hreflangs', select: 'count(xhtml:link)', width: '25%' },
    ],
  },

  runtimeConfig: {
    cypassBaseAPI: process.env.CYPASS_API_URL,
    public: {}
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
    storageKey: 'cps_theme',
  },

  app: {
    head: {
      title: 'Souveraineté numérique & sécurité',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'L\'infrastructure de confiance protégeant l\'écosystème numérique du Bénin. Certification, Veille & Audit en temps réel.' },
        { name: 'author', content: 'CYPASS' },
        { name: 'keywords', content: 'cybersécurité, bénin, souveraineté numérique, pki, audit, veille, sécurité, cypass, protection données' },
        { name: 'google-site-verification', content: 'OdKxHpVkBSxk0mj4vD4OTmZPdVi5pWzyCu4QPIMHy9A' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://cypass.bj' }
      ]
    },
  },

  googleFonts: {
    display: 'swap',
    families: {
      'Montserrat': [100, 200, 300, 400, 500, 600, 700, 800, 900],
      'Roboto': [100, 200, 300, 400, 500, 600, 700, 800, 900],
      'Inter': [100, 200, 300, 400, 500, 600, 700, 800, 900],
      'Open+Sans': [300, 400, 500, 600, 700, 800],
      'JetBrains+Mono': [300, 400, 500, 600, 700, 800],
      'Fira+Code': [300, 400, 500, 600, 700],
    }
  },

  typescript: {
    strict: true,
    typeCheck: true
  },
})
