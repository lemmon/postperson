const html = require('nanohtml')
const rege = require('./rege')
const page = require('./pages/default')

const init = JSON.parse(window.localStorage.getItem('postperson'))
const defaultState = {
  request: { tab: 0 },
}

require('@lemmon/custom-textarea/element')

rege(app => page(app), init || defaultState).render()
