const jst = require('../jst')

const Owner = {
  はねる: 'haneru-inaba',
  いちか: 'ichika-soya',
  らん: 'ran-hinokuma',
  くく: 'kuku-kazami',
  いづみ: 'izumi-yunohara',
  パトラ: 'patra-suo',
  シャル: 'charlotte-shimamura',
  ミコ: 'mico-sekishiro',
  メアリ: 'mary-saionji'
}

module.exports = (text) => {
  // reg = /配信スケジュール.*\n([\s\S]*)#(あにまーれ|ハニスト)/
  // match = reg.exec(text)
  // if (!match) {
  //   return false
  // }
  // ;[, text] = match

  let matches = []
  let index = 0
  const reg = /((\d+)\/(\d+)[(（].[）)])/g
  for (;;) {
    const match = reg.exec(text)
    if (!match) {
      if (matches.length) {
        matches[matches.length - 1].text = text.slice(index)
      }
      break
    }

    if (matches.length) {
      matches[matches.length - 1].text = text.slice(index, match.index)
    }
    index = match.index

    const month = Number(match[2]) - 1
    const date = Number(match[3])

    const d = jst.now()
    let year = d.getFullYear()
    if (d.getMonth() === 11 && month === 0) {
      year++ // increment year if it is December
    }

    // 0:00:00 UTC+9
    const startedAt = jst.from(new Date(year, month, date))

    matches = [...matches, { date: startedAt }]
  }

  if (!matches.length) {
    return null
  }

  return matches.map(({ date, text }) => {
    let events = []
    // eslint-disable-next-line no-irregular-whitespace
    const reg = /([^\s　]+)[\s　]+(\d+):(\d+)-?(?:[\s　]*[(（](.+)[）)])?(?:\n(＊[^\n\s]+))?/g
    for (;;) {
      const match = reg.exec(text)
      if (!match) {
        break
      }

      const member = match[1]
      const hour = Number(match[2])
      const minute = Number(match[3])

      const ownerId = Owner[member] || null
      let title = null
      if (ownerId) {
        title = match[4] || null
        if (title) {
          title += match[5] || ''
        }
      } else {
        title = member
      }
      const startedAt = new Date(date)
      startedAt.setHours(startedAt.getHours() + hour)
      startedAt.setMinutes(startedAt.getMinutes() + minute)

      events = [
        ...events,
        {
          ownerId,
          title,
          startedAt
        }
      ]
    }

    return {
      date,
      events
    }
  })
}
