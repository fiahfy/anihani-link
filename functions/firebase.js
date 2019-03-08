const admin = require('firebase-admin')

const firebaseConfig = {}
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
if (serviceAccount) {
  firebaseConfig.credential = admin.credential.cert(JSON.parse(serviceAccount))
}
admin.initializeApp(firebaseConfig)

module.exports = admin
