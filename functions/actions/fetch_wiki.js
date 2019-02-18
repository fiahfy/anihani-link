const fetch = require('node-fetch')
const { parse } = require('node-html-parser')
const initializeApp = require('../firebase')

const app = initializeApp()
const db = app.firestore()

const Owner = {
  因幡はねる: 'haneru-inaba',
  宇森ひなこ: 'hinako-umori',
  宗谷いちか: 'ichika-soya',
  日ノ隈らん: 'ran-hinokuma'
}

const wikiBaseUrl =
  'https://wikiwiki.jp/animare/%E9%85%8D%E4%BF%A1%E4%BA%88%E5%AE%9A/'
const timezoneOffsetHours = -9

const getGroup = async (groupId) => {
  const snapshot = await db
    .collection('groups')
    .doc(groupId)
    .get()
  const group = snapshot.data()
  return group
}

const updateDailySchedules = async (groupId, { date, append, schedules }) => {
  // 00:00 -> 24:00 (JST)
  const t = new Date(date)
  const m = new Date(t)
  m.setDate(m.getDate() + 1)
  console.log('update daily schedules: %s -> %s', t, m)

  let deletedRows = 0
  const batch = db.batch()
  if (!append) {
    console.log('delete schedules')
    const snapshot = await db
      .collection('schedules')
      .where('group', '==', db.collection('groups').doc(groupId))
      .where('started_at', '>=', t)
      .where('started_at', '<', m)
      .get()
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    deletedRows = snapshot.size
  }

  for (let s of schedules) {
    const ref = db.collection('schedules').doc()
    batch.set(ref, {
      owner: s.ownerId ? db.collection('members').doc(s.ownerId) : null,
      group: db.collection('groups').doc(groupId),
      title: s.title,
      description: s.description || null,
      url: s.url,
      started_at: s.startedAt,
      published_at: s.publishedAt,
      created_at: new Date(),
      updated_at: new Date()
    })
  }
  await batch.commit()
  if (deletedRows) {
    console.log('deleted rows: %s', deletedRows)
  }
  console.log('added rows: %s', schedules.length)
  console.log('updated daily schedules')
}

const fetchWikiPage = async (date) => {
  const d = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours() - timezoneOffsetHours
    )
  )
  const yyyy = d.getFullYear()
  const mm = ('00' + (d.getMonth() + 1)).slice(-2)
  const dd = ('00' + d.getDate()).slice(-2)
  const url = `${wikiBaseUrl}${yyyy}-${mm}-${dd}`
  console.log('fetch url: %s', url)
  const res = await fetch(url)
  const body = await res.text()
  console.log('fetched url')
  return body
}

const getDailySchedules = async () => {
  console.log('get daily schedules')
  let dailySchedules = []
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    const d = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        timezoneOffsetHours
      )
    )
    d.setDate(d.getDate() + i)
    const dailySchedule = await getDailySchedule(d)
    dailySchedules = [
      ...dailySchedules,
      {
        date: d,
        schedules: dailySchedule || []
      }
    ]
  }
  console.log('got daily schedules: %s', dailySchedules.length)
  return dailySchedules
}

const getDailySchedule = async (date) => {
  console.log('get daily schedules: %s', date)
  const body = await fetchWikiPage(date)
  if (!body) {
    console.log('no body')
    return null
  }

  const root = parse(body)
  const wrapper = root.querySelector('#backframe #contents #body')
  if (!wrapper) {
    console.log('no wrapper')
    return null
  }

  const publishedAt = extractPublishedAt(wrapper)
  if (!publishedAt) {
    console.log('no published at')
    return null
  }

  const list = wrapper.querySelectorAll('ul li')
  if (!list) {
    console.log('no list')
    return null
  }

  let schedules = []
  for (let item of list) {
    const text = item.rawText
    const matches = text.match(
      /^(\d+)時(\d+)分～\s((.+?)((:?[\s/()]|$)[\s\S]*))/
    )
    const [, h, m, all, member, desc] = matches

    const ownerId = Owner[member] || null
    const title = ownerId ? member : all
    let description = ownerId ? desc : null
    if (description) {
      description = description.replace(/^\//, '').replace(/\s+/g, ' ')
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
    startedAt.setHours(startedAt.getHours() + Number(h))
    startedAt.setMinutes(startedAt.getMinutes() + Number(m))

    schedules = [
      ...schedules,
      {
        ownerId,
        title,
        description,
        url,
        startedAt,
        publishedAt
      }
    ]
  }

  return schedules
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

  const matches = text.match(/(\d{4})-(\d{2})-(\d{2}).+(\d{2}):(\d{2}):(\d{2})/)
  if (!matches) {
    return null
  }

  const [y, m, d, h, i, s] = matches.slice(1).map(Number)
  const date = new Date(Date.UTC(y, m - 1, d, h + timezoneOffsetHours, i, s))
  if (isNaN(date.getTime())) {
    return null
  }
  return date
}

module.exports = async ({ groupId }) => {
  console.log('fetch wiki page for group: %s', groupId)

  if (!groupId) {
    console.log('group id not specified')
    return
  }

  const group = await getGroup(groupId)
  if (!group) {
    console.log('group not found: %s', groupId)
    return
  }

  if (groupId !== 'ani-mare') {
    console.log('group not supported: %s', groupId)
    return
  }

  const dailySchedules = await getDailySchedules()
  if (!dailySchedules.length) {
    return
  }

  for (let dailySchedule of dailySchedules) {
    await updateDailySchedules(groupId, dailySchedule)
  }
}
