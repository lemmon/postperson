const html = require('nanohtml')
const rege = require('./rege')
const page = require('./pages/default')

window.dd = (...args) => {
  args.forEach(arg => console.log('🔍', arg))
  return args[0]
}

const init = JSON.parse(window.localStorage.getItem('postperson'))
const defaultState = {
  request: { tab: 0 },
}

const messageTypes = {
  error: 'flash__message--error',
  notice: 'flash__message--notice',
}

flash.message = (type, text) => {
  const el = document.createElement('div')
  el.className = `flash__message ${messageTypes[type]}`
  el.textContent = text
  flash.appendChild(el)
  setTimeout(() => {
    el.style.opacity = 0
  }, 2000)
  setTimeout(() => {
    flash.removeChild(el)
  }, 2500)
}

flash.notice = (msg) => flash.message('notice', msg)
flash.error = (msg) => flash.message('error', msg)

require('@lemmon/custom-textarea')

rege(app => page(app), init || defaultState).render()
