module.exports = (state) => {
  window.localStorage.setItem(
    'postperson',
    JSON.stringify({
      request: {
        ...state.request,
        loading: undefined,
      },
    })
  )
}
