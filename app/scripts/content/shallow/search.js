import $ from "jquery"
import findAndReplaceDomText from "findandreplacedomtext"

import buildRegex from "../../shared/buildRegex"
import isInViewport from "./isInViewport"
import scrollToElement from "./scrollToElement"

import groupBy from "./groupBy"
$.fn.groupBy = groupBy

export default function search(queryParams, sendResponse, $elem = $("body")) {
  const regex = buildRegex(queryParams)
  const reverter = findAndReplaceDomText($elem[0], {
    find: regex,
    replace: createHighlight,
    preset: "prose",
  })

  const groups = $(".deepSearch-highlight")
    .groupBy("data-highlight-index")
    .filter(allAreVisible)

  // When searching we give deference to results already in your viewport,
  // which is the same behavior as in the default chrome search.
  const $firstInViewport = groups.filter(allInViewport)[0]
  const currentIndex =
    $firstInViewport ? groups.indexOf($firstInViewport) : 0
  const $current = groups[currentIndex]

  sendResponse({
    label: `${Math.min(currentIndex + 1, groups.length)} of ${groups.length}`,
  })

  global.deepSearch.set("type", "shallow")
  global.deepSearch.set("matches", groups)
  global.deepSearch.set("currentIndex", currentIndex)
  global.deepSearch.set("reverter", reverter)

  $current.addClass("deepSearch-current-highlight")
  scrollToElement($current)
}

function createHighlight(portion, match) {
  var wrapped = document.createElement("span")
  wrapped.setAttribute("class", "deepSearch-highlight")
  wrapped.setAttribute("data-highlight-index", match.index)
  wrapped.appendChild(document.createTextNode(portion.text))
  return wrapped
}

function allInViewport($group) {
  return $group.toArray().every(isInViewport)
}

function allAreVisible($elements) {
  return $elements.toArray().every(element =>
    // This is what `$element.is(":visible")` does, but is faster without
    // the overhead of jquery calls.
    element.offsetWidth !== 0 && element.offsetHeight !== 0
  )
}
