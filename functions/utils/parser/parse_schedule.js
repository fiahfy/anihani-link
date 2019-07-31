const { parse } = require('node-html-parser')
const jst = require('../jst')

const Owner = {
  因幡はねる: 'haneru-inaba',
  宇森ひなこ: 'hinako-umori',
  宗谷いちか: 'ichika-soya',
  日ノ隈らん: 'ran-hinokuma'
}

const extractPublishedAt = (node) => {
  const title = node.querySelector('#title')
  if (!title) {
    return null
  }

  const text =
    title.childNodes[3] &&
    title.childNodes[3].childNodes[0] &&
    title.childNodes[3].childNodes[0].rawText
  if (!text) {
    return null
  }

  const match = text.match(/(\d{4})-(\d{2})-(\d{2}).+(\d{2}):(\d{2}):(\d{2})/)
  if (!match) {
    return null
  }

  const [y, m, d, h, i, s] = match.slice(1).map(Number)
  const date = jst.from(new Date(y, m - 1, d, h, i, s))
  if (isNaN(date.getTime())) {
    return null
  }
  return date
}

const extractStartedDate = (node) => {
  const title = node.querySelector('#title .title')
  if (!title) {
    return null
  }

  const [, text] = title.rawText.split('/')

  const match = text.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!match) {
    return null
  }

  const [y, m, d] = match.slice(1).map(Number)
  const date = jst.from(new Date(y, m - 1, d))
  if (isNaN(date.getTime())) {
    return null
  }
  return date
}

module.exports = async (text) => {
  const root = parse(text)
  const wrapper = root.querySelector('#backframe #contents #body')
  if (!wrapper) {
    console.log('no wrapper')
    return null
  }

  const publishedAt = extractPublishedAt(wrapper)
  if (!publishedAt) {
    console.log('no published date')
    return null
  }

  const date = extractStartedDate(wrapper)
  if (!date) {
    console.log('no started date')
    return null
  }

  const list = wrapper.querySelectorAll('ul li')
  if (!list) {
    console.log('no list')
    return null
  }

  let events = []
  for (let item of list) {
    const members = Object.keys(Owner).join('|')
    const reg = new RegExp(
      String.raw`^(\d+)時(\d+)分～\s((${members})?([\s\S]*))`,
      'im'
    )
    const match = item.rawText.match(reg)
    if (!match) {
      continue
    }

    const h = Number(match[1])
    const m = Number(match[2])
    const all = match[3]
    const member = match[4]
    const tail = match[5]

    const ownerId = Owner[member] || null
    let title = ownerId ? tail : all
    if (title) {
      title = title.replace(/^[\s/]/, '').replace(/\s+/g, ' ')
    }

    let url = null
    for (let node of item.childNodes) {
      const attrs = node.attributes
      if (attrs && attrs.href) {
        url = attrs.href
        break
      }
    }

    const startedAt = new Date(date)
    startedAt.setHours(startedAt.getHours() + h)
    startedAt.setMinutes(startedAt.getMinutes() + m)

    events = [
      ...events,
      {
        ownerId,
        title,
        url,
        startedAt,
        publishedAt
      }
    ]
  }

  console.log('got events: %s', events.length)

  return {
    date,
    events
  }
}
