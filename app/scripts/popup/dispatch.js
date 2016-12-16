import { ui } from './interface'
import manageState from './manageState'
import buildRegex from '../shared/buildRegex'
import messageContent from '../shared/messageContent'

export default {
  updateSearch() {
    const queryParams = manageState.saveState()

    const isValid = queryParams.isRegex ? this.isRegexValid(queryParams) : true
    ui.toggleValidClass(isValid)
    ui.toggleDisableable(!queryParams.search)

    if (isValid && !queryParams.isDeep) {
      // The highlighting engine blows up if you feed it an empty string.
      if (queryParams.search) {
        this.submitQuery(queryParams)
      }
      // If the user deletes/backspaces the contents of the search box we must
      // clear the existing search explicitly. Normally it would be called
      // implicitly on receipt of the message from `this.submitQuery`.
      else {
        messageContent({ message: "clear_marks" })
      }
    }
  },

  isRegexValid(queryParams) {
    try {
      buildRegex(queryParams)
      return true
    }
    catch (err) {
      // Range error is thrown if search is an empty string. We return true
      // here because empty strings *are* valid (they generate /(?:)/) and
      // disabling the search should be handled by `ui.toggleDisableable`.
      if (err instanceof RangeError) {
        return true
      }
      return false
    }
  },

  deepSearch() {
    const queryParams = manageState.readState()
    if (queryParams.isDeep) {
      this.submitQuery(queryParams)
    }
  },

  downloadCsv() {
    const queryParams = manageState.readState()
    messageContent({ message: "download_shallow_csv", queryParams })
  },

  changeHighlight(direction) {
    messageContent({
      message: "change_highlight",
      direction,
    })
  },

  submitQuery(queryParams) {
    messageContent({
      message: "submit_query",
      queryParams,
    })
  },

  clearState() {
    const state = manageState.clearState()
    ui.setUiState(state)
    messageContent({ message: "clear_marks" })
  },
}
