import { defineNuxtPlugin } from 'nuxt/app';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: config.FIREBASE_AUTH_DOMAIN,
    databaseURL: config.FIREBASE_DATABASEURL,
    projectId: config.FIREBASE_PROJECT_ID,
    storageBucket: config.FIREBASE_STRAGE_BUCKET,
    messagingSenderId: config.FIREBASE_MESSAGINGSENDERID,
    appId: config.FIREBASE_APPID,
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app); // インスタンスプロパティの生成($マークをつけて使用) https://jp.vuejs.org/v2/cookbook/adding-instance-properties.html
  const strage = getStorage();
  return {
    provide: {
      db: db,
      strage: strage,
    },
  };
});
