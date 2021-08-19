import { addDays, closestTo, eachHourOfInterval, endOfDay, endOfMonth, endOfWeek, endOfYear, getDate, getDaysInMonth, getHours, getMinutes, getMonth, set, startOfDay, startOfMonth, startOfWeek, startOfYear, subDays } from 'date-fns'
import { uuid } from 'uuidv4'
import { CalendarViewTypes, EventRepeatTypes, MINUTE_SEGMENT_INDEX, MINUTE_SEGMENT_KEYS, ThemeColorTypes } from './types'

export const colorLookup = {
  [ThemeColorTypes.RED]: 'bg-red-500',
  [ThemeColorTypes.GREEN]: 'bg-green-500',
  [ThemeColorTypes.GOLD]: 'bg-gold3-500',
  [ThemeColorTypes.BLUE]: 'bg-blue-500',
  [ThemeColorTypes.CYAN]: 'bg-cyan7-500',
  [ThemeColorTypes.PURPLE]: 'bg-purple-500',
  [ThemeColorTypes.BROWN]: 'bg-brown1-500',
}

export const repeatTypeStringLookup = {
  [-1]: 'Does not repeat',
  [EventRepeatTypes.DAILY]: 'Daily',
  [EventRepeatTypes.WEEKLY]: 'Weekly',
  [EventRepeatTypes.BI_WEEKLY]: 'Bi-weekly',
  [EventRepeatTypes.MONTHLY]: 'Monthly',
  [EventRepeatTypes.WEEK_DAYS]: 'Week days',
}

export const isValidTime = (strValue) => {
  const trimmed = strValue.trim()
  const split = trimmed.split(':')

  if (split.length !== 2) {
    return [false, 0, 0]
  }

  const hour = Number(split[0])
  const minutes = Number(split[1])

  if (isNaN(hour) || isNaN(minutes)) {
    return [false, 0, 0]
  }

  if (hour < 0 || hour > 23) {
    return [false, 0, 0]
  } else if (minutes < 0 || minutes > 59) {
    return [false, 0, 0]
  }

  return [true, hour, minutes]
}

export const sortEventBlocks = (events, key, isAscending = true) => {
  const compFunc = (a, b, isAscending) => {
    if (isAscending) {
      return a - b
    } else {
      return b - a
    }
  }

  return events
    .slice()
    .sort((a, b) => {
      if (key === 'startDate' || key === 'endDate' || key === 'createdAt') {
        return compFunc(new Date(a[key]), new Date(b[key]), isAscending)
      } else {
        if (a[key] === b[key]) {
          return compFunc(new Date(a['startDate' ]), new Date(b['startDate' ]), isAscending)
        } else {
          return compFunc(a[key], b[key], isAscending)
        }
      }
    })
}

export const getBaseDayViewEvents = () => {
  const hours = Array(24).fill()
    .map((v, i) => i)
    .reduce((acc, cur) => {
      const segment = {
        0: {
          events: [],
          startColIndex: 0,
          colCount: 1,
          baseZIndex: 1
        },
        15: {
          events: [],
          startColIndex: 0,
          colCount: 1,
          baseZIndex: 1
        },
        30: {
          events: [],
          startColIndex: 0,
          colCount: 1,
          baseZIndex: 1
        },
        45: {
          events: [],
          startColIndex: 0,
          colCount: 1,
          baseZIndex: 1
        },
      }
      acc[cur] = segment
      return acc
    }, {})

  return {
    wholeDayEvents: [],
    hours
  }
}

export const getBaseWeekViewEvents = () => {
  const weekArray = Array(7).fill()
    .map((v, i) => i)

  const days = weekArray
    .reduce((acc, cur) => {
      const { hours } = getBaseDayViewEvents();
      acc[cur] = { ...hours }
      return acc
    }, {})
  
  const wholeDayEvents = weekArray
    .reduce((acc, cur) => {
      acc[cur] = {
        incomingRowsMatrix: {},
        events: []
      }
      return acc
    }, {})
  
  return {
    wholeDayEvents,
    days
  }
}

export const getUpdatedEventBlocksWithPlacement = (events, incomingRowsMatrix) => {
  const list = []
  let eventIndex = 0
  let matrixIndex = 0

  while (eventIndex < events.length) {
    if (matrixIndex in incomingRowsMatrix) {
      list.push({
        isEmpty: true
      })
    } else {
      list.push({
        ...events[eventIndex],
        isEmpty: false
      })
      eventIndex++
    }

    matrixIndex++
  }
  
  return list
}

