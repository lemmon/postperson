import rege from './rege/index'
import saveState from './utils/save-state'
import App from './App'

// debugging

window.cl = (...args) => {
  console.log('👋', ...args)
  return args[0]
}

// components

import './components/Textarea'
import './components/Toasts'

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
