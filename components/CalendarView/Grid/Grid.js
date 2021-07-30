import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CalendarViewGridItem from './GridItem'
import { debounce } from 'lodash'
import { addMonths, subMonths } from 'date-fns'
import { setTargetDate } from '../../../reducers/calendar/calendarSettingSlice'

const CalendarViewGrid = () => {
  const dispatch = useDispatch()
  const { monthViewEvents } = useSelector(state => state.calendar)
  const { targetDate } = useSelector(state => state.calendarSetting)

  const viewGridItems = (eventContainer) => {
    let dateCount = 0;
    const items = [];

    Object.keys(eventContainer).forEach(monthKey => {
      Object.keys(eventContainer[monthKey]).forEach(dateKey => {
        items.push(
          (
            <CalendarViewGridItem
              key={`${monthKey}-${dateKey}`}
              index={dateCount}
              month={Number(monthKey)}
              date={Number(dateKey)}
              events={eventContainer[monthKey][dateKey]}
            />
          )
        )
        dateCount++
      })
    })

    return items
  }

  const onWheel = e => {
    if (e.deltaY > 0) {
      dispatch(
        setTargetDate(addMonths(new Date(targetDate), 1).toString())
      )
    } else if (e.deltaY < 0) {
      dispatch(
        setTargetDate(subMonths(new Date(targetDate), 1).toString())
      )
    }
  }

  const onThrottledWheel = useMemo(() => debounce(onWheel, 100), [targetDate])

  return (
    <div
      onWheel={onThrottledWheel}
      className="grid w-full h-full grid-cols-7 bg-gray-200 border-l auto-rows-fr gap-x-px gap-y-px"
    >
      {
        viewGridItems(monthViewEvents).flat()
      }
    </div>
  )
}

export default CalendarViewGrid