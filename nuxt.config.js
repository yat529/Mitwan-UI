module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '米团',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A Handy Event Finder' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', integrity: 'sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU', href: 'https://use.fontawesome.com/releases/v5.3.1/css/all.css', crossorigin: 'anonymous' },
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Oswald'}
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },

  plugins: [

    // global registration of Gloabl components
    '~plugins/loadGlobalComponents',
    '~plugins/directives',

  ],

  /* 
  ** Load Global Scss file
  */

  css: [
    // color style
    '@assets/style/style.scss',
    // // layout style
    // '@assets/style/layout.scss',
    // // effect style
    // '@assets/style/effect.scss',
    // // animations
    // '@assets/style/animation.scss',
  ]
}

