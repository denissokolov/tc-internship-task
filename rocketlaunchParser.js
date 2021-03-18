const launches = []

const currentYear = (new Date).getFullYear()
const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function getFirstMatch(source, regExp) {
  const match = source.match(regExp)
  return match != null ? match[0] : null
}

document.querySelectorAll('.launch').forEach(el => {
  if (el.classList.contains('filtered_launch')) {
    return
  }

  const launchDate = el.querySelector('.launch_date').innerText.trim()
  let year = getFirstMatch(launchDate, /[0-9]{4}/)
  if (year != null && parseInt(year, 10) !== currentYear) {
    return
  }

  const mission = el.querySelector('.mission_name').innerText.trim()
  if (mission.length === 0) {
    return
  }

  const monthMatch = getFirstMatch(launchDate, /[A-Z]{3}/)
  const dateMatch = monthMatch != null ? getFirstMatch(launchDate, /( [0-9]{2}$)|( [0-9]{2} )/) : null
  const quarterMatch = monthMatch == null ? getFirstMatch(launchDate, /Q[0-9]/) : null
  const months = monthMatch != null ? monthNames.indexOf(monthMatch) + 1 : null

  const time = el.querySelector('.rlt_time')
  const timeMatches = time != null ? time.innerText.trim().match(/[0-9]{2}/g) : null

  launches.push({
    mission: mission,
    launch: {
      years: currentYear,
      months: months,
      date: dateMatch != null ? parseInt(dateMatch, 10) : null,
      hours: timeMatches != null ? (parseInt(timeMatches[0], 10) + (time.innerText.includes('PM') ? 12 : 0)) : null,
      minutes: timeMatches != null ? parseInt(timeMatches[1], 10) : null,
      quarter: months != null
        ? Math.ceil(months / 3)
        : (quarterMatch != null ? parseInt(quarterMatch.replace('Q', ''), 10) : null),
    },
    vehicle: el.querySelector('.rlt-vehicle').textContent.trim(),
    location: [...el.querySelector('.rlt-location').childNodes]
      .find(child => child.nodeType === Node.TEXT_NODE).textContent.trim(),
  })
})

// console.log(launches)
JSON.stringify(launches, null, 2)
