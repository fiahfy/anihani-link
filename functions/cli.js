const serviceAccount = require('./key.json')
process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify(serviceAccount)

const config = require('./.runtimeconfig.json')
process.env.TWITTER_CONSUMER_KEY = config.twitter.consumerKey
process.env.TWITTER_CONSUMER_SECRET = config.twitter.consumerSecret
process.env.TWITTER_ACCESS_TOKEN_KEY = ''
process.env.TWITTER_ACCESS_TOKEN_SECRET = ''

const updateSchedules = require('./actions/update_schedules')
const updateGroups = require('./actions/update_groups')
const updateMembers = require('./actions/update_members')

;(async () => {
  try {
    const [, , command, ...options] = process.argv
    switch (command) {
      case 'group':
        await updateGroups()
        break
      case 'member':
        await updateMembers()
        break
      case 'schedule': {
        const force = options.includes('--force')
        const groupId = options[options.indexOf('-g') + 1]
        await updateSchedules({ groupId, force })
        break
      }
      default:
        console.error('invalid command')
        break
    }
  } catch (e) {
    console.error(e)
  }
})()
