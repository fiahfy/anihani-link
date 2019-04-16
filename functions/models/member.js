const app = require('../firebase')

const db = app.firestore()

const batchReplace = async (members) => {
  const batch = db.batch()
  for (let member of members) {
    const { id, group, ...data } = member

    if (group !== undefined) {
      member.group = group ? db.collection('groups').doc(group) : null
    }

    const ref = db.collection('members').doc(id)
    batch.set(ref, data)
  }
  return await batch.commit()
}

module.exports = {
  batchReplace
}
