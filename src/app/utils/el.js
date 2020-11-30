module.exports = (tagName, props) =>
  Object.assign(document.createElement(tagName), props)
