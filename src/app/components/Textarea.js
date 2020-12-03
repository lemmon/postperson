const { html } = require('uhtml')
const Component = require('../rege/Component')
const el = require('../utils/el')

const css = (x) => x

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
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: normal;
    color: transparent;
  }
`

customElements.define(
  'custom-textarea',
  class extends Component {
    constructor() {
      super()
      // create nodes
      this.$control = html.node`<textarea class="control" oninput=${(e) =>
        this.handleInput(e)} />`
      this.$preview = html.node`<div class="preview" />`
      // observe inner content
      new MutationObserver((mutations) => {
        cl('=>', this.textContent)
        this.$control.value = this.textContent
        this.updatePreview()
      }).observe(this, { childList: true })
    }

    get root() {
      cl('this.root')
      return this.attachShadow({ mode: 'open' })
    }

    render() {
      return html`
        <style>
          ${style}
        </style>
        ${this.$control} ${this.$preview}
      `
    }

    connected() {
      this.updatePreview()
    }

    updatePreview() {
      this.$preview.textContent = `${this.$control.value}.`
    }

    handleInput(e) {
      // this.updatePreview()
      this.textContent = e.target.value
    }

    static get observedAttributes() {
      return []
    }

    attributeChangedCallback(name, oldValue, newValue) {}
  }
)
