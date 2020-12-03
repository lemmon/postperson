const rege = require('./rege')
const saveState = require('./utils/save-state')
const App = require('./App')

// debugging

window.cl = (...args) => {
  console.log('👋', ...args)
  return args[0]
}

// components

require('./components/Textarea')
require('./components/Toasts')

// default state

const defaultState = {
  request: {},
  ...JSON.parse(window.localStorage.getItem('postperson')),
}
if (!defaultState.request) defaultState.request = {}

// app

const app = rege(App, defaultState)

// utils

app.saveState = () => saveState(app.state)

// mount & run

app.render()
