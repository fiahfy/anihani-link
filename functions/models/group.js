const app = require('../firebase')

const db = app.firestore()

const get = async (id) => {
  const doc = await db
    .collection('groups')
    .doc(id)
    .get()
  const group = doc.data()
  return {
    ...group,
    id: doc.id
  }
}

const batchUpdate = async (groups) => {
  const batch = db.batch()
  for (let group of groups) {
    const { id, ...data } = group

    const ref = db.collection('groups').doc(id)
    batch.set(ref, data)
  }
  return await batch.commit()
}

module.exports = {
  get,
  batchUpdate
}
