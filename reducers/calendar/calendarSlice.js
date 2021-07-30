import { createSlice } from '@reduxjs/toolkit';
import { isBefore, isWithinInterval, eachDayOfInterval, areIntervalsOverlapping, getHours, set, format, closestTo, getMinutes, getMonth, getDate, isWeekend, differenceInWeeks, isSameDay, differenceInMonths, getDay, isAfter, eachWeekOfInterval, intervalToDuration, endOfWeek, endOfDay } from 'date-fns';
import { calculateIncomingRowCount, getBaseDayViewEvents, getBaseMonthViewEvents, getBaseWeekViewEvents, getClosestIndexForDayViewEvents, getDateRange } from '../../utils/helpers';
import { CalendarViewTypes, EventRepeatTypes, RepeatChangesTypes } from '../../utils/types';

const initialState = {
  dayViewEvents: {},
  weekViewEvents: {},
  monthViewEvents: {},

  isCreateEventModalOpen: false,
  createEventBasis: {
    startDate: Date(),
    endDate: Date()
  }
}

const getBaseEventContainer = (calendarViewType, targetDate) => {
  switch (calendarViewType) {
    case CalendarViewTypes.DAY_VIEW: {
      return getBaseDayViewEvents();
    }

    case CalendarViewTypes.WEEK_VIEW: {
      return getBaseWeekViewEvents();
    }

    case CalendarViewTypes.MONTH_VIEW: {
      return getBaseMonthViewEvents(targetDate);
    }
  }
}

const getBaseEventBlock = (
  event,
  changes = {},
  start = null,
  end = null,
  duration = -1
) => {
  const {
    eventUid,
    eventCreatorUid,
    eventGroupUid,
    title,
    themeColor,
    createdAt,
    startDate,
    endDate
  } = event;

  return {
    eventUid,
    eventCreatorUid,
    eventGroupUid,
    startDate: start !== null ? start : startDate,
    endDate: end !== null ? end : endDate,
    title,
    themeColor,
    duration,
    createdAt,
    ...changes
  }
}

const getDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return eachDayOfInterval({ start, end }).length - 1;
}

const getMultidayEventBlocksForMonth = (events, rangeStart, rangeEnd) => {
	const processedEvents = [];

	events.forEach(event => {
    const originalStartDate = new Date(event.startDate);
    const originalEndDate = new Date(event.endDate);

		// Check if start date is within bounds
		const startDate = isBefore(startDate, rangeStart)
			? rangeStart
			: originalStartDate;
		
		// Check if end date is within bounds
		const endDate = isAfter(endDate, rangeEnd)
			? rangeEnd
			: originalEndDate;

		const eachWeekIntervals = eachWeekOfInterval({
			start: startDate,
			end: endDate
		}, { weekStartsOn: 1})
		
		// If the length is 1, then the endDate resides within the same week
		if (eachWeekIntervals.length === 1) {
			processedEvents.push(
        getBaseEventBlock(
          event,
          {},
          startDate.toString(),
          endDate.toString(),
          getDuration(startDate, endDate)
        )
      )

		// Else, loop the intervals and create event blocks
		} else {
			const MAX_DURATION = 6;
			eachWeekIntervals.forEach((interval, index) => {
				
				// Last index
				if (index === interval.length - 1) {
          processedEvents.push(
            getBaseEventBlock(
              event,
              {},
              interval.toString(),
              endDate.toString(),
              getDuration(interval, endDate)
            )
          )
	
				// First index starts with event start date
				} else if (index === 0) {
          const endOfTargetWeek = endOfDay(endOfWeek(startDate, { weekStartsOn: 1 }));

          processedEvents.push(
            getBaseEventBlock(
              event,
              {},
              startDate.toString(),
              endOfTargetWeek.toString(),
              getDuration(startDate, endOfTargetWeek)
            )
          )
	
				// Other indexes (excluding the last)
				} else {
          const endOfTargetWeek = endOfDay(endOfWeek(interval, { weekStartsOn: 1 }));

          processedEvents.push(
            getBaseEventBlock(
              event,
              {},
              interval.toString(),
              endOfTargetWeek.toString(),
              MAX_DURATION
            )
          )
				}
			})
    }
	})
	
	// Returns an array of EventBlocks that will be inserted into the monthViewContainer
	return processedEvents
}

