const html = require('nanohtml')
const rege = require('./rege')
const saveState = require('./utils/save-state')
const App = require('./App')
const ToastsContainer = require('./components/Toasts')

// debugging

window.cl = (...args) => {
  args.forEach((arg) => console.log('🔍', arg))
  return args[0]
}

// custom components

require('@lemmon/custom-textarea')

// default state

const defaultState = {
  request: {},
  ...JSON.parse(window.localStorage.getItem('postperson')),
}
if (!defaultState.request) defaultState.request = {}

// app

const app = rege(App, defaultState)

// toasts

app.$toast = new ToastsContainer(app)

// utils

app.saveState = () => saveState(app.state)

// mount & run

app.render()
