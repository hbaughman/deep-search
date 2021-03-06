import $ from 'jquery'

export default function setMark(href, matches) {
  var $link = $(`a[href='${href}']`)
  clearMarksFromLink($link)
  const marker = buildMarker(matches)
  $link.after(marker)
}

// If a link is on the page multiple times, it will (currently) be checked
// independently and results will be appended to the matching link *each*
// time. This hack causes any markers already appended to the link to be
// removed before one is re-added.
function clearMarksFromLink(link) {
  const selector = '.deepSearch-link-found, .deepSearch-link-not-found'
  link.each(function() {
    $(this).next(selector).remove()
  })
}

function buildMarker(matches) {
  if (matches) {
    const marker = $(
      `<span class='deepSearch-link${matches.length ? '' : '-not'}-found'>
      <span class='deepSearch-match-count'>${matchCount(matches)}</span>
      </span>`
    )
    return marker
  }
}

function matchCount(matches) {
  if (matches.length) {
    return ((matches.length < 10) ? matches.length : '+')
  }
  else {
    return '&times;'
  }
}