const getRepeatedEventBlocks = (sourceEvent, eventGroupDetail, rangeStart, rangeEnd) => {
  console.log(eventGroupDetail)
  
  const intervalStart = isBefore(new Date(sourceEvent.startDate), rangeStart)
    ? rangeStart
    : new Date(sourceEvent.startDate)

  const rangeInterval = eachDayOfInterval({ start: intervalStart, end: rangeEnd })
  const { repeatChanges, repeatType } = eventGroupDetail;
  const eventBlockList = []

  // Loop through the days within the interval to create repeated blocks
  for (let i = 0; i < rangeInterval.length; i++) {
    const changeDateKey = format(rangeInterval[i], 'yyyy-MM-dd')
    let changePayload = {};

    // Check whether there is a change in date for repeated event
    if (changeDateKey in repeatChanges) {
      if (repeatChanges[changeDateKey].type === RepeatChangesTypes.DELETE) {
        continue
      } else {
        changePayload = { ...repeatChanges[changeDateKey].payload }
      }
    }

    const curMonth = getMonth(rangeInterval[i]);
    const curDate = getDate(rangeInterval[i]);

    const blockStart = set(new Date(sourceEvent.startDate), { month: curMonth, date: curDate })
    const blockEnd = set(new Date(sourceEvent.endDate), { month: curMonth, date: curDate })

    switch(repeatType) {
      case EventRepeatTypes.DAILY: {
        const eventBlock = getBaseEventBlock(
          sourceEvent,
          changePayload,
          blockStart.toString(),
          blockEnd.toString()
        )
        eventBlockList.push(eventBlock);
        break;
      }
      case EventRepeatTypes.WEEKLY: {
        const checkIsSameDay = isSameDay(rangeInterval[i], new Date(sourceEvent.startDate))
        const checkIsSameWeekDay = getDay(rangeInterval[i], new Date(sourceEvent.startDate))
        const checkDifferenceInWeeks = differenceInWeeks(rangeInterval, new Date(sourceEvent.startDate))

        if (
          checkIsSameDay || (checkIsSameWeekDay && checkDifferenceInWeeks > 0)
        ) {
          const eventBlock = getBaseEventBlock(
            sourceEvent,
            changePayload,
            blockStart.toString(),
            blockEnd.toString()
          )
          eventBlockList.push(eventBlock);
        }
        break;
      }
      case EventRepeatTypes.BI_WEEKLY: {
        const checkIsSameDay = isSameDay(rangeInterval[i], new Date(sourceEvent.startDate))
        const checkIsSameWeekDay = getDay(rangeInterval[i], new Date(sourceEvent.startDate))
        const checkDifferenceInWeeks = differenceInWeeks(rangeInterval, new Date(sourceEvent.startDate))
        
        if (
          checkIsSameDay || (checkIsSameWeekDay && (checkDifferenceInWeeks % 2 === 0))
        ) {
          const eventBlock = getBaseEventBlock(
            sourceEvent,
            changePayload,
            blockStart.toString(),
            blockEnd.toString()
          )
          eventBlockList.push(eventBlock);
        }
        break;
      }
      case EventRepeatTypes.MONTHLY: {
        const checkIsSameDay = isSameDay(rangeInterval[i], new Date(sourceEvent.startDate))
        const checkIsSameWeekDay = getDay(rangeInterval[i], new Date(sourceEvent.startDate))
        const checkDifferenceInMonths = differenceInMonths(rangeInterval, new Date(sourceEvent.startDate))
        
        if (
          checkIsSameDay || (checkIsSameWeekDay && checkDifferenceInMonths > 0)
        ) {
          const eventBlock = getBaseEventBlock(
            sourceEvent,
            changePayload,
            blockStart.toString(),
            blockEnd.toString()
          )
          eventBlockList.push(eventBlock);
        }
        break;
      }
      case EventRepeatTypes.WEEK_DAYS: {
        if (!isWeekend(rangeInterval[i])) {
          const eventBlock = getBaseEventBlock(
            sourceEvent,
            changePayload,
            blockStart.toString(),
            blockEnd.toString()
          )
          eventBlockList.push(eventBlock);
        }
        break;
      }
    }
  }

  return eventBlockList
}

