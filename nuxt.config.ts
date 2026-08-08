// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@bootstrap-vue-next/nuxt'],

  bootstrapVueNext: {
    css: false,
    directives: {
      all: true,
    },
  },

  css: ['bootstrap-vue-next/dist/bootstrap-vue-next.css', '~/assets/styles/app.scss'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
    },
  },

  typescript: {
    typeCheck: true,
    strict: true,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'es-MX',
      },
    },
  },
});
