import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CalendarViewGridItem from './GridItem'
import { debounce } from 'lodash'
import { addMonths, getMonth, subMonths } from 'date-fns'
import { setTargetDate } from '../../../reducers/calendar/calendarSettingSlice'
import { calculateIncomingRowMatrix, getUpdatedEventBlocksWithPlacement } from '../../../utils/helpers'

const CalendarViewGrid = () => {
  const dispatch = useDispatch()
  const { monthViewEvents } = useSelector(state => state.calendar)
  const { targetDate } = useSelector(state => state.calendarSetting)
  const [hoveredEventUid, setHoveredEventUid] = useState('')

  const convertMonthKey = (monthKey, targetDate) => {
    const curMonth = getMonth(new Date(targetDate))

    if (curMonth === 11 && Number(monthKey) === 0) {
      return 12
    }
    
    if (curMonth === 0) {
      if (Number(monthKey) === 0) {
        return 12
      }

      if (Number(monthKey) === 1) {
        return 13
      }
    }

    if (Number(monthKey) === 12) {
      return 0
    }

    if (Number(monthKey) === 13) {
      return 1
    }

    return monthKey
  }

  const viewGridItems = (eventContainer, targetDate) => {
    const flattenedContainer = {} 

    Object.keys(eventContainer).forEach(monthKey => {
      Object.keys(eventContainer[monthKey]).forEach(dateKey => {
        flattenedContainer[`${convertMonthKey(monthKey, targetDate)}-${dateKey}`] = eventContainer[monthKey][dateKey]
      })
    })

    const updatedContainer = calculateIncomingRowMatrix(flattenedContainer)

    let monthKeys = Object.keys(updatedContainer).sort((a, b) => {
      const splitA = a.split('-')
      const splitB = b.split('-')
      return splitA[0] - splitB[0]
    })

    return monthKeys
      .map((monthDateKey, index) => {
        const [month, date] = monthDateKey.split('-')

        return (
          <CalendarViewGridItem
            key={monthDateKey}
            targetDate={targetDate}
            index={index}
            month={Number(convertMonthKey(month, targetDate))}
            date={Number(date)}
            events={
              getUpdatedEventBlocksWithPlacement(
                updatedContainer[monthDateKey]['events'],
                updatedContainer[monthDateKey]['incomingRowsMatrix']
              )
            }
            hoveredEventUid={hoveredEventUid}
            setHoveredEventUid={setHoveredEventUid}
          />
        )
      })
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
        viewGridItems(monthViewEvents, targetDate)
      }
    </div>
  )
}

export default CalendarViewGrid