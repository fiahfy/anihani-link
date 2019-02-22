import firebase from 'firebase/app'
import 'firebase/firestore'

export default async ({ store }, inject) => {
  const app = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    // authDomain: process.env.AUTH_DOMAIN,
    // databaseURL: process.env.DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID
    // storageBucket: process.env.STORAGE_BUCKET
  })

  inject('db', app.firestore())

  await store.dispatch('group/fetchGroups')
  await store.dispatch('member/fetchMembers')
}
