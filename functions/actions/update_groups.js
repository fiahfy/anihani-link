const initializeApp = require('../firebase')

const app = initializeApp()
const db = app.firestore()

const groups = {
  'animare': {
    'name': 'Animare',
    'name_ja': 'あにまーれ',
  },
  'honey-strap': {
    'name': 'Honey Strap',
    'name_ja': 'ハニーストラップ'
  },
}

module.exports = async () => {
  const batch = db.batch()
  for (let key of Object.keys(groups)) {
    const group = groups[key]
    const ref = db.collection('anihani-groups').doc(key)
    batch.set(ref, { ...group })
  }
  await batch.commit()
  console.log('updated rows: %s', Object.keys(groups).length)
}
