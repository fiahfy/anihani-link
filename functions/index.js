const functions = require('firebase-functions')

process.env.GOOGLE_API_KEY = functions.config().google.api_key
process.env.TWITTER_CONSUMER_KEY = functions.config().twitter.consumer_key
process.env.TWITTER_CONSUMER_SECRET = functions.config().twitter.consumer_secret
process.env.TWITTER_ACCESS_TOKEN_KEY = ''
process.env.TWITTER_ACCESS_TOKEN_SECRET = ''

const fetchTweets = require('./actions/fetch_tweets')
const fetchEventDetails = require('./actions/fetch_event_details')
const jst = require('./utils/jst')

exports.fetchEvents = functions
  .region('asia-northeast1')
  .pubsub.topic('fetch-events')
  .onPublish(async () => {
    try {
      await fetchTweets()
      const m = jst.now().getMinutes()
      if (m >= 0 && m < 10) {
        await fetchEventDetails()
      }
    } catch (e) {
      console.error(e)
    }
    return true
  })
