const html = require('nanohtml')

const renderTabs = ({ entries, active, info, onchange }) => html`
  <nav class="row">
    <ul class="row">
      ${entries.map((curr, index) => html`
        <li
          class="${curr === active ? `bt bl br` : `bb`}"
          style="${curr === active ? `border-bottom: 0; padding-bottom: 1px;` : `padding: 1px 1px 0 1px;`}"
        ><a
          class="block anchor px1 py05b"
          href="#"
          onclick=${e => {
            e.preventDefault()
            onchange(index)
          }}
        >${curr()}</a></li>
      `)}
    </ul>
    <div class="span1 bb row justify-end" style="padding-top: 1px;">
      ${info && info() || ''}
    </div>
  </nav>
`

module.exports = (props, app) => {
  const index = props.index && props.panels[props.index] ? props.index : 0
  return html`
    <div>
      ${renderTabs({
        entries: props.list,
        active: props.list[index],
        info: props.info,
        onchange: props.onchange,
      })}
      <div>
        ${props.panels[index]()}
      </div>
    </div>
  `
}
