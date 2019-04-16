const models = require('../models')
const members = require('../data/members.json')

module.exports = async () => {
  const items = Object.keys(members).map((id) => {
    return {
      ...members[id],
      id
    }
  })
  const results = await models.member.batchReplace(items)
  console.log('updated rows: %s', results.length)
}
