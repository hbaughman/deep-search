global.defaultState = {
  search: '',
  isRegex: false,
  isDeep: false,
  isCaseInsensitive: true,
  isValid: true,
}

export default function resetState() {
  global.savedState = Object.assign({}, global.defaultState)
  return global.savedState
}
