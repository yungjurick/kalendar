import { isBefore, startOfDay } from 'date-fns'
import { colorLookup } from '../../../utils/helpers'

const CalendarViewGridItemMultiEvent = ({ data, index }) => {
  const today = startOfDay(new Date());

  return (
    <div
      style={{
        height: 22,
        width: `calc(100% + ((100% + 1px) * ${data.duration}) - 0.5rem)`
      }}
      className={`
        rounded-md px-2 text-white text-xs font-light flex cursor-pointer items-center
        ${colorLookup[data.themeColor]}
        ${isBefore(new Date(data.startDate), today) && 'opacity-50'}
        ${index > 0 ? 'mt-0.5' : ''}
      `}
    >
      {data.title}
    </div>
  )
}

export default CalendarViewGridItemMultiEvent