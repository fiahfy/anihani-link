const models = require('../models')
const fetcher = require('../utils/fetcher')
const jst = require('../utils/jst')

const extractYoutubeVideoId = (url) => {
  if (!url) {
    return null
  }
  const match = url.match(/\/\/youtu\.be\/(.+)/)
  if (!match) {
    return null
  }
  return match[1]
}

const getEventMap = async () => {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  const startedAt = jst.from(d)
  // const startedAt = jst.now()
  const events = await models.event.list({
    started_at_gte: startedAt
  })
  return events.reduce((carry, event) => {
    if (!event.owner) {
      return carry
    }
    return {
      ...carry,
      [event.owner.id]: [...(carry[event.owner.id] || []), event]
    }
  }, {})
}

const getVideoMap = async (ids) => {
  const videos = await fetcher.fetchYoutubeVideos({
    part: 'id,snippet',
    id: ids.join(',')
  })
  return videos.reduce((carry, video) => {
    return {
      ...carry,
      [video.id]: video
    }
  }, {})
}

const updateEvents = async (events, videos) => {
  console.log('update events')

  let updated = []
  for (let key of Object.keys(events)) {
    const event = events[key]
    const video = videos[key]
    if (!video) {
      return
    }
    updated = [
      ...updated,
      {
        ...event,
        group: event.group ? event.group.id : null,
        owner: event.owner ? event.owner.id : null,
        started_at: event.started_at.toDate(),
        published_at: event.published_at.toDate(),
        created_at: event.created_at.toDate(),
        updated_at: new Date(),
        title: video.snippet.title,
        description: video.snippet.description
      }
    ]
  }
  const results = await models.event.batchUpdate(updated)

  console.log('updated rows: %s', results.length)
}

module.exports = async () => {
  const r = await fetcher.fetchYoutubeSearch({
    part: 'id,snippet',
    channelId: 'UC0Owc36U9lOyi9Gx9Ic-4qg',
    order: 'date',
    eventType: 'upcoming',
    type: 'video',
    maxResults: 10
  })
  console.log(r)
  const s = await fetcher.fetchYoutubeVideos({
    part: 'id,snippet,liveStreamingDetails',
    id: 'p5_INljopV8'
  })
  console.log(s)
  return
  const events = await getEventMap()

  for (let [k, v] of Object.entries(events)) {
    console.log(k, v.length)
  }
  // const videos = await getVideoMap(Object.keys(events))
  // await updateEvents(events, videos)
}
