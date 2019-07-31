const models = require('../models')
const fetcher = require('../utils/fetcher')
const jst = require('../utils/jst')

const buildYoutubeVideoUrl = (videoId) => {
  return `https://www.youtube.com/watch?v=${videoId}`
}

const getMemberEventsMap = async () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const startedAt = jst.from(d)
  // const startedAt = jst.now()
  const events = await models.event.list({
    started_at_gte: startedAt
  })
  console.log(
    'selected events: started_at=%s, size=%s',
    startedAt,
    events.length
  )
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

const getVideoMap = async (channelId) => {
  const results = await fetcher.fetchYoutubeSearch({
    part: 'id',
    channelId,
    order: 'date',
    // eventType: 'upcoming',
    type: 'video',
    maxResults: 5
  })
  console.log('search videos: results=%s', results.length)
  const videoIds = results.map((result) => result.id.videoId)
  const videos = await fetcher.fetchYoutubeVideos({
    part: 'id,snippet,liveStreamingDetails',
    id: videoIds.join(',')
  })
  console.log('fetched videos: results=%s', videos.length)
  return videos.reduce((carry, video) => {
    const { liveStreamingDetails } = video
    if (!liveStreamingDetails) {
      return carry
    }
    const date = new Date(liveStreamingDetails.scheduledStartTime)
    const timestamp = date.getTime()
    return {
      ...carry,
      [timestamp]: video
    }
  }, {})
}

const updateEvents = async (events, videos) => {
  console.log('updating events')

  let updated = []
  for (let event of events) {
    const timestamp = event.started_at.toDate().getTime()
    const video = videos[timestamp]
    if (!video) {
      continue
    }
    const url = buildYoutubeVideoUrl(video.id)
    updated = [
      ...updated,
      {
        id: event.id,
        title: video.snippet.title,
        description: video.snippet.description,
        url,
        updated_at: new Date()
      }
    ]
  }
  const results = await models.event.batchUpdate(updated)

  console.log('updated events: results=%s', results.length)
}

module.exports = async () => {
  console.log('starting fetch event details')

  const memberEvents = await getMemberEventsMap()

  for (let [memberId, events] of Object.entries(memberEvents)) {
    console.log('starting member: member_id=%s', memberId)
    const member = await models.member.get(memberId)
    if (!member) {
      console.log('member not found: member_id=%s', memberId)
      continue
    }
    const videos = await getVideoMap(member.youtube.channel_id)
    await updateEvents(events, videos)
  }

  console.log('finished fetch event details')
}
