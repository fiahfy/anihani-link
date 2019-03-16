const timezoneOffset = 9 * 60

const now = () => {
  const d = new Date()
  return from(d)
}

const from = (d) => {
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset() - timezoneOffset)
  return d
}

module.exports = { now, from }
