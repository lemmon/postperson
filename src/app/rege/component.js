import { render } from 'uhtml'
import noop from '../utils/noop'

export default class extends HTMLElement {
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
    this.render = render.bind(null, this.root, this.render.bind(this))
  }

  get root() {
    return this
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
