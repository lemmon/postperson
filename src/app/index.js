const html = require('nanohtml')
const rege = require('./rege')
const page = require('./pages/default')
const saveState = require('./utils/save-state')

window.cl = (...args) => {
  args.forEach(arg => console.log('🔍', arg))
  return args[0]
}

const defaultState = {
  request: {},
  ...JSON.parse(window.localStorage.getItem('postperson')),
}
if (!defaultState.request) defaultState.request = {}

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

const app = rege(app => page(app), defaultState)

app.saveState = () => saveState(app.state)

app.render()
