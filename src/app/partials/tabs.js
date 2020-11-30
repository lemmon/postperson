const { html } = require('uhtml')

const renderTabs = ({ tabs, active, info, onchange }) => html`
  <nav class="row">
    <ul class="row">
      ${tabs.map(
        ([curr], index) => html`
          <li
            class="${curr === active ? `bt bl br` : `bb`}"
            style="${curr === active
              ? `border-bottom: 0; padding-bottom: 1px;`
              : `padding: 1px 1px 0 1px;`}"
          >
            <a
              class="block anchor px1 py05b"
              href="#"
              onclick=${(e) => {
                e.preventDefault()
                onchange(index)
              }}
              >${curr()}</a
            >
          </li>
        `
      )}
    </ul>
    <div class="span1 bb row justify-end" style="padding-top: 1px;">
      ${(info && info()) || ''}
    </div>
  </nav>
`

module.exports = (props, app) => {
  const index = props.index && props.tabs[props.index] ? props.index : 0
  return html`
    <div>
      ${renderTabs({
        tabs: props.tabs,
        active: props.tabs[index][0],
        info: props.info,
        onchange: props.onchange,
      })}
      <div class="mt1">
        ${props.tabs[index][1]()}
      </div>
    </div>
  `
}
