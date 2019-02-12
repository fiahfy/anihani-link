const admin = require('firebase-admin')

let app

module.exports = () => {
  if (app) {
    return app
  }

  const firebaseConfig = {}
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  if (serviceAccount) {
    firebaseConfig.credential = admin.credential.cert(
      JSON.parse(serviceAccount)
    )
  }
  admin.initializeApp(firebaseConfig)

  app = admin

  return admin
}