const insertEventToDayViewContainer = (
  container,
  filteredEvents,
  targetDate,
  eventGroupDB
) => {
  console.log("Day View Container", container);
  console.log("Events", filteredEvents);
  console.log("eventGroupDB", eventGroupDB);

  const { single, repeated, multiday } = filteredEvents
  const [rangeStart, rangeEnd] = getDateRange(CalendarViewTypes.DAY_VIEW, targetDate);

  // Process Single Events
  single.forEach(e => {
    const [hour, minute] = getClosestIndexForDayViewEvents(new Date(e.startDate));
    const eventBlock = getBaseEventBlock(e)
    container['hours'][hour][minute]['events'].push(eventBlock);
  })
  // Process Multiday Events
  multiday.forEach(e => {
    const eventBlock = getBaseEventBlock(e)
    container['wholeDayEvents'].push(eventBlock);
  })

  // Process Repeated Events
  repeated.forEach(e => {
    const eventGroupDetail = eventGroupDB[e.eventGroupUid];
    const repeatedBlocks = getRepeatedEventBlocks(
      e,
      eventGroupDetail,
      rangeStart,
      rangeEnd
    )

    repeatedBlocks.forEach(block => {
      const [hour, minute] = getClosestIndexForDayViewEvents(new Date(block.startDate));
      container['hours'][hour][minute]['events'].push(block);
    })
  })

  console.log(container);
}

const insertEventToWeekViewContainer = (
  container,
  filteredEvents,
  targetDate,
  eventGroupDB
) => {
  console.log("Week View Container", container);
  console.log("Events", filteredEvents);
  console.log("eventGroupDB", eventGroupDB);

  const { single, repeated, multiday } = filteredEvents
  const [rangeStart, rangeEnd] = getDateRange(CalendarViewTypes.WEEK_VIEW, targetDate);

  // Process Single Events
  single.forEach(e => {
    const dayIndex = getDay(new Date(e.startDate))
    const [hour, minute] = getClosestIndexForDayViewEvents(new Date(e.startDate));
    const eventBlock = getBaseEventBlock(e)
    container['days'][dayIndex][hour][minute]['events'].push(eventBlock);
  })
  // Process Multiday Events
  multiday.forEach(e => {
    const dayIndex = getDay(new Date(e.startDate))
    const duration = getDuration(e.startDate, e.endDate);
    const eventBlock = getBaseEventBlock(
      e,
      {},
      null,
      null,
      duration
    )
    container['wholeDayEvents'][dayIndex]['events'].push(eventBlock);
  })

  // Process Repeated Events
  repeated.forEach(e => {
    const eventGroupDetail = eventGroupDB[e.eventGroupUid];
    const repeatedBlocks = getRepeatedEventBlocks(
      e,
      eventGroupDetail,
      rangeStart,
      rangeEnd
    )
    console.log('Repeated Blocks:', repeatedBlocks)
    repeatedBlocks.forEach(block => {
      const dayIndex = getDay(new Date(block.startDate))
      const [hour, minute] = getClosestIndexForDayViewEvents(new Date(block.startDate));
      container['days'][dayIndex][hour][minute]['events'].push(block);
    })
  })
}

