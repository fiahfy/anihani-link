const { google } = require('googleapis')

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY
})

module.exports = async (params) => {
  const res = await youtube.videos.list(params)
  return res.data.items
}
