const html = require('nanohtml')
const renderTabs = require('./tabs')

module.exports = (props, app) =>
  props
    ? html`
        <section class="p2 lh4">
          ${renderTabs(
            {
              index: props.tab,
              tabs: [
                [
                  () => html`<span class="ul:hover">Body</span>`,
                  () => html`
                    <div
                      class="code code--block bg-black-05"
                      style="padding: 16px 20px;"
                    >
                      ${Object.assign(document.createElement('pre'), {
                        style: 'white-space: pre-wrap; word-wrap: break-word;',
                        textContent: props.json
                          ? JSON.stringify(props.json, null, 2)
                          : props.body,
                      })}
                    </div>
                  `,
                ],
                [
                  () =>
                    html`<span class="ul:hover">Headers</span>${props
                        ? html`<span class="inlineblock ml025 color-black-40"
                            >(${props.headers.length})</span
                          >`
                        : ``}`,
                  () => html`
                    <div
                      class="code code--block bg-black-05"
                      style="padding: 16px 20px;"
                    >
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
