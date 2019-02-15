const serviceAccount = require('./key.json')
process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify(serviceAccount)

const config = require('./.runtimeconfig.json')
process.env.TWITTER_CONSUMER_KEY = config.twitter.consumer_key
process.env.TWITTER_CONSUMER_SECRET = config.twitter.consumer_secret
process.env.TWITTER_ACCESS_TOKEN_KEY = ''
process.env.TWITTER_ACCESS_TOKEN_SECRET = ''

const updateSchedules = require('./actions/update_schedules')
const updateGroups = require('./actions/update_groups')
const updateMembers = require('./actions/update_members')

;(async () => {
  try {
    const [, , command, ...options] = process.argv
    switch (command) {
      case 'groups':
        await updateGroups()
        break
      case 'members':
        await updateMembers()
        break
      case 'schedules': {
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
