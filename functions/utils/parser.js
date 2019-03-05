const timezoneOffset = 9 * 60

const Owner = {
  はねる: 'haneru-inaba',
  ひなこ: 'hinako-umori',
  いちか: 'ichika-soya',
  らん: 'ran-hinokuma',
  パトラ: 'patra-suo',
  シャル: 'charlotte-shimamura',
  エリ: 'eli-sogetsu',
  ミコ: 'mico-sekishiro',
  メアリ: 'mary-saionji'
}

const fakeJST = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset() + timezoneOffset)
  return d
}

const parseTweet = (text) => {
  // reg = /配信スケジュール.*\n([\s\S]*)#(あにまーれ|ハニスト)/
  // match = reg.exec(text)
  // if (!match) {
  //   return false
  // }
  // ;[, text] = match

  const append = /追加/.test(text)

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

    const d = fakeJST()
    let year = d.getFullYear()
    if (d.getMonth() === 11 && month === 0) {
      year++ // increment year if it is December
    }

    // 0:00:00 UTC+9
    const startedAt = new Date(Date.UTC(year, month, date, 0, -timezoneOffset))

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

      const owner = Owner[member] || null
      const title = member
      let description = match[4] || null
      if (description) {
        description += match[5] || ''
      }
      const startedAt = new Date(date)
      startedAt.setHours(startedAt.getHours() + hour)
      startedAt.setMinutes(startedAt.getMinutes() + minute)

      events = [
        ...events,
        {
          owner,
          title,
          description,
          startedAt
        }
      ]
    }

    return {
      date,
      append,
      events
    }
  })
}

module.exports = {
  parseTweet
}