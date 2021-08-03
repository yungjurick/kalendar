import { format, set } from 'date-fns'
import { useRouter } from 'next/router'
import React from 'react'
import { useDispatch } from 'react-redux'
import { setTargetDate } from '../../../reducers/calendar/calendarSettingSlice'
import { getUpdatedEventBlocksWithPlacement, sortEventBlocks } from '../../../utils/helpers'
import { CalendarViewTypes } from '../../../utils/types'
import TimelineBlock from './TimelineBlock'

const TimelineHeader = ({
  dates = [],
  wholeDayEvents = {0: []},
  calendarViewType,
  onClickTimelineBlock
}, ref) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const navigateToDay = (date) => {
    if (dates.length > 1) {
      router.push('/calendar/day')
      dispatch(setTargetDate(new Date(date).toString()))
    }
  }

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
    
    return (
      sortedEvents.map((event, i) => (
        <div key={i} className={`${i > 0 ? 'mt-0.5' : ''}`}>
          <TimelineBlock
            index={i}
            baseZIndex={1}
            event={event}
            isMultiday={true}
            onClickTimelineBlock={onClickTimelineBlock}
          />
        </div>
      ))
    )
  }

  const weekViewMultidayEvents = (wholeDayEvents) => {
    const sortedEventsByDay = []
    
    if (Object.keys(wholeDayEvents).length > 0) {
      let sundayEvent;

      Object.keys(wholeDayEvents).forEach(key => {
        const { events: eventsArr, incomingRowsMatrix } = wholeDayEvents[key]
        
        if (Number(key) === 0) {
          sundayEvent = getUpdatedEventBlocksWithPlacement(
            eventsArr,
            incomingRowsMatrix
          )
        } else {
          sortedEventsByDay.push(
            getUpdatedEventBlocksWithPlacement(
              eventsArr,
              incomingRowsMatrix
            )
          )
        }
      })

      sortedEventsByDay.push(sundayEvent)
    }
    
    return sortedEventsByDay.map((events, i) => (
      <div
        key={`day-${i}`}
        className="flex-1"
      >
        {
          events.map((event, j) => {
            if (event.isEmpty) {
              return (
                <div
                  key={`empty-${i}-${j}`}
                  style={{
                    height: 22
                  }}
                  className={`
                    relative
                    ${j > 0 ? 'mt-0.5' : ''}
                  `}
                />
              )
            } else {
              return (
                <div
                  key={`event-${i}-${j}`}
                  style={{
                    height: 22,
                    width: `calc(100% + (100% * ${event.duration}) - 0.5rem)`
                  }}
                  className={`relative ${j > 0 ? 'mt-0.5' : ''}`}
                >
                  <div
                    className="absolute min-w-full"
                  >
                    <TimelineBlock
                      index={j}
                      baseZIndex={1}
                      event={event}
                      isMultiday={true}
                      onClickTimelineBlock={onClickTimelineBlock}
                    />
                  </div>
                </div>
              )
            }
          })
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
                <span
                  className={`
                    flex items-center justify-center text-2xl transition tracking-wider text-gray-700 -mt-1 w-10 h-10
                    ${dates.length > 1 ? 'hover:bg-gray-100 rounded-full cursor-pointer' : ''}
                  `}
                  onClick={() => navigateToDay(date)}
                >
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
            ${hasMultidayEvents(wholeDayEvents, calendarViewType) && 'mt-3'}
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