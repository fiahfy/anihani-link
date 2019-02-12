const functions = require('firebase-functions')
const secureCompare = require('secure-compare')

process.env.TWITTER_CONSUMER_KEY = functions.config().twitter.consumer_key
process.env.TWITTER_CONSUMER_SECRET = functions.config().twitter.consumer_secret
process.env.TWITTER_ACCESS_TOKEN_KEY = ''
process.env.TWITTER_ACCESS_TOKEN_SECRET = ''

const updateSchedules = require('./actions/update_schedules')

exports.fetchTweets = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, resq) => {
    const key = req.query.key
    if (!secureCompare(key, functions.config().https.access_key)) {
      console.error('access key is not match: %s', key)
      resq.status(403).send('Forbidden')
      return
    }
    await updateSchedules({ groupId: 'animare' })
    await updateSchedules({ groupId: 'honey-strap' })
    resq.send('OK')
  })
