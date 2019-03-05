const Twitter = require('twitter')

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

const fetchTimelines = async (screenName) => {
  return await client.get('statuses/user_timeline', {
    screen_name: screenName,
    tweet_mode: 'extended',
    count: 20
  })
}

module.exports = {
  fetchTimelines
}
