const html = require('nanohtml')
const Component = require('../rege/component')

const types = {
  notice: 'toast--notice',
  error: 'toast--error',
}

module.exports = class ToastsContainer extends Component {
  initialState() {
    return {
      items: new Set(),
    }
  }

  createElement() {
    return html`
      <div class="toasts-container">
        ${Array.from(this.state.items).map((item) => item.render())}
      </div>
    `
  }

  update() {
    return false
  }

  push(props) {
    const toast = new Toast(this.app, {
      container: this,
      type: 'notice',
      ...props,
    })
    this.state.items.add(toast)
    this.rerender()
  }

  remove(toast) {
    this.state.items.delete(toast)
    this.rerender()
  }
}

class Toast extends Component {
  initialState() {
    return {
      loaded: false,
    }
  }

  createElement({ type, message }) {
    return html`
      <div
        class="toast ${types[type]} ${!this.state.loaded
          ? 'toast--loading'
          : ''}"
      >
        <p class="lh4 fw500">${message}</p>
      </div>
    `
  }

  update() {
    return false
  }

  load(el) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.state.loaded = true
        this.rerender()
      })
    })
    setTimeout(() => {
      this.remove()
    }, 5000)
  }

  remove() {
    const { container } = this.props
    const el = this.element
    const style = getComputedStyle(el)
    el.style.marginTop = `${0 - el.offsetHeight - parseInt(style.marginTop)}px`
    el.style.opacity = 0
    setTimeout(() => {
      container.remove(this)
    }, parseFloat(style.transitionDuration) * 1000 + 50)
  }
}
