import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'

const firebasePlugin = {
  install() {
    const app = firebase.initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      // authDomain: process.env.AUTH_DOMAIN,
      // databaseURL: process.env.DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID
      // storageBucket: process.env.STORAGE_BUCKET
    })
    Vue.prototype.$db = app.firestore()
  }
}

Vue.use(firebasePlugin)

export default async (ctx) => {
  const { app, store } = ctx

  ctx.$db = app.$db = store.$db = Vue.prototype.$db
}
