const functions = require('firebase-functions')

process.env.TWITTER_CONSUMER_KEY = functions.config().twitter.consumer_key
process.env.TWITTER_CONSUMER_SECRET = functions.config().twitter.consumer_secret
process.env.TWITTER_ACCESS_TOKEN_KEY = ''
process.env.TWITTER_ACCESS_TOKEN_SECRET = ''

const updateSchedules = require('./actions/update_schedules')

exports.fetchTweets = functions
  .region('asia-northeast1')
  .pubsub.topic('fetch-tweets')
  .onPublish(async () => {
    try {
      await updateSchedules({ groupId: 'ani-mare' })
      await updateSchedules({ groupId: 'honey-strap' })
    } catch (e) {
      console.error(e)
    }
    return true
  })
