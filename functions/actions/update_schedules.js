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

const timezoneOffsetHours = -9
const fetchCount = 20

const getGroup = async (groupId) => {
  const snapshot = await db
    .collection('groups')
    .doc(groupId)
    .get()
  const group = snapshot.data()
  return group
}

const getLatestId = async (twitterId) => {
  const snapshot = await db
    .collection('tweets')
    .where('user.id_str', '==', twitterId)
    .orderBy('id', 'desc')
    .limit(1)
    .get()
  const tweet = snapshot.docs.map((doc) => doc.data())[0] || {}
  return tweet.id
}

const addTweet = async (tweet) => {
  console.log('add tweet')
  await db.collection('tweets').add(tweet)
  console.log('added tweet')
}

const deleteTweets = async (twitterId) => {
  console.log('delete all tweets')
  const batch = db.batch()
  const snapshot = await db
    .collection('tweets')
    .where('user.id_str', '==', twitterId)
    .get()
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })
  await batch.commit()
  console.log('deleted rows: %s', snapshot.size)
}

const updateDailySchedules = async (groupId, { date, append, schedules }) => {
  // 6:00 -> 30:00 (JST)
  const t = new Date(date)
  t.setHours(t.getHours() + 6)
  const m = new Date(t)
  m.setDate(m.getDate() + 1)
  console.log('update daily schedules: %s -> %s', t, m)

  let deletedRows = 0
  const batch = db.batch()
  if (!append) {
    console.log('delete schedules')
    const snapshot = await db
      .collection('schedules')
      .where('group', '==', db.collection('groups').doc(groupId))
      .where('started_at', '>=', t)
      .where('started_at', '<', m)
      .get()
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    deletedRows = snapshot.size
  }

  for (let s of schedules) {
    const ref = db.collection('schedules').doc()
    batch.set(ref, {
      owner: s.ownerId ? db.collection('members').doc(s.ownerId) : null,
      group: db.collection('groups').doc(groupId),
      title: s.title,
      description: s.description,
      started_at: s.startedAt,
      published_at: s.publishedAt,
      created_at: new Date(),
      updated_at: new Date()
    })
  }
  await batch.commit()
  if (deletedRows) {
    console.log('deleted rows: %s', deletedRows)
  }
  console.log('added rows: %s', schedules.length)
  console.log('updated daily schedules')
}

const fetchTimelines = async (screenName, sinceId) => {
  console.log('fetch tweets since: %s', sinceId)
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  })
  let timelines = await client.get('statuses/user_timeline', {
    screen_name: screenName,
    tweet_mode: 'extended',
    count: fetchCount,
    since_id: sinceId
  })
  if (!timelines) {
    return []
  }
  // exclude tweet has since id
  timelines = timelines.filter((timeline) => timeline.id !== sinceId)
  console.log('fetched tweets: %s', timelines.length)
  return timelines
}

const extractDailySchedules = (timelines) => {
  console.log('extracted daily schedules')
  const dailySchedules = timelines
    .map(extractDailySchedule)
    .filter((schedule) => Boolean(schedule))
    .reverse()
    .reduce((previous, current) => [...previous, ...current], [])
  console.log('extracted daily schedules: %s', dailySchedules.length)
  return dailySchedules
}

const extractDailySchedule = (timeline) => {
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
    let schedules = []
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

      schedules = [
        ...schedules,
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
      schedules
    }
  })
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

  if (force) {
    await deleteTweets(group.twitter.id_str)
  }

  const sinceId = await getLatestId(group.twitter.id_str)

  const timelines = await fetchTimelines(group.twitter.screen_name, sinceId)
  if (!timelines.length) {
    return
  }
  const latestTimeline = timelines[0]

  const dailySchedules = extractDailySchedules(timelines)
  if (!dailySchedules.length) {
    await addTweet(latestTimeline)
    return
  }

  for (let dailySchedule of dailySchedules) {
    await updateDailySchedules(groupId, dailySchedule)
  }

  await addTweet(latestTimeline)
}
