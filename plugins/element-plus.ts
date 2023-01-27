import { defineNuxtPlugin } from 'nuxt/app';
import ElementPlus from 'element-plus/dist/index.full';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus);
});
