const html = require('nanohtml')

module.exports = (props, app) => props ? html`
  <div class="p1">
    ${props.loading ? html`<div>Loading\u2026</div>` : html`
      <div class="p05">
        <dl class="lh4 row">
          <dt class="p05 pr025">Status:</dt>
          <dd class="p05 pl025 color-${props.ok ? `green` : `red`}">${props.status} ${props.statusText}</dd>
          <dt class="p05 pr025">Time:</dt>
          <dd class="p05 pl025">${props.time} ms</dd>
          <dt class="p05 pr025">Size:</dt>
          <dd class="p05 pl025">${props.body.length} B</dd>
        </dl>
      </div>
      <div class="p1">
        <table class="bt">
          ${props.headers.map(([name, value]) => html`
            <tr>
              <td class="f2 lh4 p05 bb">${name}</td>
              <td class="f2 lh4 p05 bb">${value}</td>
            </tr>
          `)}
        </table>
      </div>
      <div class="p1">
        <pre class="ba p1 code f2 lh4" style="white-space: pre-wrap; word-wrap: break-word;">${props.body}</pre>
      </div>
    `}
  </div>
` : ``
