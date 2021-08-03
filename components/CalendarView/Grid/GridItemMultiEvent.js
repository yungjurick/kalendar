import { isBefore, startOfDay } from 'date-fns'
import { colorLookup } from '../../../utils/helpers'

const CalendarViewGridItemMultiEvent = ({
  data,
  index,
  isHovered
}) => {
  return (
    <div
      style={{
        height: 22,
        width: `calc(100% + ((100% + 1px) * ${data.duration}) - 0.5rem)`
      }}
      className={`
        relative rounded-md px-2 z-20 text-white text-xs font-light flex cursor-pointer items-center transition
        ${colorLookup[data.themeColor]}
        ${index > 0 ? 'mt-0.5' : ''}
        ${isHovered ? 'bg-opacity-70' : ''}
      `}
    >
      {data.title}
    </div>
  )
}

export default CalendarViewGridItemMultiEvent