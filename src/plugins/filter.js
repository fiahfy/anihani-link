import Vue from 'vue'

Vue.filter('nl2br', (value) => {
  return (value || '').replace(/\n/g, '<br />')
})
