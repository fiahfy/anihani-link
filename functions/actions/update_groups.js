const initializeApp = require('../firebase')
const groups = require('../data/groups.json')

const app = initializeApp()
const db = app.firestore()

module.exports = async () => {
  const batch = db.batch()
  for (let key of Object.keys(groups)) {
    const group = groups[key]
    const ref = db.collection('groups').doc(key)
    batch.set(ref, { ...group })
  }
  await batch.commit()
  console.log('updated rows: %s', Object.keys(groups).length)
}
