const html = require('nanohtml')
const rege = require('./rege')
const page = require('./pages/default')

const init = JSON.parse(window.localStorage.getItem('postperson'))

require('@lemmon/custom-textarea/element')

rege(app => page(app), init || {}).render()
