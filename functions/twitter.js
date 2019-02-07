const Twitter = require('twitter')
const fs = require('fs')

require('dotenv').config()

;(async () => {
    try {
        console.log(process.env)

        const client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        })
        const results = await client.get('statuses/user_timeline', { screen_name: 'hnst_official' })
        console.log(results.length)
        fs.writeFileSync('./timeline.json', JSON.stringify(results));
    } catch (e) {
        console.error(e)
    }
})()
