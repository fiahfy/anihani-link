const Twitter = require('twitter')
const models = require('../models')

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

const getSchedules = async (screenName) => {
  console.log('get schedules')
  const timelines = await fetchTimelines(screenName)
  if (!timelines.length) {
    console.log('got no schedules')
    return
  }
  const schedules = extractSchedules(timelines)
  console.log('got schedules: %s', schedules.length)
  return schedules
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

const extractSchedules = (timelines) => {
  console.log('extract schedules')
  const schedules = timelines
    .map(extractSchedule)
    .filter((schedule) => Boolean(schedule))
    .reverse()
    .reduce((previous, current) => [...previous, ...current], [])
  console.log('extracted schedules: %s', schedules.length)
  return schedules
}

const extractSchedule = (timeline) => {
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
    const reg = /([^\s　]+)[\s　]+(\d+):(\d+)-?(?:[\s　]*[(（](.+)[）)])?(?:\n(＊[^\n\s]+))?/g
    let events = []
    for (;;) {
      const match = reg.exec(text)
      if (!match) {
        break
      }

      const member = match[1]
      const hour = Number(match[2])
      const minute = Number(match[3])

      const owner = Owner[member] || null
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
          owner,
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

const updateSchedule = async (groupId, { date, append, events }, force) => {
  // 6:00 -> 30:00 (JST)
  const t = new Date(date)
  t.setHours(t.getHours() + 6)
  const m = new Date(t)
  m.setDate(m.getDate() + 1)
  console.log('update schedule: %s -> %s', t, m)

  const eventIds = force
    ? {}
    : events.reduce((carry, event) => {
        const uid = getUniqueId(event)
        return {
          ...carry,
          [uid]: false
        }
      }, {})

  const exists = await models.event.list({
    group: groupId,
    started_at_gte: t,
    started_at_lt: m
  })
  const deleted = exists.filter((event) => {
    if (append && !force) {
      return false
    }
    const uid = getUniqueIdWithDoc(event)
    if (eventIds[uid] === false) {
      eventIds[uid] = event.id
      return false
    }
    return true
  })

  let created = []
  let updated = []
  for (let e of events) {
    const event = {
      group: groupId,
      owner: e.owner,
      title: e.title,
      description: e.description,
      started_at: e.startedAt,
      published_at: e.publishedAt,
      created_at: new Date(),
      updated_at: new Date()
    }
    const uid = getUniqueId(e)
    const id = eventIds[uid]
    if (id) {
      updated = [
        ...updated,
        {
          ...event,
          id
        }
      ]
    } else {
      created = [...created, event]
    }
  }

  const deletedResults = await models.event.batchDelete(deleted)
  const createdResults = await models.event.batchCreate(created)
  const updatedResults = await models.event.batchUpdate(updated)

  console.log(
    'deleted rows: %s, added rows: %s, updated rows: %s',
    deletedResults.length,
    createdResults.length,
    updatedResults.length
  )
  console.log('updated schedule')
}

const getUniqueId = (event) => {
  const ownerId = event.owner || ''
  return ownerId + event.startedAt.getTime()
}

const getUniqueIdWithDoc = (event) => {
  const ownerId = event.owner ? event.owner.id : ''
  return ownerId + event.started_at.toDate().getTime()
}

module.exports = async ({ groupId, force }) => {
  console.log('fetch tweets for group: %s', groupId)

  if (!groupId) {
    console.log('group id not specified')
    return
  }

  const group = await models.group.get(groupId)
  if (!group) {
    console.log('group not found: %s', groupId)
    return
  }

  const schedules = await getSchedules(group.twitter.screen_name)
  if (!schedules.length) {
    return
  }

  for (let schedule of schedules) {
    await updateSchedule(groupId, schedule, force)
  }
}
