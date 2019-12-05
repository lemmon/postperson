const html = require('nanohtml')
const saveState = require('../utils/save-state')

const tabs = [
  [
    'headers',
    (props, app) => html`Headers${props ? html`<span> <span class="color-black-40">(${props.headers.length})</span></span>` : ``}`,
    (props, app) => html`
      <div class="p1">
        <table class="bt b-black-20">
          ${props.headers.map(([name, value]) => html`
            <tr class="px1">
              <td class="f2 lh4 p05 bb b-black-20">${name}</td>
              <td class="f2 lh4 p05 bb b-black-20">${value}</td>
            </tr>
          `)}
        </table>
      </div>
    `,
  ],
  [
    'body',
    (props, app) => `Body`,
    (props, app) => html`
      <div class="p1">
        <pre class="code f2 lh4" style="white-space: pre-wrap; word-wrap: break-word;">${props.body}</pre>
      </div>
    `,
  ],
]

module.exports = (props, app) => props ? html`
  <section class="p1">
    <nav class="p1 lh4 row">
      <ul class="row">
        ${tabs.map(tab => html`
          <li><a
            class="block ul:hover ba px1 py05b"
            style="${tab[0] === props.tab ? `border-bottom: 0;` : `border-left-color: transparent; border-right-color: transparent; border-top-color: transparent;`}"
            href="#"
            onclick=${e => {
              e.preventDefault()
              props.tab = tab[0]
              saveState(app.state)
              app.render()
            }}
          >${tab[1](props, app)}</a></li>
        `)}
      </ul>
      <div class="span1 bb row justify-end">
        <dl class="px05 row">
          <dt class="px05 py05b pr025">Status:</dt>
          <dd class="px05 py05b pl025 color-${props.ok ? `green` : `red`}">${props.status} ${props.statusText}</dd>
          <dt class="px05 py05b pr025">Time:</dt>
          <dd class="px05 py05b pl025">${props.time} ms</dd>
          <dt class="px05 py05b pr025">Size:</dt>
          <dd class="px05 py05b pl025">${props.body.length} B</dd>
        </dl>
      </div>
    </nav>
    ${tabs.map(tab => tab[0] === props.tab ? tab[2](props, app) : ``)}
  </section>
` : ``
