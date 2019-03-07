const app = require('../firebase')

const db = app.firestore()

const list = async ({ group, started_at_gte, started_at_lt }) => {
  const snapshot = await db
    .collection('events')
    .where('group', '==', db.collection('groups').doc(group))
    .where('started_at', '>=', started_at_gte)
    .where('started_at', '<', started_at_lt)
    .get()
  const events = snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      ...data,
      id: doc.id
    }
  })
  return events
}

const batchCreate = async (events) => {
  const batch = db.batch()
  for (let event of events) {
    const { group: groupId, owner: ownerId, ...data } = event

    const group = groupId ? db.collection('groups').doc(groupId) : null
    const owner = ownerId ? db.collection('members').doc(ownerId) : null

    const ref = db.collection('events').doc()
    batch.set(ref, {
      ...data,
      group,
      owner
    })
  }
  return await batch.commit()
}

const batchUpdate = async (events) => {
  const batch = db.batch()
  for (let event of events) {
    const { id, group: groupId, owner: ownerId, ...data } = event

    const group = groupId ? db.collection('groups').doc(groupId) : null
    const owner = ownerId ? db.collection('members').doc(ownerId) : null

    const ref = db.collection('events').doc(id)
    batch.set(ref, {
      ...data,
      group,
      owner
    })
  }
  return await batch.commit()
}

const batchDelete = async (events) => {
  const batch = db.batch()
  for (let event of events) {
    const { id } = event

    const ref = db.collection('events').doc(id)
    batch.delete(ref)
  }
  return await batch.commit()
}

module.exports = {
  list,
  batchCreate,
  batchUpdate,
  batchDelete
}
