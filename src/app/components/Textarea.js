import { html } from 'uhtml'
import Component from '../rege/Component'
import el from '../utils/el'
import css from '../utils/ret'

const style = css`
  :host {
    display: block;
    position: relative;
    cursor: text;
  }
  .control {
    appearance: none;
    box-sizing: border-box;
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    resize: none;
    overflow: hidden;
    margin: 0;
    border: 0;
    padding: inherit;
    font: inherit;
    text-align: inherit;
    color: inherit;
    background-color: transparent;
    box-shadow: none;
    outline: 0;
    cursor: inherit;
  }
  .control::placeholder {
    color: var(--placeholder-color, inherit);
    opacity: var(--placeholder-opacity, 0.5);
  }
  .preview {
    display: flex;
    flex-direction: row;
    color: transparent;
  }
  .preview__minlines {
    width: 0px;
  }
  .preview__content {
    width: 100%;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: normal;
  }
`

customElements.define(
  'custom-textarea',
  class extends Component {
    constructor() {
      super()
      // create nodes
      this.$control = el('textarea', {
        className: 'control',
        oninput: (e) => this.handleInput(e),
        onchange: (e) => this.handleChange(e),
      })
      this.$preview = el('div', {
        className: 'preview__content',
      })
    }

    get root() {
      return this.attachShadow({ mode: 'open' })
    }

    get initialState() {
      return {
        value: null,
        inputValue: null,
      }
    }

    render() {
      return html`
        <style>
          ${style}
        </style>
        ${this.$control}
        <div class="preview">
          <div class="preview__minlines">1<br />2<br />3<br /></div>
          ${this.$preview}
        </div>
      `
    }

    connected() {
      this.updatePreview()
    }

    get name() {
      return this.attr('name')
    }

    get value() {
      return this.state.value
    }

    set value(x) {
      if (x === undefined || this.state.inputValue !== null) return
      this.state.value = x
      this.$control.value = x
      this.updatePreview()
    }

    updatePreview() {
      this.$preview.textContent = `${
        this.state.inputValue || this.state.value
      }.`
    }

    handleInput(e) {
      this.state.value = e.target.value.trim()
      this.state.inputValue = e.target.value
      this.updatePreview()
      this.dispatchEvent(
        new Event('input', {
          bubbles: true,
          cancelable: true,
        })
      )
    }

    handleChange(e) {
      this.state.inputValue = null
      this.dispatchEvent(
        new Event('change', {
          bubbles: true,
          cancelable: true,
        })
      )
    }
  }
)
