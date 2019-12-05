const html = require('nanohtml')
const renderRequest = require('../partials/request')
const renderResponse = require('../partials/response')

module.exports = (app) => html`
  <body class="col">

    ${renderRequest(app.state.request || {}, app)}
    <hr class="div px1" style="--border-width: 2px;"/>
    ${renderResponse(app.state.response, app)}

  </body>
`
