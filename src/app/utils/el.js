export default (tagName, props) =>
  Object.assign(document.createElement(tagName), props)
