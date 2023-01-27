// https://v3.nuxtjs.org/api/configuration/nuxt.config
const isDev = process.env.npm_lifecycle_event === 'dev' ? true : false;
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_DEV_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DEV_DOMAIN,
      FIREBASE_DATABASEURL: process.env.FIREBASE_DEV_DATABASEURL,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_DEV_ID,
      FIREBASE_STRAGE_BUCKET: process.env.FIREBASE_STRAGE_DEV_BUCKET,
      FIREBASE_MESSAGINGSENDERID: process.env.FIREBASE_DEV_MESSAGINGSENDERID,
      FIREBASE_APPID: process.env.FIREBASE_DEV_APPID,
      ADMIN_ID: process.env.DEV_ADMINID,
    },
  },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ],
    },
  },
  vite: {},
  modules: ['@nuxtjs/tailwindcss'],

  build: {
    transpile: isDev ? [] : ['element-plus'],
  },
  components: {
    // Failed to resolve component: di 対策
    // If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
    global: true,
    dirs: ['~/components'],
  },
});
