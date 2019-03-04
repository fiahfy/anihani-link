const app = require('../firebase')

const db = app.firestore()

const batchUpdate = async (members) => {
  const batch = db.batch()
  for (let member of members) {
    const { id, group: groupId, ...data } = member

    const group = groupId ? db.collection('groups').doc(groupId) : null

    const ref = db.collection('members').doc(id)
    batch.set(ref, {
      ...data,
      group
    })
  }
  return await batch.commit()
}

module.exports = {
  batchUpdate
}
