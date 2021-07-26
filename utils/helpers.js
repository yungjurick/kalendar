export const getBaseDayViewEvents = () => {
  const baseMinuteSegment = {
    events: [],
    startColIndex: 0,
    colCount: 1,
    baseZIndex: 1
  }

  const hours = Array(24).fill()
    .map((v, i) => i)
    .reduce((acc, cur) => {
      acc[cur] = { ...baseMinuteSegment }
      return acc
    }, {})

  return {
    wholeDayEvents: [],
    hours
  }
}

export const getBaseWeekViewEvents = () => {
  const { hours } = getBaseDayViewEvents();
  const weekArray = Array(7).fill()
    .map((v, i) => i)

  const days = weekArray
    .reduce((acc, cur) => {
      acc[cur] = { ...hours }
      return acc
    }, {})
  
  const wholeDayEventsByDay = weekArray
    .reduce((acc, cur) => {
      acc[cur] = []
      return acc
    }, {})

  return {
    wholeDayEventsByDay,
    days
  }
}

export const getBaseMonthViewEvents = () => {
  const dateArray = Array(31).fill()
    .map((v, i) => i + 1)

  const inner = dateArray
    .reduce((acc, cur) => {
      acc[cur] = []
      return acc
    }, {})

  return {
    inner
  }
}