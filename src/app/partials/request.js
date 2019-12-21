const html = require('nanohtml')
const saveState = require('../utils/save-state')
const tabs = require('./tabs')

const methods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
]

const handleChange = (e, app) => {
  if (!app.state.request) app.state.request = { tab: 0 }
  app.state.request[e.target.name] = e.target.value
  saveState(app.state)
}

const handleSubmit = (e, app) => {
  e.preventDefault()
  app.render()
  const request = app.state.request
  const form = e.target
  const button = form.querySelector('button')
  button.classList.add('button--loading')
  button.disabled = true
  request.loading = true
  const t = Date.now()
  fetch(request.resource, {
    method: request.method,
    body: request.body || undefined,
  }).then(async res => {
    const response = app.state.response = {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      headers: Array.from(res.headers),
      body: await res.text(),
      time: Date.now() - t,
      tab: app.state.response && app.state.response.tab || 0,
    }
    response.type = (response.headers.find(curr => curr[0] == 'content-type') || ['', ''])[1].split(';', 1)[0] || null
    if (response.type === 'application/json') {
      response.json = JSON.parse(response.body)
    }
    delete request.loading
    saveState(app.state)
    app.render()
  })
}

const textarea = (props) => {
  const el = document.createElement('custom-textarea')
  el.className = 'input input--textarea p1'
  el.name = 'body'
  el.value = props.value || ''
  return el
}

module.exports = (props, app) => html`
  <div class="p1">
    <form
      class="lh4"
      onchange=${e => handleChange(e, app)}
      onsubmit=${e => handleSubmit(e, app)}
    >
      <div class="p05">
        <div class="row">
          <div class="span1 row">
            <div class="p05"><label class="block px075 row bg-black-05"><select
              class="input input--select px025 py1"
              name="method"
            >
              ${methods.map(curr => html`
                <option selected=${curr === props.method}>${curr}</option>
              `)}
            </select><div class="px025 py1">\u2193</div></label></div>
            <div class="p05 span1"><label class="block"><input
              class="input p1 bg-black-05"
              type="url"
              name="resource"
              placeholder="http://"
              required
              value=${props.resource || ``}
            /></label></div>
          </div>
          <div class="p05"><button
            class="button ${props.loading ? `button--loading` : ``} bg-black color-white px2 py1"
            type="submit"
            disabled=${!!props.loading}
          >
            <div class="button__caption fw500">Send</div>
            <div class="button__loader"></div>
          </button></div>
        </div>
        <div class="p05">
          ${tabs({
            index: props.tab,
            list: [
              () => html`<span class="ul:hover">Body</span>`,
            ],
            panels: [
              () => html`
                <div class="mt1">
                  <label class="block bg-black-05 code py0125">${textarea({ value: props.body })}</label>
                </div>
              `,
            ],
            onchange: (index) => {
              props.tab = index
              saveState(app.state)
              app.render()
            },
          })}
        </div>
      </div>
    </form>
  </div>
`
