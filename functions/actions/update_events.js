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
  d.setDate(d.getDate() - 1)
  const startedAt = jst.from(d)
  // const startedAt = jst.now()
  const events = await models.event.list({
    started_at_gte: startedAt
  })
  return events.reduce((carry, event) => {
    const videoId = extractYoutubeVideoId(event.url)
    if (!videoId) {
      return carry
    }
    return {
      ...carry,
      [videoId]: event
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
  for (let [videoId, event] of Object.entries(events)) {
    const video = videos[videoId]
    if (!video) {
      return
    }
    updated = [
      ...updated,
      {
        id: event.id,
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
  const events = await getEventMap()
  const videos = await getVideoMap(Object.keys(events))
  await updateEvents(events, videos)
}
