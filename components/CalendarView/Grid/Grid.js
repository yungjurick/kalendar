import { useSelector } from 'react-redux'
import CalendarViewGridItem from './GridItem'

const CalendarViewGrid = () => {
  const { monthViewEvents } = useSelector(state => state.calendar)

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

  return (
    <div className="grid w-full h-full grid-cols-7 bg-gray-200 border-l auto-rows-fr gap-x-px gap-y-px">
      {
        viewGridItems(monthViewEvents).flat()
      }
    </div>
  )
}

export default CalendarViewGrid