export const calculateIncomingRowMatrix = (eventsByDay, isWeek = false) => {
  const container = {...eventsByDay}

  let baseIncomingRowsMatrix = {}
  let count = 0
  let rowIndex = 0

  let keys = Object.keys(container)

  if (isWeek) {
    const updated = keys.slice()
    const temp = updated.shift()
    updated.push(temp)

    keys = updated
  }

  keys.forEach(day => {
    // Reset incoming rows in every eigth iteration
    if (count == 7) {
      count = 0
      baseIncomingRowsMatrix = {}
    }

    // Sort the array by duration
    container[day] = {
      ...container[day],
      events: sortEventBlocks(container[day]['events'], 'duration', false)
    }

    const deletedKeys = []

    Object.keys(baseIncomingRowsMatrix)
      .forEach(v => {
        if (baseIncomingRowsMatrix[v] === 0) {
          deletedKeys.push(Number(v))
          delete baseIncomingRowsMatrix[v]
        }
      })
    
    if (deletedKeys.length > 0) {
      rowIndex = Math.min(...deletedKeys)
    }

    // Set current size of arr as incoming rows count
    container[day] = {
      ...container[day],
      incomingRowsMatrix: { ...baseIncomingRowsMatrix }
    }

    // Decrement all duration by 1
    Object.keys(baseIncomingRowsMatrix)
      .forEach(v => baseIncomingRowsMatrix[v] -= 1)


    // Loop through events:
    // if the duration > 0, insert multiday event duration to incoming rows

    container[day]['events'].forEach(e => {
      if (e.duration > 0) {
        baseIncomingRowsMatrix[rowIndex] = e.duration
        rowIndex += 1

        while (rowIndex in baseIncomingRowsMatrix) {
          rowIndex += 1
        }
      }
    })
  })

  return container
}

const getMonthOuterRangeContainer = (start, end) => {
	const container = {}
	for (let i = getDate(start); i < getDate(end) + 1; i++) {
		container[i] = {
      incomingRowsMatrix: {},
      events: []
    };
	}

	return container;
}

// After a precheck for left and right outer ranges,
// let's assume that both outer ranges exist.

const getMonthOuterRangeDates = (targetStartDate, targetEndDate) => {
	const leftOuterStart = startOfWeek(targetStartDate, { weekStartsOn: 1 })
	const leftOuterEnd = subDays(targetStartDate, 1);
	const rightOuterStart = addDays(targetEndDate, 1);
	const rightOuterEnd = endOfWeek(targetEndDate, { weekStartsOn: 1 })

	const leftOuterContainer = getMonthOuterRangeContainer(leftOuterStart, leftOuterEnd);
	const rightOuterContainer = getMonthOuterRangeContainer(rightOuterStart, rightOuterEnd);

	return [
    {
      leftOuterStart,
      leftOuterEnd,
      leftOuterContainer
    },
    {
      rightOuterStart,
      rightOuterEnd,
      rightOuterContainer
    }
  ]
}

export const getBaseMonthViewEvents = (targetDate) => {
  const target = new Date(targetDate);
  const numberOfDays = getDaysInMonth(target);

  const monthStart = startOfMonth(target); 
  const monthEnd = endOfMonth(target);

  const [left, right] = getMonthOuterRangeDates(monthStart, monthEnd)

  const dateArray = Array(numberOfDays).fill()
    .map((v, i) => i + 1)

  const inner = dateArray
    .reduce((acc, cur) => {
      acc[cur] = {
        incomingRowsMatrix: {},
        events: []
      }
      return acc
    }, {})

  return {
    [getMonth(left.leftOuterStart)]: left.leftOuterContainer,
    [getMonth(target)]: inner,
    [getMonth(right.rightOuterEnd)]: right.rightOuterContainer,
  }
}

