'use strict'

const resolve = require('path').resolve

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Pré Avaliação MPS - SW',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Programa de Pós-Graduação em Computação Aplicada - PPCA'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: 'favicon.ico'
      }
    ]
  },
  router: {
    linkActiveClass: 'is-active'
  },
  /*
  ** Global CSS
  */
  css: [
    { src: '@/assets/overrides.scss', lang: 'sass' },
    { src: 'font-awesome/scss/font-awesome.scss', lang: 'scss' },
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#744d82' },
  /*
  ** Point to resources
  */
  srcDir: resolve(__dirname, '..', 'resources'),
  /*
  ** Modules
  */
  modules: [
    '@nuxtjs/axios',
  ],
  /*
  ** Plugins
  */
  plugins: [
    '~plugins/buefy'
  ]
}
