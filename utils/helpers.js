import { addDays, closestTo, endOfDay, endOfMonth, endOfWeek, endOfYear, getDate, getDaysInMonth, getHours, getMinutes, getMonth, set, startOfDay, startOfMonth, startOfWeek, startOfYear, subDays } from 'date-fns'
import { CalendarViewTypes, EventRepeatTypes, ThemeColorTypes } from './types'

export const colorLookup = {
  [ThemeColorTypes.RED]: 'bg-red-500',
  [ThemeColorTypes.GREEN]: 'bg-green-500',
  [ThemeColorTypes.GOLD]: 'bg-gold-3-500',
  [ThemeColorTypes.BLUE]: 'bg-blue-500',
  [ThemeColorTypes.CYAN]: 'bg-cyan-7-500',
  [ThemeColorTypes.PURPLE]: 'bg-purple-500',
  [ThemeColorTypes.BROWN]: 'bg-brown-1-500',
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

  console.log(hours);

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
      acc[cur] = []
      return acc
    }, {})
  
  console.log(days);
  return {
    wholeDayEvents,
    days
  }
}

const getMonthOuterRangeContainer = (start, end) => {
	const container = {}
	for (let i = getDate(start); i < getDate(end) + 1; i++) {
		container[i] = [];
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
      acc[cur] = []
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
	const ZERO = set(date, { minutes: 15 })
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