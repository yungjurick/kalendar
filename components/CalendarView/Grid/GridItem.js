import { format, getMonth, isSameDay, set } from 'date-fns'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setTargetDate } from '../../../reducers/calendar/calendarSettingSlice'
import CalendarViewGridItemMultiEvent from './GridItemMultiEvent'
import CalendarViewGridItemSingleEvent from './GridItemSingleEvent'

const CalendarViewGridItem = ({
  index,
  hoveredEventUid,
  setHoveredEventUid,
  targetDate,
  month,
  date,
  events
}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const gridEventContainerRef = useRef(null);
  const [gridEventContainerHeight, setGridEventContainerHeight] = useState(100)
  const today = new Date()

  useEffect(() => {
    if (gridEventContainerRef && gridEventContainerRef.current) {
      const height = gridEventContainerRef.current.getBoundingClientRect().height
      setGridEventContainerHeight(height)
    }
  }, [gridEventContainerRef])

  const navigateToDate = () => {
    router.push('/calendar/day')
    dispatch(setTargetDate(set(new Date(), { month, date }).toString()))
  }

  const gridItemEvents = (events, containerHeight) => {
    const maxNumOfShowingEvents = Math.floor(containerHeight / 23) - 2

    return events
    .slice(0, maxNumOfShowingEvents)
    .map((e, index) => {
      if (e.isEmpty) {
        return(
          <div
            key={`empty-${index}`}
            style={{
              height: 22
            }}
            className={`
              relative
              ${index > 0 ? 'mt-0.5' : ''}
            `}
          />
        )
      } else {
        if (e.duration > -1) {
          return (
            <div
              key={e.eventUid}
              onMouseOver={() => setHoveredEventUid(e.eventUid)}
              onMouseLeave={() => setHoveredEventUid('')}
            >
              <CalendarViewGridItemMultiEvent
                index={index}
                data={e}
                isHovered={e.eventUid === hoveredEventUid}
              />
            </div>
          )
        } else {
          return (
            <div
              key={e.eventUid}
            >
              <CalendarViewGridItemSingleEvent
                index={index}
                data={e}
              />
            </div>
          )
        }
      }
    })
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Item Header */}
      <div className="flex flex-col items-center text-xs">
        {
          index < 7 &&
          <p className="mt-2 text-xs antialiased font-medium tracking-tight text-gray-500">
            {format(set(new Date(), { month, date }), 'EEE').toUpperCase()}
          </p>
        }
        <div
          className={`
            my-1.5 py-0.5 px-2 flex items-center justify-center transition cursor-pointer
            hover:bg-gray-100 rounded-full
            ${
              isSameDay(today, set(new Date(), { month, date }))
              ? 'bg-blue-500 text-white font-normal hover:bg-blue-300'
              : month === getMonth(new Date(targetDate)) ? 'text-gray-700 font-medium hover:bg-gray-100' : 'hover:bg-gray-100 text-gray-400 font-medium'
            }
          `}
          onClick={() => navigateToDate()}
        >
          {date === 1 && format(set(new Date(), { month, date }), 'LLL')} {date}
        </div>
      </div>
      <div
        ref={gridEventContainerRef}
        className="relative flex-auto"
      >
        {
          gridItemEvents(events, gridEventContainerHeight)
        }
        {
          (Math.floor(gridEventContainerHeight / 23) - 2) < events.length &&
          <div
            className="px-2 py-1 mt-1 mr-2 text-xs font-semibold transition cursor-pointer rounded-r-md hover:bg-gray-100"
          >
            <span>{events.length - (Math.floor(gridEventContainerHeight / 23) - 2)} more</span>
          </div>
        }
      </div>
    </div>
  )
}

export default CalendarViewGridItem