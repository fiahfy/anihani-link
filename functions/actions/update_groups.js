const models = require('../models')
const groups = require('../data/groups.json')

module.exports = async () => {
  const items = Object.keys(groups).map((id) => {
    return {
      ...groups[id],
      id
    }
  })
  const results = await models.group.batchReplace(items)
  console.log('updated rows: %s', results.length)
}
