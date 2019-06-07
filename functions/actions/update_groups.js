const models = require('../models')
const groups = require('../data/groups.json')

module.exports = async () => {
  console.log('starting update groups')

  const items = Object.keys(groups).map((id) => {
    return {
      ...groups[id],
      id
    }
  })
  const results = await models.group.batchReplace(items)

  console.log('finished update groups: size=%s', results.length)
}
