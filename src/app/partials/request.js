const { html } = require('uhtml')
const renderTabs = require('./tabs')

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

const handleChange = (e, app) => {
  app.state.request[e.target.name] = e.target.value
  app.saveState()
  app.render()
}

const handleSubmit = (e, app) => {
  e.preventDefault()
  const { $toast } = app
  const { request } = app.state
  const t = Date.now()
  const q = new URLSearchParams(parseArgs(request.params)).toString()
  const url = request.url + (q && `?${q}`)
  fetch(url, {
    method: request.method,
    body: request.body || undefined,
    headers: parseArgs(request.headers),
  })
    .then(async (res) => {
      const { response } = app.setState({
        response: {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText,
          headers: Array.from(res.headers),
          body: await res.text(),
          time: Date.now() - t,
          tab: (app.state.response && app.state.response.tab) || 0,
        },
      })
      response.type =
        (response.headers.find((curr) => curr[0] == 'content-type') || [
          '',
          '',
        ])[1].split(';', 1)[0] || null
      if (response.type === 'application/json') {
        response.json = JSON.parse(response.body)
      }
      $toast.push({
        message: 'Response received successfully.',
      })
      app.saveState()
    })
    .catch((err) => {
      $toast.push({
        message: err.message,
        type: 'error',
      })
    })
    .then(() => {
      delete request.loading
      app.render()
    })
  request.loading = true
  app.render()
}

module.exports = (props, app) => html`
  <div class="p15 lh4">
    <form
      onchange=${(e) => handleChange(e, app)}
      onsubmit=${(e) => handleSubmit(e, app)}
    >
      <div class="row">
        <div class="p05">
          <label class="block px075 row bg-black-05 outline:focus-within"
            ><select class="input input--select px025 py1" name="method">
              ${methods.map(
                (curr) => html`
                  <option selected=${curr === props.method || null}>
                    ${curr}
                  </option>
                `
              )}
            </select>
            <div class="px025 py1">↓</div></label
          >
        </div>
        <div class="p05 span1">
          <label class="block outline:focus-within"
            ><input
              class="input p1 bg-black-05"
              type="text"
              name="resource"
              placeholder="http://"
              required
              .value=${(props.url && props.resource) || ``}
              onchange=${(e) => {
                e.stopPropagation()
                const value = e.target.value
                const [url, query] = value.split('?')
                app.state.request.url = url
                if (query) {
                  const params = Array.from(
                    new URL(value).searchParams.entries()
                  ).map((x) => `${x[0]} = ${x[1]}`)
                  app.state.request.params = params.join('\n')
                  app.state.request.paramsCount = params.length
                }
                app.state.request.resource = url
                app.render()
                app.saveState()
              }}
          /></label>
        </div>
        <div class="p05">
          <button
            type="submit"
            class=${`button ${
              props.loading ? `button--loading` : ``
            } bg-black px2 py1 outline:focus`}
            disabled=${!!props.loading || null}
          >
            <div class="button__caption color-white fw500">Send</div>
            <div class="button__loader color-white"></div>
          </button>
        </div>
      </div>
      <div class="p05">
        ${renderTabs({
          index: props.tab,
          tabs: [
            [
              () =>
                html`<span class="ul:hover">Params</span>${props.paramsCount &&
                  html`<span class="inlineblock ml025 color-black-40"
                    >(${props.paramsCount})</span
                  >`}`,
              () => html`
                <label
                  class="block bg-black-05 code code--block outline:focus-within"
                >
                  <custom-textarea
                    class="input input--textarea"
                    style="padding: 16px 20px;"
                    name="params"
                    placeholder="name=value"
                    .value=${props.params}
                    onchange=${(e) => {
                      props.paramsCount = Object.keys(
                        parseArgs(e.target.value)
                      ).length
                      setTimeout(() => {
                        app.render()
                      })
                    }}
                  />
                </label>
              `,
            ],
            [
              () => html`<span class="ul:hover">Body</span>`,
              () => html`
                <label
                  class="block bg-black-05 code code--block outline:focus-within"
                >
                  <custom-textarea
                    name="body"
                    style="padding: 16px 20px;"
                    .value=${props.body}
                  />
                </label>
              `,
            ],
            [
              () =>
                html`<span class="ul:hover">Headers</span
                  >${props.headersCount &&
                  html`<span class="inlineblock ml025 color-black-40"
                    >(${props.headersCount})</span
                  >`}`,
              () => html`
                <label
                  class="block bg-black-05 code code--block outline:focus-within"
                >
                  <custom-textarea
                    name="headers"
                    style="padding: 16px 20px;"
                    placeholder="name: value"
                    .value=${props.headers}
                    onchange="${(e) => {
                      props.headersCount = Object.keys(
                        parseArgs(e.target.value)
                      ).length
                      setTimeout(() => {
                        app.render()
                      })
                    }},"
                  />
                </label>
              `,
            ],
          ],
          onchange: (index) => {
            props.tab = index
            app.saveState()
            app.render()
          },
        })}
      </div>
    </form>
  </div>
`

function parseArgs(input) {
  return (
    (input &&
      input
        .split(/\n/)
        .map((l) => l.trim())
        .map((l) => l.match(/^([^\s:]+)\s*[:=]\s*(.*)/))
        .filter((l) => l && l[2])
        .reduce(
          (acc, curr) =>
            Object.assign(acc, {
              [curr[1]]: curr[2],
            }),
          {}
        )) ||
    {}
  )
}
