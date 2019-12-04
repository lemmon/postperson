const html = require('nanohtml')
const rege = require('./rege')

const methods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
]

const renderRequest = (props, app) => html`
  <div class="p1">
    <form
      onchange=${e => {
        if (!app.state.request) app.state.request = {}
        app.state.request[e.target.name] = e.target.value
        saveState(app.state)
      }}
      onsubmit=${e => {
        e.preventDefault()
        app.state.response = {
          loading: true,
        }
        app.render()
        const form = e.target
        const t = Date.now()
        fetch(form.elements['resource'].value, {
          method: form.elements['method'].value,
        }).then(async res => {
          app.state.response = {
            ok: res.ok,
            status: res.status,
            statusText: res.statusText,
            headers: Array.from(res.headers),
            body: await res.text(),
            time: Date.now() - t,
          }
          saveState(app.state)
          app.render()
        })
      }}
    >
      <select name="method">
        ${methods.map(curr => html`
          <option selected=${curr === props.method}>${curr}</option>
        `)}
      </select>
      <input
        type="url"
        name="resource"
        required
        value=${props.resource || ``}
      />
      <button
        type="submit"
      >Send</button>
    </form>
  </div>
`

const renderResponse = (props, app) => props ? html`
  <div class="p05">
    ${props.loading ? html`<div>Loading...</div>` : html`
      <div class="p05">
        <dl class="lh4">
          <dt>Status:</dt>
          <dd>${props.status} ${props.statusText}</dd>
          <dt>Time:</dt>
          <dd>${props.time} ms</dd>
          <dt>Size:</dt>
          <dd>${props.body.length} B</dd>
        </dl>
      </div>
      <div class="p05">
        <table>
          ${props.headers.map(([name, value]) => html`
            <tr>
              <td class="lh4">${name}</td>
              <td class="lh4">${value}</td>
            </tr>
          `)}
        </table>
      </div>
      <div>
        <pre class="p05 code f2 lh4" style="white-space: pre-wrap; word-wrap: break-word;">${props.body}</pre>
      </div>
    `}
  </div>
` : ``

const render = (app) => html`
  <body class="col p1">

    ${renderRequest(app.state.request || {}, app)}
    ${renderResponse(app.state.response, app)}

  </body>
`

rege(app => {
  return render(app)
}, JSON.parse(window.localStorage.getItem('postperson')) || {}).render()

function saveState(state) {
  window.localStorage.setItem('postperson', JSON.stringify({
    request: state.request,
    response: state.response,
  }))
}
