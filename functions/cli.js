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
const updateEvents = require('./actions/update_events')
const updateEventUrls = require('./actions/update_event_urls')
const fetchTweets = require('./actions/fetch_tweets')
const fetchWiki = require('./actions/fetch_wiki')

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
          case 'events':
            await updateEvents()
            break
          case 'event-urls':
            await updateEventUrls()
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
            const groupId = options[options.indexOf('-g') + 1]
            await fetchTweets({ groupId, force })
            break
          }
          case 'wiki': {
            const force = options.includes('--force')
            const groupId = options[options.indexOf('-g') + 1]
            await fetchWiki({ groupId, force })
            break
          }
          case 'all': {
            const force = options.includes('--force')
            await fetchWiki({ groupId: 'ani-mare', force })
            await fetchTweets({ groupId: 'honey-strap', force })
            break
          }
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
