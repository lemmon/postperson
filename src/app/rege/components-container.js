module.exports = class ComponentsContainer {
  constructor() {
    this.components = {}
  }

  render(Component, app, props) {
    const instanceID = `${Component.prototype.constructor.name}__${
      props.$id || props.name
    }`
    return this.createComponent(Component, instanceID, app, props).render(props)
  }

  createComponent(Component, instanceID, app, props) {
    if (this.components[instanceID]) {
      return this.components[instanceID]
    }

    const component = new Component(app, props)

    const _load = component.load
    const _unload = component.unload
    const _update = component.update

    component.load = (el) => {
      if (_load) _load.call(component, el)
    }
    component.unload = (el) => {
      if (_unload && _unload.call(component, el) === false) return
      delete this.components[instanceID]
    }
    component.update = (props) => {
      component.props = props
      return _update() !== false
    }

    return (this.components[instanceID] = component)
  }
}