const insertEventToMonthViewContainer = (container, filteredEvents, targetDate, eventGroupDB) => {
  console.log("Month View Container", container);
  console.log("Events", filteredEvents);
  console.log("eventGroupDB", eventGroupDB);

  const { single, repeated, multiday } = filteredEvents
  const [rangeStart, rangeEnd] = getDateRange(CalendarViewTypes.MONTH_VIEW, targetDate);

  // Process Single Events
  single.forEach(e => {
    const startDate = new Date(e.startDate);
    const monthIndex = getMonth(startDate)
    const dateIndex = getDate(startDate)

    const eventBlock = getBaseEventBlock(e)
    container[monthIndex][dateIndex].push(eventBlock);
  })

  // Process Multiday Events
  const multidayEventBlocks = getMultidayEventBlocksForMonth(multiday, rangeStart, rangeEnd)

  multidayEventBlocks.forEach(eb => {
    const startDate = new Date(eb.startDate);
    const monthIndex = getMonth(startDate)
    const dateIndex = getDate(startDate)

    container[monthIndex][dateIndex].push(eb);
  })

  // Process Repeated Events
  repeated.forEach(e => {
    const eventGroupDetail = eventGroupDB[e.eventGroupUid];
    const repeatedBlocks = getRepeatedEventBlocks(
      e,
      eventGroupDetail,
      rangeStart,
      rangeEnd
    )
    console.log('Repeated Blocks:', repeatedBlocks)
    repeatedBlocks.forEach(block => {
      const startDate = new Date(block.startDate);
      const monthIndex = getMonth(startDate)
      const dateIndex = getDate(startDate)

      container[monthIndex][dateIndex].push(block);
    })
  })
}

const filterEvents = (events, calendarViewType, targetDate) => {
  const [rangeStart, rangeEnd] = getDateRange(calendarViewType, targetDate);

  const filteredEvents = {
    single: [],
    multiday: [],
    repeated: []
  }

  events.forEach(e => {
    const eventStartDate = new Date(e.startDate);
    const eventEndDate = new Date(e.endDate);

    const isWithin = isWithinInterval(
      eventStartDate,
      {
        start: rangeStart,
        end: rangeEnd
      }
    )
    
    // Check if event is a repeated event
    if (e.eventGroupUid && isBefore(eventStartDate, rangeEnd)) {
      filteredEvents.repeated.push(e);

    // Check if event is a multiday event
    } else if (
      (
        e.isAllDay && isWithin
      ) || (
        eachDayOfInterval({ start: eventStartDate, end: eventEndDate }).length > 1 &&
        areIntervalsOverlapping(
          { start: eventStartDate, end: eventEndDate },
          { start: rangeStart, end: rangeEnd }
        )
      )
    ) {
      filteredEvents.multiday.push(e)

    // Check if event is a single event within date range
    } else if (isWithin) {
      filteredEvents.single.push(e)
    }
  })

  return filteredEvents
}

export const calendarSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    fetchEventsForCalendarType: (state, { payload }) => {
      const { userUid, calendarViewType, targetDate, db } = payload;
      const { userEventDB, eventDB, invitedDB, eventGroupDB } = db;

      const allEvents = [
        ...userEventDB[userUid].map(eUid => eventDB[eUid]),
        ...invitedDB[userUid]
      ]

      /*
        single, multiday, repeated
      */
      const filteredEvents = filterEvents(allEvents, calendarViewType, targetDate);
      const baseEventContainer = getBaseEventContainer(calendarViewType, targetDate)
      console.log("Filtered Events & Base Event Container", filteredEvents, baseEventContainer);

      switch(calendarViewType) {
        case CalendarViewTypes.DAY_VIEW: {
          insertEventToDayViewContainer(
            baseEventContainer,
            filteredEvents,
            targetDate,
            eventGroupDB
          )
          state.dayViewEvents = baseEventContainer
          break;
        }

        case CalendarViewTypes.WEEK_VIEW: {
          insertEventToWeekViewContainer(
            baseEventContainer,
            filteredEvents,
            targetDate,
            eventGroupDB
          )

          // Calculate incoming row count
          calculateIncomingRowCount(baseEventContainer['wholeDayEvents'])

          state.weekViewEvents = baseEventContainer
          break;
        }

        case CalendarViewTypes.MONTH_VIEW: {
          insertEventToMonthViewContainer(
            baseEventContainer,
            filteredEvents,
            targetDate,
            eventGroupDB
          )
          state.monthViewEvents = baseEventContainer
          break;
        }
      }

      console.log("Updated Container", baseEventContainer);
    },
    setCreateEventBasis: (state, action) => {
      state.createEventBasis = action.payload
    },
    setIsCreateEventModalOpen: (state, action) => {
      state.isCreateEventModalOpen = action.payload
    }
  }
})

export const {
  fetchEventsForCalendarType,
  setCreateEventBasis,
  setIsCreateEventModalOpen
} = calendarSlice.actions

export default calendarSlice.reducer