export const getDateRange = (calendarViewType, targetDate) => {
  const target = new Date(targetDate);

  switch(calendarViewType) {
    case CalendarViewTypes.DAY_VIEW: {
      return [
        startOfDay(target),
        endOfDay(target)
      ]
    }

    case CalendarViewTypes.WEEK_VIEW: {
      const weekStart = startOfWeek(target, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(target, { weekStartsOn: 1 })
      return [
        weekStart,
        endOfDay(weekEnd)
      ]
    }

    case CalendarViewTypes.MONTH_VIEW: {
      const monthStart = startOfMonth(target);
      const monthEnd = endOfMonth(target);
      return [
        startOfWeek(monthStart, { weekStartsOn: 1 }),
        endOfWeek(endOfDay(monthEnd), { weekStartsOn: 1 })
      ]
    }

    case CalendarViewTypes.YEAR_VIEW: {
      const yearStart = startOfYear(target);
      const yearEnd = endOfYear(target);
      return [
        yearStart,
        endOfDay(yearEnd)
      ]
    }
  }
}

export const getClosestIndexForDayViewEvents = (date) => {
	const ZERO = set(date, { minutes: 0 })
	const FIFTEEN = set(date, { minutes: 15 })
	const THIRTY = set(date, { minutes: 30 })
	const FOURTYFIVE = set(date, { minutes: 45 })

	const closest = closestTo(date, [
		ZERO,
		FIFTEEN,
		THIRTY,
		FOURTYFIVE
	])

	return [getHours(date), getMinutes(closest)];
}

export const findEventCoverage = (event) => {
	// Get Hour Intervals
	const coveredHours = eachHourOfInterval({
	  start: new Date(event.startDate),
	  end: new Date(event.endDate)
	});	

	// Get Start/End Date Minute Index
	const startDateMinuteKey = getClosestIndexForDayViewEvents(new Date(event.startDate))[1];
	const endDateMinuteKey = getClosestIndexForDayViewEvents(new Date(event.endDate))[1];

	// Covers only one hour block from start date
	if (coveredHours.length === 1) {

		const startSeg = MINUTE_SEGMENT_INDEX[startDateMinuteKey];
		
		// If startSeg and endSeg are the same, add 1 to endSeg in order to get startSeg slice
		const endSeg = startSeg === MINUTE_SEGMENT_INDEX[endDateMinuteKey]
			? MINUTE_SEGMENT_INDEX[endDateMinuteKey] + 1
			: MINUTE_SEGMENT_INDEX[endDateMinuteKey]

		return {
			[coveredHours[0].toString()]: MINUTE_SEGMENT_KEYS
        .slice(
          startSeg,
          endSeg
        )
		}
	}
	
	// Convers more than one hour
	else {
		return coveredHours

			// Loop through hours
			.map((hour, index) => {

				if (index === 0) {
					return {
						hour: hour.toString(),
						minuteSegments: MINUTE_SEGMENT_KEYS
              .slice(
                MINUTE_SEGMENT_INDEX[startDateMinuteKey]
              )
					}
				}
				
				// Last index may cover portion of the block,
				// so need to check with endDateMinuteKey
				if (index === coveredHours.length - 1) {
					const endSeg = MINUTE_SEGMENT_INDEX[endDateMinuteKey] === 0
						? MINUTE_SEGMENT_INDEX[endDateMinuteKey] + 1
						: MINUTE_SEGMENT_INDEX[endDateMinuteKey]					

					return {
						hour: hour.toString(),
						minuteSegments: MINUTE_SEGMENT_KEYS
              .slice(
                0,
                endSeg
              )
          }     
				}
				// Since it covers more than one hour, other index would cover whole
				else {
					return {
						hour: hour.toString(),
						minuteSegments: [...MINUTE_SEGMENT_KEYS]
					}
				}
			})
			
			// Combine as an object format
			.reduce((acc, cur) => {
				acc[cur.hour] = cur.minuteSegments;
				return acc;
			}, {})
	}
}

export const reduceCoverages = (coveragesArray) => {
	const reducedCoverage = {};

	coveragesArray.forEach(coverage => {
		const hourKeys = Object.keys(coverage);
	
		for (let i = 0; i < hourKeys.length; i++) {

      const hour = getHours(new Date(hourKeys[i]))
			
			// If hour does not exist in reducedCoverage, create a segment container object
			if (!(hour in reducedCoverage)) {
				reducedCoverage[hour] = {
					0: 0,
					15: 0,
					30: 0,
					45: 0
				}
			}
			
			const minuteSegments = coverage[hourKeys[i]];
			
			// Increment coverage for segment
			minuteSegments.forEach(segmentKey => {
				reducedCoverage[hour][segmentKey]++;
			})
		}
	})

	return reducedCoverage
}

export const calculateOverlap = (reduceCoverage, hoursObject) => {
	const coverageHours = Object.keys(reduceCoverage);
	
	coverageHours.forEach(hour => {
		const coverageMinuteSegments = Object.keys(reduceCoverage[hour]);
		coverageMinuteSegments.forEach(minute => {
			const coverageCount = reduceCoverage[hour][minute];
			const { events } = hoursObject[hour][minute];
			
			// If coverage count is larger than the events starting at a segment
			// It means that there is another event starting from before that overlaps
			if (events.length < coverageCount) {
				hoursObject[hour][minute]['colCount'] = (coverageCount - events.length) + 1
				hoursObject[hour][minute]['startColIndex'] = (coverageCount - events.length)
				hoursObject[hour][minute]['baseZIndex'] = (coverageCount - events.length)
			} 
		})
	})
}