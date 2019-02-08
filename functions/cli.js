const serviceAccount = require('./key.json')
process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify(serviceAccount)

const config = require('./.runtimeconfig.json')
process.env.TWITTER_CONSUMER_KEY = config.twitter.consumerKey
process.env.TWITTER_CONSUMER_SECRET = config.twitter.consumerSecret
process.env.TWITTER_ACCESS_TOKEN_KEY = ''
process.env.TWITTER_ACCESS_TOKEN_SECRET = ''

const fetchTweetsHandler = require('./handlers/fetch_tweets')

;(async () => {
  try {
    await fetchTweetsHandler()
  } catch (e) {
    console.error(e)
  }
})()
