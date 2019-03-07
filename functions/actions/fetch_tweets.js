const models = require('../models')
const fetcher = require('../utils/fetcher')
const parser = require('../utils/parser')

const getSchedules = async (screenName) => {
  const timelines = await fetcher.fetchTimelines(screenName)
  console.log('fetched tweets: %s', timelines.length)
  if (!timelines.length) {
    return []
  }
  const schedules = timelines
    .map((timeline) => {
      const publishedAt = new Date(timeline.created_at)
      const schedules = parser.parseTweet(timeline.full_text)
      if (!schedules) {
        return false
      }
      return schedules.map((schedule) => {
        return {
          ...schedule,
          events: schedule.events.map((event) => {
            return {
              ...event,
              publishedAt
            }
          })
        }
      })
    })
    .filter((schedules) => Boolean(schedules))
    .reverse()
    .reduce((carry, schedules) => [...carry, ...schedules], [])
  console.log('got schedules: %s', schedules.length)
  return schedules
}

const updateSchedule = async (groupId, { date, events }, force) => {
  // 0:00:00 UTC+9
  const startedAt = new Date(date)
  startedAt.setHours(startedAt.getHours() + 6)
  const endedAt = new Date(startedAt)
  endedAt.setDate(endedAt.getDate() + 1)
  // update 6:00 UTC+9 -> 30:00 UTC+9
  console.log('updating schedule: %s -> %s', startedAt, endedAt)

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
    started_at_gte: startedAt,
    started_at_lt: endedAt
  })
  const deleted = exists.filter((event) => {
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
      owner: e.owner || null,
      title: e.title || null,
      description: e.description || null,
      url: e.url || null,
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
  for (let schedule of schedules) {
    await updateSchedule(groupId, schedule, force)
  }
}
