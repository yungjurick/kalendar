import { endOfDay, endOfMonth, endOfWeek, endOfYear, getDaysInMonth, getMonth, startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns'
import { CalendarViewTypes } from './types'

export const getBaseDayViewEvents = () => {
  const hours = Array(24).fill()
    .map((v, i) => i)
    .reduce((acc, cur) => {
      acc[cur] = {
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
  const numberOfDays = getDaysInMonth(targetDate);

  const monthStart = startOfMonth(new Date(targetDate)); 
  const monthEnd = endOfMonth(new Date(targetDate));

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
    [getMonth(targetDate)]: inner,
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