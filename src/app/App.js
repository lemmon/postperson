const { html } = require('uhtml')
const renderRequest = require('./partials/request')
const renderResponse = require('./partials/response')

module.exports = (app) => html`
  <toasts-container
    ref=${(x) => {
      app.$toast = x
    }}
  />
  ${renderRequest(app.state.request, app)}
  <hr class="div px1" style="--border-width: 2px;" />
  ${renderResponse(app.state.response, app)}
`
