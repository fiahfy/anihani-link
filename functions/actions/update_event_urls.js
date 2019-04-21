const models = require('../models')
const fetcher = require('../utils/fetcher')
const jst = require('../utils/jst')

const buildYoutubeVideoUrl = (videoId) => {
  return `https://youtu.be/${videoId}`
}

const getMemberEventsMap = async () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
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

const getVideoIdMap = async (channelId) => {
  const results = await fetcher.fetchYoutubeSearch({
    part: 'id',
    channelId,
    order: 'date',
    // eventType: 'upcoming',
    type: 'video',
    maxResults: 20
  })
  const videoIds = results.map((result) => result.id.videoId)
  if (!videoIds) {
    return {}
  }
  const videos = await fetcher.fetchYoutubeVideos({
    part: 'id,liveStreamingDetails',
    id: videoIds.join(',')
  })
  return videos.reduce((carry, video) => {
    const { id, liveStreamingDetails } = video
    if (!liveStreamingDetails) {
      return carry
    }
    const date = new Date(liveStreamingDetails.scheduledStartTime)
    const timestamp = date.getTime()
    return {
      ...carry,
      [timestamp]: id
    }
  }, {})
}

const updateEvents = async (events, videoIds) => {
  console.log('update events')

  let updated = []
  for (let event of events) {
    const timestamp = event.started_at.toDate().getTime()
    const videoId = videoIds[timestamp]
    if (!videoId) {
      break
    }
    const url = buildYoutubeVideoUrl(videoId)
    updated = [
      ...updated,
      {
        id: event.id,
        url
      }
    ]
  }
  const results = await models.event.batchUpdate(updated)

  console.log('updated rows: %s', results.length)
}

module.exports = async () => {
  const memberEvents = await getMemberEventsMap()

  for (let [memberId, events] of Object.entries(memberEvents)) {
    const member = await models.member.get(memberId)
    const videoIds = await getVideoIdMap(member.youtube.channel_id)
    await updateEvents(events, videoIds)
  }
}
