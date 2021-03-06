const serviceAccount = require('./key.json')
process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify(serviceAccount)

const config = require('./.runtimeconfig.json')
process.env.GOOGLE_API_KEY = config.google.api_key
process.env.TWITTER_CONSUMER_KEY = config.twitter.consumer_key
process.env.TWITTER_CONSUMER_SECRET = config.twitter.consumer_secret
process.env.TWITTER_ACCESS_TOKEN_KEY = ''
process.env.TWITTER_ACCESS_TOKEN_SECRET = ''

const updateGroups = require('./actions/update_groups')
const updateMembers = require('./actions/update_members')
const fetchTweets = require('./actions/fetch_tweets')
const fetchWiki = require('./actions/fetch_wiki')
const fetchEventDetails = require('./actions/fetch_event_details')

;(async () => {
  try {
    const [, , command, target, ...options] = process.argv
    switch (command) {
      case 'update':
        switch (target) {
          case 'groups':
            await updateGroups()
            break
          case 'members':
            await updateMembers()
            break
          default:
            console.error('invalid target')
            break
        }
        break
      case 'fetch':
        switch (target) {
          case 'tweets': {
            const force = options.includes('--force')
            const groupId = options.includes('-g')
              ? options[options.indexOf('-g') + 1]
              : null
            await fetchTweets({ groupId, force })
            break
          }
          case 'wiki': {
            const force = options.includes('--force')
            const groupId = options[options.indexOf('-g') + 1]
            await fetchWiki({ groupId, force })
            break
          }
          case 'event-details':
            await fetchEventDetails()
            break
          default:
            console.error('invalid target')
            break
        }
        break
      default:
        console.error('invalid command')
        break
    }
  } catch (e) {
    console.error(e)
  }
})()
