const models = require('../models')
const members = require('../data/members.json')

module.exports = async () => {
  console.log('starting update members')

  const items = Object.keys(members).map((id) => {
    return {
      ...members[id],
      id
    }
  })
  const results = await models.member.batchReplace(items)

  console.log('finished update members: size=%s', results.length)
}
