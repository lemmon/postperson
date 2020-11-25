const html = require('nanohtml')
const tabs = require('./tabs')

const methods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
]

const handleChange = (e, app) => {
  app.state.request[e.target.name] = e.target.value
  app.saveState()
}

const handleSubmit = (e, app) => {
  e.preventDefault()
  app.render()
  const { $toast } = app
  const { request } = app.state
  const form = e.target
  const button = form.querySelector('button')
  button.classList.add('button--loading')
  button.disabled = true
  request.loading = true
  const t = Date.now()
  const q = new URLSearchParams(parseArgs(request.params)).toString()
  const url = request.url + (q && `?${q}`)
  fetch(url, {
    method: request.method,
    body: request.body || undefined,
    headers: parseArgs(request.headers),
  }).then(async res => {
    const { response } = app.setState({
      response: {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        headers: Array.from(res.headers),
        body: await res.text(),
        time: Date.now() - t,
        tab: app.state.response && app.state.response.tab || 0,
      }
    })
    response.type = (response.headers.find(curr => curr[0] == 'content-type') || ['', ''])[1].split(';', 1)[0] || null
    if (response.type === 'application/json') {
      response.json = JSON.parse(response.body)
    }
    $toast.push({
      message: 'Response received successfully.',
    })
    app.saveState()
  }).catch(err => {
    $toast.push({
      message: err.message,
      type: 'error',
    })
  }).then(() => {
    delete request.loading
    app.render()
  })
}

const textarea = (props) => {
  const el = document.createElement('custom-textarea')
  el.className = 'input input--textarea p1'
  el.id = props.id
  el.name = props.name
  el.value = props.value || ''
  if (props.placeholder) el.placeholder = props.placeholder
  if (props.onchange) el.onchange = props.onchange
  return el
}

module.exports = (props, app) => html`
  <div class="p1 lh4">
    <form
      onchange=${e => handleChange(e, app)}
      onsubmit=${e => handleSubmit(e, app)}
    >
      <div class="p05">
        <div class="row">
          <div class="span1 row">
            <div class="p05"><label class="block px075 row bg-black-05 outline:focus-within"><select
              class="input input--select px025 py1"
              name="method"
            >
              ${methods.map(curr => html`
                <option selected=${curr === props.method}>${curr}</option>
              `)}
            </select><div class="px025 py1">\u2193</div></label></div>
            <div class="p05 span1"><label class="block outline:focus-within"><input
              class="input p1 bg-black-05"
              type="text"
              name="resource"
              placeholder="http://"
              required
              value=${props.url && props.resource || ``}
              onchange=${e => {
                e.stopPropagation()
                const value = e.target.value
                const [url, query] = value.split('?')
                app.state.request.url = url
                if (query) {
                  const params = Array.from(new URL(value).searchParams.entries()).map(x => `${x[0]} = ${x[1]}`)
                  app.state.request.params = params.join('\n')
                  app.state.request.paramsCount = params.length
                  // TODO: hack!
                  const TA = document.getElementById('f__request__params')
                  if (TA) TA.value = app.state.request.params
                  // /hack
                }
                app.state.request.resource = url
                app.render()
                app.saveState()
              }}
            /></label></div>
          </div>
          <div class="p05"><button
            class="button ${props.loading ? `button--loading` : ``} bg-black px2 py1 outline:focus"
            type="submit"
            disabled=${!!props.loading}
          >
            <div class="button__caption color-white fw500">Send</div>
            <div class="button__loader color-white"></div>
          </button></div>
        </div>
        <div class="p05">
          ${tabs({
            index: props.tab,
            list: [
              () => html`<span class="ul:hover">Params</span>${props && props.paramsCount ? html`<span class="inlineblock ml025 color-black-40">(${props.paramsCount})</span>` : ``}`,
              () => html`<span class="ul:hover">Body</span>`,
              () => html`<span class="ul:hover">Headers</span>${props && props.headersCount ? html`<span class="inlineblock ml025 color-black-40">(${props.headersCount})</span>` : ``}`,
            ],
            panels: [
              () => html`
                <div class="mt1">
                  <label class="block bg-black-05 code code--block outline:focus-within">${textarea({
                    id: 'f__request__params',
                    name: 'params',
                    value: props.params,
                    placeholder: 'name=value',
                    onchange: (e) => {
                      props.paramsCount = Object.keys(parseArgs(e.target.value)).length
                      setTimeout(() => {
                        app.render()
                      })
                    },
                  })}</label>
                </div>
              `,
              () => html`
                <div class="mt1">
                  <label class="block bg-black-05 code code--block outline:focus-within">${textarea({
                    id: 'f__request__body',
                    name: 'body',
                    value: props.body,
                  })}</label>
                </div>
              `,
              () => html`
                <div class="mt1">
                  <label class="block bg-black-05 code code--block outline:focus-within">${textarea({
                    id: 'f__request__headers',
                    name: 'headers',
                    value: props.headers,
                    placeholder: 'name: value',
                    onchange: (e) => {
                      props.headersCount = Object.keys(parseArgs(e.target.value)).length
                      setTimeout(() => {
                        app.render()
                      })
                    },
                  })}</label>
                </div>
              `,
            ],
            onchange: (index) => {
              props.tab = index
              app.saveState()
              app.render()
            },
          })}
        </div>
      </div>
    </form>
  </div>
`

function parseArgs(input) {
  return input && input
    .split(/\n/)
    .map(l => l.trim())
    .map(l => l.match(/^([^\s:]+)\s*[:=]\s*(.*)/))
    .filter(l => l && l[2])
    .reduce((acc, curr) => Object.assign(acc, {
      [curr[1]]: curr[2],
    }), {}) || {}
}
