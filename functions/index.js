const functions = require('firebase-functions')

process.env.GOOGLE_API_KEY = functions.config().google.api_key
process.env.TWITTER_CONSUMER_KEY = functions.config().twitter.consumer_key
process.env.TWITTER_CONSUMER_SECRET = functions.config().twitter.consumer_secret
process.env.TWITTER_ACCESS_TOKEN_KEY = ''
process.env.TWITTER_ACCESS_TOKEN_SECRET = ''

const fetchTweets = require('./actions/fetch_tweets')
// const fetchWiki = require('./actions/fetch_wiki')
const updateEventUrls = require('./actions/update_event_urls')
const fetchEventDetails = require('./actions/fetch_event_details')

exports.fetchEvents = functions
  .region('asia-northeast1')
  .pubsub.topic('fetch-events')
  .onPublish(async () => {
    try {
      await fetchTweets()
      await updateEventUrls()
      await fetchEventDetails()
    } catch (e) {
      console.error(e)
    }
    return true
  })
