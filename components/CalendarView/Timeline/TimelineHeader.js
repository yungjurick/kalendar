import { format } from 'date-fns'
import React from 'react'
import { sortEventBlocks } from '../../../utils/helpers'
import { CalendarViewTypes } from '../../../utils/types'
import TimelineBlock from './TimelineBlock'

const TimelineHeader = ({
  dates = [],
  wholeDayEvents = {},
  calendarViewType
}, ref) => {
  console.log(wholeDayEvents, calendarViewType)

  const hasMultidayEvents = (wholeDayEvents, calendarViewType) => {
    switch (calendarViewType) {
      case CalendarViewTypes.DAY_VIEW: {
        return wholeDayEvents[0].length > 0
      }

      case CalendarViewTypes.WEEK_VIEW: {
        return (Object.keys(wholeDayEvents)
          .reduce((acc, cur) => {
            acc += wholeDayEvents[cur]['events'].length
            return acc
          }, 0)
        ) > 0
      }

      default:
        return false
    }
  }

  const dayViewMultidayEvents = (wholeDayEvents) => {
    const sortedEvents = sortEventBlocks(wholeDayEvents[0], 'startDate')
    
    return sortedEvents.map((event, i) => (
      <TimelineBlock
        key={i}
        index={i}
        baseZIndex={1}
        event={event}
        isMultiday={true}
      />
    ))
  }

  const weekViewMultidayEvents = (wholeDayEvents) => {
    const sortedEventsByDay = []
    let sundayEvent;

    Object.keys(wholeDayEvents).forEach(key => {
      const { events: eventsArr, incomingRowsCount } = wholeDayEvents[key]

      if (Number(key) === 0) {
        sundayEvent = {
          incomingRowsCount,
          events: sortEventBlocks(
            eventsArr,
            'duration'
          )
        }
      } else {
        sortedEventsByDay.push({
          incomingRowsCount,
          events: sortEventBlocks(
            eventsArr,
            'duration'
          )
        })
      }
    })

    sortedEventsByDay.push(sundayEvent)
    
    return sortedEventsByDay.map(({
      events,
      incomingRowsCount
    }, i) => (
      <div
        key={`day-${i}`}
        className="flex-1"
      >
        {
          Array(incomingRowsCount).fill().map(r =>
            <div
              key={i}
              style={{
                height: 22
              }}
              className="relative"
            />
          )
        }
        {
          events.map((event, i) =>
            <div
              key={i}
              style={{
                height: 22,
                width: `calc(100% + (100% * ${event.duration}) - 0.5rem)`
              }}
              className="relative"
            >
              <div
                className="absolute min-w-full"
              >
                <TimelineBlock
                  index={i}
                  baseZIndex={1}
                  event={event}
                  isMultiday={true}
                />
              </div>
            </div>
          )
        }
      </div>
    ))
  }

  return (
    <div
      ref={ref}
      className="flex flex-col"
    >
      <div className="flex justify-between w-full pl-14">
        {
          dates.map((date, i) => {
            return (
              <div
                key={i}
                className={`
                  flex flex-col items-center justify-start
                  ${dates.length > 1 ? 'flex-1' : ''}
                  ${dates.length === 1 ? 'pl-3' : ''}
                `}
              >
                <span className="flex items-center justify-center h-8 mt-2 font-medium tracking-widest text-gray-600 text-xxs">
                  {format(new Date(date), 'EEE').toUpperCase()}
                </span>
                <span className="flex items-center justify-center text-2xl tracking-wider text-gray-700 w-11">
                  {format(new Date(date), 'd')}
                </span>
              </div>
            )
          })
        }
      </div>
      <div className="flex">
        <div className="flex items-end justify-start text-gray-500 text-xxs">
          <div className="flex items-end justify-between min-h-0 min-w-56">
            <span>
              {format(new Date(), 'z')}
            </span>
            <div className="relative w-2 border-b"/>
          </div>
        </div>
        <div
          className={`
            w-full pb-1 border-b border-l
            ${hasMultidayEvents(wholeDayEvents, calendarViewType) && 'mt-4'}
          `}
        >
          {/* Whole Day Events */}
          {
            calendarViewType === CalendarViewTypes.DAY_VIEW
            ? dayViewMultidayEvents(wholeDayEvents)
            : (
              <div className="flex justify-between">
                {weekViewMultidayEvents(wholeDayEvents)}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default React.forwardRef(TimelineHeader)