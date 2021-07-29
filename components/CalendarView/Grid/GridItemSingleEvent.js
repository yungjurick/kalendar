import { format, isBefore, startOfDay } from 'date-fns'
import { colorLookup } from '../../../utils/helpers'

const CalendarViewGridItemSingleEvent = ({ data }) => {
  const today = startOfDay(new Date());

  return (
    <div className={`
      flex items-center min-w-0 px-2 h-5 text-xs transition rounded-sm cursor-pointer hover:bg-gray-100
      ${isBefore(new Date(data.startDate), today) && 'opacity-50'}
    `}>
      <div className={`
        w-2 h-2 rounded-full mr-2
        ${colorLookup[data.themeColor]}
      `} />
      <div className="mr-2 text-gray-600">
        {format(new Date(data.startDate), 'p')}
      </div>
      <div className="truncate">
        {data.title}
      </div>
    </div>
  )
}

export default CalendarViewGridItemSingleEvent