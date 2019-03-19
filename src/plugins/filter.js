import Vue from 'vue'
import TimeAgo from 'javascript-time-ago'

let [lang] = navigator.language.split('-')
let locale
try {
  locale = require('javascript-time-ago/locale/' + lang)
} catch (e) {
  lang = 'en'
  locale = require('javascript-time-ago/locale/en')
}
TimeAgo.addLocale(locale)
const timeAgo = new TimeAgo(lang)

Vue.filter('nl2br', (value) => {
  return (value || '').replace(/\n/g, '<br />')
})

Vue.filter('url2anchor', (value) => {
  return (value || '').replace(/(https?:\/\/[^\n\s]+)/g, '<a href="$1">$1</a>')
})

Vue.filter('time_ago', (value) => {
  if (value instanceof Date) {
    value = value.getTime()
  }
  return timeAgo.format(value)
})
