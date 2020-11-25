const html = require('nanohtml')
const tabs = require('./tabs')

module.exports = (props, app) =>
  props
    ? html`
        <section class="p2 lh4">
          ${tabs(
            {
              index: props.tab,
              list: [
                () => html`<span class="ul:hover">Body</span>`,
                () =>
                  html`<span class="ul:hover">Headers</span>${props
                      ? html`<span class="inlineblock ml025 color-black-40"
                          >(${props.headers.length})</span
                        >`
                      : ``}`,
              ],
              panels: [
                () => html`
                  <div class="mt1 code code--block">
                    <pre style="white-space: pre-wrap; word-wrap: break-word;">
${props.json ? JSON.stringify(props.json, null, 2) : props.body}</pre
                    >
                  </div>
                `,
                () => html`
                  <div class="mt1 code code--block">
                    <table>
                      ${props.headers.map(
                        ([name, value]) => html`
                          <tr>
                            <td class="color-black-60">
                              ${name}:<span
                                class="inlineblock o0"
                                style="width: 2ch;"
                                >:</span
                              >
                            </td>
                            <td class="ml1">${value}</td>
                          </tr>
                        `
                      )}
                    </table>
                  </div>
                `,
              ],
              info: () => html`
                <dl class="px05 row">
                  <dt class="px05 py05b pr025 color-black-40">Status:</dt>
                  <dd
                    class="px05 py05b pl025 ${props.ok
                      ? `color-green`
                      : `color-red`}"
                  >
                    ${props.status} ${props.statusText}
                  </dd>
                  <dt class="px05 py05b pr025 color-black-40">Time:</dt>
                  <dd class="px05 py05b pl025">${props.time} ms</dd>
                  <dt class="px05 py05b pr025 color-black-40">Size:</dt>
                  <dd class="px05 py05b pl025">${props.body.length} B</dd>
                </dl>
                <div class="px05">
                  <a
                    class="block px05 py05b color-black-40 ul:hover color-inherit:hover"
                    onclick=${(e) => {
                      e.preventDefault()
                      app.setState({
                        response: null,
                      })
                      app.saveState()
                      app.render()
                    }}
                    href="#"
                    >clear</a
                  >
                </div>
              `,
              onchange: (index) => {
                props.tab = index
                app.saveState()
                app.render()
              },
            },
            app
          )}
        </section>
      `
    : html`
        <section class="p1">
          <div class="p1"><p class="lh4">No request sent, yet.</p></div>
        </section>
      `
