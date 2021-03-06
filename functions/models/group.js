const app = require('../firebase')

const db = app.firestore()

const get = async (id) => {
  const doc = await db
    .collection('groups')
    .doc(id)
    .get()
  if (!doc.exists) {
    return null
  }
  return {
    ...doc.data(),
    id: doc.id
  }
}

const list = async () => {
  const snapshot = await db.collection('groups').get()
  return snapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id
    }
  })
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
  list,
  batchReplace
}
