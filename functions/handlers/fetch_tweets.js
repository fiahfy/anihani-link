const fs = require('fs')
const admin = require('firebase-admin')
const Twitter = require('twitter')
const Member = require('../constants/member')

const firebaseConfig = {}
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
if (serviceAccount) {
  firebaseConfig.credential = admin.credential.cert(JSON.parse(serviceAccount))
}
admin.initializeApp(firebaseConfig)

const db = admin.firestore()

const TwitterAccount = {
    Animare: {
      id: ''
    },
    HoneyStrap: {
      id: '1007247110167674900'
    }
}

const fetchLatestId = async () => {
  const snapshot = await db.collection('anihani-tweets')
      .where('user.id', '==', TwitterAccount.HoneyStrap.id)
      .orderBy('id', 'desc')
      .limit(1)
      .get();
  const tweet = snapshot.docs.map((doc) => doc.data())[0] || {}
  return tweet.id
}

const fetchTimelines = async (sinceId) => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  })
  // const timelines = await client.get('statuses/user_timeline', { screen_name: 'hnst_official', tweet_mode: 'extended', since_id: sinceId })
  // fs.writeFileSync('./timeline_full.json', JSON.stringify(timelines));
  const timelines = require('../timeline_full.json')
  return timelines
}

const extractTweet = (timeline) => {
  const text = timeline.full_text
  if (!text.match(/配信スケジュール[\s\S]*#ハニスト/)) {
    return false
  }
  return true
}

module.exports = async () => {
  const sinceId = await fetchLatestId()
  console.log('since: %s', sinceId)
  const timelines = await fetchTimelines(sinceId)
  console.log('fetch tweets: %s', timelines.length)
  const tweets = timelines.map(extractTweet).filter((tweet) => Boolean(tweet))
  console.log('extract tweets: %s', tweets.length)
  if (!tweets.length) {
    return
  }
  console.log(tweets)

  // await db.collection('anihani-').add({original: original});
}


const ss = {
  "schedules": {
    "xxx": {
      "host": Member.Haneru,
      "title": "",
      "description": "",
      "started_at": "",
      "ended_at": "",
      "published_at": "",
      "created_at": "",
      "updated_at": ""
    }
  },
  "tweets": {
    "xxx": {
      "host": Member.Haneru,
      "title": "",
      "description": "",
      "started_at": "",
      "ended_at": "",
      "published_at": "",
      "created_at": "",
      "updated_at": ""
    }
  }
}
