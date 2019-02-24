const Twitter = require('twitter')
const initializeApp = require('../firebase')

const app = initializeApp()
const db = app.firestore()

const Owner = {
  はねる: 'haneru-inaba',
  ひなこ: 'hinako-umori',
  いちか: 'ichika-soya',
  らん: 'ran-hinokuma',
  パトラ: 'patra-suo',
  シャル: 'charlotte-shimamura',
  エリ: 'eli-sogetsu',
  ミコ: 'mico-sekishiro',
  メアリ: 'mary-saionji'
}

const fetchCount = 20
const timezoneOffsetHours = -9

const getGroup = async (groupId) => {
  const snapshot = await db
    .collection('groups')
    .doc(groupId)
    .get()
  const group = snapshot.data()
  return group
}

const getDailyEvents = async (screenName) => {
  console.log('get daily events')
  const timelines = await fetchTimelines(screenName)
  if (!timelines.length) {
    console.log('got no daily events')
    return
  }
  const dailyEvents = extractDailyEvents(timelines)
  console.log('got daily events: %s', dailyEvents.length)
  return dailyEvents
}

const fetchTimelines = async (screenName) => {
  console.log('fetch tweets')
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  })
  let timelines = await client.get('statuses/user_timeline', {
    screen_name: screenName,
    tweet_mode: 'extended',
    count: fetchCount
  })
  if (!timelines) {
    return []
  }
  console.log('fetched tweets: %s', timelines.length)
  return timelines
}

const extractDailyEvents = (timelines) => {
  console.log('extract daily events')
  const dailyEvents = timelines
    .map(extractDailyEvent)
    .filter((event) => Boolean(event))
    .reverse()
    .reduce((previous, current) => [...previous, ...current], [])
  console.log('extracted daily events: %s', dailyEvents.length)
  return dailyEvents
}

const extractDailyEvent = (timeline) => {
  const publishedAt = new Date(timeline.created_at)
  let text = timeline.full_text
  let reg, match

  // reg = /配信スケジュール.*\n([\s\S]*)#(あにまーれ|ハニスト)/
  // match = reg.exec(text)
  // if (!match) {
  //   return false
  // }
  // ;[, text] = match

  reg = /追加/
  match = reg.exec(text)
  const append = !!match

  let matches = []
  let index = 0
  reg = /((\d+)\/(\d+)[(（].[）)])/g
  for (;;) {
    match = reg.exec(text)
    if (!match) {
      if (matches.length) {
        matches[matches.length - 1].text = text.slice(index)
      }
      break
    }

    if (matches.length) {
      matches[matches.length - 1].text = text.slice(index, match.index)
    }
    index = match.index

    const month = Number(match[2])
    const date = Number(match[3])

    const d = new Date()
    let year = d.getFullYear()
    if (d.getMonth() + 1 === 12 && month === 1) {
      year += 1 // next year
    }

    matches = [
      ...matches,
      {
        date: new Date(Date.UTC(year, month - 1, date, timezoneOffsetHours))
      }
    ]
  }
  if (!matches.length) {
    return false
  }

  return matches.map(({ date, text }) => {
    // eslint-disable-next-line no-irregular-whitespace
    const reg = /([^\s　]+)[\s　]+(\d+):(\d+)-(?:[\s　]*[(（](.+)[）)])?(?:\n(＊[^\n\s]+))?/g
    let events = []
    for (;;) {
      const match = reg.exec(text)
      if (!match) {
        break
      }

      const member = match[1]
      const hour = Number(match[2])
      const minute = Number(match[3])

      const ownerId = Owner[member] || null
      const title = member
      let description = match[4] || null
      if (description) {
        description += match[5] || ''
      }
      const startedAt = new Date(date)
      startedAt.setHours(startedAt.getHours() + hour)
      startedAt.setMinutes(startedAt.getMinutes() + minute)

      events = [
        ...events,
        {
          ownerId,
          title,
          description,
          startedAt,
          publishedAt
        }
      ]
    }
    return {
      date,
      append,
      events
    }
  })
}

const updateDailyEvent = async (groupId, { date, append, events }, force) => {
  // 6:00 -> 30:00 (JST)
  const t = new Date(date)
  t.setHours(t.getHours() + 6)
  const m = new Date(t)
  m.setDate(m.getDate() + 1)
  console.log('update daily event: %s -> %s', t, m)

  const uniqueIds = force
    ? {}
    : events.reduce((carry, e) => {
        const uid = getUniqueId(e)
        return {
          ...carry,
          [uid]: false
        }
      }, {})

  let deletedRows = 0
  let addedRows = 0
  let updatedRows = 0
  const batch = db.batch()

  const snapshot = await db
    .collection('events')
    .where('group', '==', db.collection('groups').doc(groupId))
    .where('started_at', '>=', t)
    .where('started_at', '<', m)
    .get()
  snapshot.docs.forEach((doc) => {
    if (append) {
      return
    }
    const uid = getUniqueIdWithDoc(doc)
    if (uniqueIds[uid] === false) {
      uniqueIds[uid] = doc.id
      return
    }
    batch.delete(doc.ref)
    deletedRows++
  })

  for (let e of events) {
    let ref = db.collection('events').doc()
    const uid = getUniqueId(e)
    const id = uniqueIds[uid]
    if (id) {
      ref = db.collection('events').doc(id)
      updatedRows++
    } else {
      addedRows++
    }
    batch.set(ref, {
      owner: e.ownerId ? db.collection('members').doc(e.ownerId) : null,
      group: db.collection('groups').doc(groupId),
      title: e.title,
      description: e.description,
      started_at: e.startedAt,
      published_at: e.publishedAt,
      created_at: new Date(),
      updated_at: new Date()
    })
  }
  await batch.commit()
  console.log(
    'deleted rows: %s, added rows: %s, updated rows: %s',
    deletedRows,
    addedRows,
    updatedRows
  )
  console.log('updated daily event')
}

const getUniqueId = (event) => {
  const ownerId = event.ownerId || ''
  return ownerId + event.startedAt.getTime()
}

const getUniqueIdWithDoc = (doc) => {
  const data = doc.data()
  const ownerId = data.owner ? data.owner.id : ''
  return ownerId + data.started_at.toDate().getTime()
}

module.exports = async ({ groupId, force }) => {
  console.log('fetch tweets for group: %s', groupId)

  if (!groupId) {
    console.log('group id not specified')
    return
  }

  const group = await getGroup(groupId)
  if (!group) {
    console.log('group not found: %s', groupId)
    return
  }

  const dailyEvents = await getDailyEvents(group.twitter.screen_name)
  if (!dailyEvents.length) {
    return
  }

  for (let dailyEvent of dailyEvents) {
    await updateDailyEvent(groupId, dailyEvent, force)
  }
}
