let events = [
  { started_at: new Date(2019, 0, 1, 10, 0) },
  { started_at: new Date(2019, 0, 1, 10, 30) },
  { started_at: new Date(2019, 0, 1, 11, 0) },
  { started_at: new Date(2019, 0, 1, 11, 0) },
  { started_at: new Date(2019, 0, 1, 11, 30) },
  { started_at: new Date(2019, 0, 1, 12, 30) },
  { started_at: new Date(2019, 0, 1, 14, 0) },
  { started_at: new Date(2019, 0, 1, 14, 30) },
  { started_at: new Date(2019, 0, 1, 15, 0) },
  { started_at: new Date(2019, 0, 1, 15, 0) },
  { started_at: new Date(2019, 0, 1, 15, 30) }
]


events = events.map((e, i) => {
  const d = new Date(e.started_at)
  d.setHours(d.getHours() + 1)
  return {
    ...e,
    title: 'Event ' + i,
    ended_at: d
  }
})

// console.log(events)

let index = 0
let maxX = 0
for (let i = 0; i < events.length; i++) {
  console.log('##', index, i)
  const e = events[i]
  const targets = events.slice(index, i)
  if (!targets.length) {
    e.x = 0
  } else {
    const xs = targets.reduce((carry, p) => {
      if (e.started_at >= p.started_at && e.started_at < p.ended_at) {
        return [...carry, p.x]
      }
      return carry
    }, [])

    let minX = xs.length
    for (let j = 0; j < xs.length; j++) {
      if (!xs.includes(j)) {
        minX = j
        break
      }
    }

    if (minX > maxX) {
      maxX = minX
    }

    e.x = minX
  }

  if (i === events.length - 1 || e.ended_at <= events[i + 1].started_at) {
    for (let j = index; j <= i; j++) {
      events[j].w = 1 / (maxX + 1)
    }
    index = i + 1
    maxX = 0
  }
}

console.log(events)
