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
    started_at_gte: startedAt,
    fetched: false
  })
  console.log(
    'selected events: started_at=%s, size=%s',
    startedAt,
    events.length
  )
  const map = events.reduce((carry, event) => {
    const videoId = extractYoutubeVideoId(event.url)
    if (!videoId) {
      return carry
    }
    return {
      ...carry,
      [videoId]: event
    }
  }, {})
  console.log('filtered events: size=%s', Object.keys(map).length)
  return map
}

const getVideoMap = async (ids) => {
  const videos = await fetcher.fetchYoutubeVideos({
    part: 'id,snippet',
    id: ids.join(',')
  })
  console.log('fetched videos: id_size=%s', videos.length)
  return videos.reduce((carry, video) => {
    return {
      ...carry,
      [video.id]: video
    }
  }, {})
}

const updateEvents = async (events, videos) => {
  console.log('updating events')

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
        description: video.snippet.description,
        fetched: true
      }
    ]
  }
  const results = await models.event.batchUpdate(updated)

  console.log('updated events: size=%s', results.length)
}

module.exports = async () => {
  console.log('starting fetch event details')

  const events = await getEventMap()
  const videos = await getVideoMap(Object.keys(events))
  await updateEvents(events, videos)

  console.log('finished fetch event details')
}
