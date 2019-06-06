const app = require('../firebase')

const db = app.firestore()

const get = async (id) => {
  const doc = await db
    .collection('groups')
    .doc(id)
    .get()
  const data = doc.data()
  return {
    ...data,
    id: doc.id
  }
}

const batchReplace = async (groups) => {
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
  batchReplace
}
