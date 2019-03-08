const timezoneOffset = 9 * 60

const date = () => {
  const d = new Date()
  return from(d)
}

const from = (d) => {
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset() - timezoneOffset)
  return d
}

module.exports = { date, from }
