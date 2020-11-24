const NanoComponent = require('nanocomponent')
const Container = require('./components-container')

module.exports = class Component extends NanoComponent {
  constructor(app, props = {}) {
    super()
    this.app = app
    this.props = props
    this.state = {
      ...this.initialState(props, this),
      ...((typeof props.initialState === 'function' &&
        props.initialState(props, this)) ||
        props.initialState),
    }
    this._components = new Container()
  }

  initialState() {
    return {}
  }

  setState(...newStates) {
    return Object.assign(this.state, ...newStates)
  }

  render(props) {
    return super.render(props || this.props)
  }

  rerender() {
    if (!this.element) return
    this._rerender = true
    super.render(...this._arguments)
  }

  update() {
    return true
  }

  component(Component, props = {}) {
    return this._components.render(Component, this.app, props)
  }
}
