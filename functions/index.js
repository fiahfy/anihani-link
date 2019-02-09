const functions = require('firebase-functions')

process.env.TWITTER_CONSUMER_KEY = functions.config().twitter.consumerKey
process.env.TWITTER_CONSUMER_SECRET = functions.config().twitter.consumerSecret
process.env.TWITTER_ACCESS_TOKEN_KEY = ''
process.env.TWITTER_ACCESS_TOKEN_SECRET = ''

const updateSchedules = require('./actions/update_schedules')

exports.fetchTweets = functions.https.onRequest(async () => {
  await updateSchedules()
})
