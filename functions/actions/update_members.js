const initializeApp = require('../firebase')
const members = require('../data/members.json')

const app = initializeApp()
const db = app.firestore()

module.exports = async () => {
  const batch = db.batch()
  for (let key of Object.keys(members)) {
    const member = members[key]
    const ref = db.collection('anihani-members').doc(key)
    batch.set(ref, {
      ...member,
      group: db.collection('anihani-groups').doc(member.group)
    })
  }
  await batch.commit()
  console.log('updated rows: %s', Object.keys(members).length)
}
