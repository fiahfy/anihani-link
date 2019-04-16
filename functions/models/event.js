const app = require('../firebase')

const db = app.firestore()

const list = async ({ group, started_at_gte, started_at_lt }) => {
  let ref = db.collection('events')
  if (group) {
    ref = ref.where('group', '==', db.collection('groups').doc(group))
  }
  if (started_at_gte) {
    ref = ref.where('started_at', '>=', started_at_gte)
  }
  if (started_at_lt) {
    ref = ref.where('started_at', '<', started_at_lt)
  }
  const snapshot = await ref.get()
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
    const { group, owner, ...data } = event

    if (group !== undefined) {
      data.group = group ? db.collection('groups').doc(group) : null
    }
    if (owner !== undefined) {
      data.owner = owner ? db.collection('members').doc(owner) : null
    }

    const ref = db.collection('events').doc()
    batch.set(ref, data)
  }
  return await batch.commit()
}

const batchUpdate = async (events) => {
  const batch = db.batch()
  for (let event of events) {
    const { id, group, owner, ...data } = event

    if (group !== undefined) {
      data.group = group ? db.collection('groups').doc(group) : null
    }
    if (owner !== undefined) {
      data.owner = owner ? db.collection('members').doc(owner) : null
    }

    const ref = db.collection('events').doc(id)
    batch.update(ref, data)
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
