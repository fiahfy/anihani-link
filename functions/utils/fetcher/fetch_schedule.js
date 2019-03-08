const fetch = require('node-fetch')

const wikiBaseUrl =
  'https://wikiwiki.jp/animare/%E9%85%8D%E4%BF%A1%E4%BA%88%E5%AE%9A/'

module.exports = async (date) => {
  const yyyy = date.getFullYear()
  const mm = ('00' + (date.getMonth() + 1)).slice(-2)
  const dd = ('00' + date.getDate()).slice(-2)
  const url = `${wikiBaseUrl}${yyyy}-${mm}-${dd}`
  console.log('fetch url: %s', url)
  const res = await fetch(url)
  const body = await res.text()
  console.log('fetched url')
  return body
}
