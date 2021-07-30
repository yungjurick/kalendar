import { format, getMonth, isSameDay, set } from 'date-fns'
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import CalendarViewGridItemMultiEvent from './GridItemMultiEvent'
import CalendarViewGridItemSingleEvent from './GridItemSingleEvent'

const CalendarViewGridItem = ({
  index,
  month,
  date,
  events
}) => {
  const { targetDate } = useSelector(state => state.calendarSetting)
  const gridEventContainerRef = useRef(null);
  const today = new Date()

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
        <div className={`
          my-1.5 py-0.5 px-1 flex items-center justify-center
          ${
            isSameDay(today, set(new Date(), { month, date }))
            ? 'rounded-full bg-blue-500 text-white font-normal'
            : month === getMonth(new Date(targetDate)) ? 'text-gray-700 font-medium' : 'text-gray-400 font-medium'
          }
        `}>
          {date === 1 && format(set(new Date(), { month, date }), 'LLL')} {date}
        </div>
      </div>
      <div
        ref={gridEventContainerRef}
        className="relative flex-auto mr-2"
      >
        {
          events.map((e, i) => {
            if (e.duration > -1) {
              <CalendarViewGridItemMultiEvent
                key={i}
                data={e}
              />
            }
          })
        }
        {
          events.map((e, i) => {
            if (e.duration === -1) {
              return (
                <CalendarViewGridItemSingleEvent
                  key={i}
                  data={e}
                />
              )
            }
          })
        }
      </div>
    </div>
  )
}

export default CalendarViewGridItem