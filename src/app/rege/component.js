const { render, html } = require('uhtml')
const noop = require('../utils/noop')

module.exports = class extends HTMLElement {
  constructor() {
    super()
    this._props = {}
    this._state = {
      // initial state getter
      ...this.initialState,
    }
    // initial state attribute
    Object.defineProperty(this, 'initialState', {
      configurable: true,
      set: (x) => {
        Object.assign(this._state, x)
        Object.defineProperty(this, 'initialState', {
          set: noop,
        })
      },
    })
    // render
    this.render = render.bind(null, this, this.render.bind(this))
  }

  render() {}
  connected() {}
  disconnected() {}

  connectedCallback() {
    this.connected()
    this.render()
  }

  attr(attributeName) {
    return this.getAttribute(attributeName)
  }

  set props(props) {
    this._props = props
    this.render()
  }

  get props() {
    return this._props
  }

  get state() {
    return this._state
  }

  setState(...newStates) {
    Object.assign(this._state, ...newStates)
  }
}
