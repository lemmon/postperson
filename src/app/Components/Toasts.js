import { html } from 'uhtml'
import Component from '../rege/Component'

customElements.define(
  'toasts-container',
  class extends Component {
    get initialState() {
      return {
        toasts: new Set(),
        index: 1,
      }
    }

    render() {
      return html`${Array.from(this.state.toasts).map(
        (x) =>
          html.for(this, x.index)`<toast-item
            data-id=${x.index}
            type=${x.type}
            message=${x.message}
            ondelete=${(e) => this.delete(x)}
          />`
      )}`
    }

    push(props) {
      this.state.toasts.add({
        index: this.state.index++,
        type: 'notice',
        ...props,
      })
      this.render()
    }

    delete(x) {
      this.state.toasts.delete(x)
      this.render()
    }
  }
)

customElements.define(
  'toast-item',
  class extends Component {
    initialState() {
      return {
        loaded: false,
      }
    }

    render() {
      this.toggleAttribute('loading', !this.state.loaded)
      return html`<p class="lh4 fw500">${this.attr('message')}</p>`
    }

    connected() {
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.setState({
            loaded: true,
          })
          this.render()
        })
        setTimeout(() => {
          this.delete()
        }, 2000)
      })
    }

    delete() {
      const style = getComputedStyle(this)
      this.style.opacity = 0
      this.style.marginTop = `${
        0 - this.offsetHeight - parseInt(style.marginTop)
      }px`
      setTimeout(() => {
        this.dispatchEvent(
          new Event('delete', {
            bubbles: true,
            cancelable: true,
          })
        )
      }, parseFloat(style.transitionDuration) * 1000 + 50)
    }
  }
)
