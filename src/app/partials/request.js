const html = require('nanohtml')
const saveState = require('../utils/save-state')

const methods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
]

const handleChange = (e, app) => {
  if (!app.state.request) app.state.request = {}
  app.state.request[e.target.name] = e.target.value
  saveState(app.state)
}

const handleSubmit = (e, app) => {
  e.preventDefault()
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
      tab: app.state.response && app.state.response.tab || 'body',
    }
    saveState(app.state)
    app.render()
  })
}

module.exports = (props, app) => html`
  <div class="px1">
    <form
      onchange=${e => handleChange(e, app)}
      onsubmit=${e => handleSubmit(e, app)}
    >
      <div class="p05 row lh4">
        <div class="p05 span1 row">
          <label class="block py05 row"><select
            class="input input--select py05"
            name="method"
          >
            ${methods.map(curr => html`
              <option selected=${curr === props.method}>${curr}</option>
            `)}
          </select><div class="py05 ml1">\u2193</div></label>
          <div class="div px1 py025"></div>
          <label class="block span1"><input
            class="input py1"
            type="url"
            name="resource"
            placeholder="http://"
            required
            value=${props.resource || ``}
          /></label>
        </div>
        <div class="p05"><button
          class="button bg-black color-white px2 py1"
          type="submit"
        >Send</button></div>
      </div>
    </form>
  </div>
`
