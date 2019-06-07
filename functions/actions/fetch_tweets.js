const models = require('../models')
const fetcher = require('../utils/fetcher')
const parser = require('../utils/parser')

const parseTimelines = async (timelines) => {
  return timelines
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
}

const updateEvents = async (events, groupId, date, force) => {
  console.log(
    'updating events: group_id=%s, date=%s, force=%s',
    groupId,
    date,
    force
  )
  // 0:00:00 UTC+9
  const startedAt = new Date(date)
  startedAt.setHours(startedAt.getHours() + 6)
  const endedAt = new Date(startedAt)
  endedAt.setDate(endedAt.getDate() + 1)
  // update 6:00 UTC+9 -> 30:00 UTC+9
  console.log('date span: started_at=%s, ended_at=%s', startedAt, endedAt)

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
      group_id: groupId,
      owner_id: e.ownerId,
      title: e.title,
      started_at: e.startedAt,
      published_at: e.publishedAt,
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
      created = [
        ...created,
        {
          ...event,
          created_at: new Date()
        }
      ]
    }
  }

  const deletedResults = await models.event.batchDelete(deleted)
  const createdResults = await models.event.batchCreate(created)
  const updatedResults = await models.event.batchUpdate(updated)

  console.log(
    'updated events: creates=%s, updates=%s, deletes=%s',
    createdResults.length,
    updatedResults.length,
    deletedResults.length
  )
}

const getUniqueId = (event) => {
  const ownerId = event.ownerId || ''
  return ownerId + event.startedAt.getTime()
}

const getUniqueIdWithDoc = (event) => {
  const ownerId = event.owner ? event.owner.id : ''
  return ownerId + event.started_at.toDate().getTime()
}

module.exports = async ({ groupId, force } = {}) => {
  console.log('starting fetch tweets: group_id=%s, force=%s', groupId, force)

  let groups = []
  if (groupId) {
    const group = await models.group.get(groupId)
    if (!group) {
      console.log('group not found: group_id=%s', groupId)
      return
    }
    groups = [group]
  } else {
    groups = await models.group.list()
  }

  for (let group of groups) {
    console.log('starting group: group_id=%s', group.id)
    const timelines = await fetcher.fetchTimelines(group.twitter.screen_name)
    console.log(
      'fetched timelines: screen_name=%s, results=%s',
      group.twitter.screen_name,
      timelines.length
    )
    const schedules = await parseTimelines(timelines)
    console.log('parsed schedules: results=%s', schedules.length)
    for (let { date, events } of schedules) {
      await updateEvents(events, group.id, date, force)
    }
  }

  console.log('finished fetch tweets')
}
