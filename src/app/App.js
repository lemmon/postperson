import { html } from 'uhtml'
import renderRequest from './partials/request'
import renderResponse from './partials/response'

export default (app) => html`
  <toasts-container
    ref=${(x) => {
      app.$toast = x
    }}
  />
  ${renderRequest(app.state.request, app)}
  <hr class="div px1" style="--border-width: 2px;" />
  ${renderResponse(app.state.response, app)}
`
