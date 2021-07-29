import { differenceInMinutes, format, set } from 'date-fns';
import { getClosestIndexForDayViewEvents } from '../../../utils/helpers';
import { ThemeColorTypes } from '../../../utils/types'

const TimelineBlock = ({
  index,
  baseZIndex,
  event,
  calendarViewType
}) => {
  const colorLookup = {
    [ThemeColorTypes.RED]: 'bg-red-500',
    [ThemeColorTypes.GREEN]: 'bg-green-500',
    [ThemeColorTypes.GOLD]: 'bg-gold-3-500',
    [ThemeColorTypes.BLUE]: 'bg-blue-500',
    [ThemeColorTypes.CYAN]: 'bg-cyan-7-500',
    [ThemeColorTypes.PURPLE]: 'bg-purple-500',
    [ThemeColorTypes.BROWN]: 'bg-brown-1-500',
  }

  const getBlockHeight = (event) => {
    const basePixel = 11
    const [startHour, startMinuteSeg] = getClosestIndexForDayViewEvents(new Date(event.startDate))
    const [endHour, endMinuteSeg] = getClosestIndexForDayViewEvents(new Date(event.endDate))

    if (
      (startHour === endHour) &&
      (startMinuteSeg === endMinuteSeg)
    ) {
      return '22px'
    }

    const start = set(new Date(event.startDate), { hours: startHour, minutes: startMinuteSeg })
    const end = set(new Date(event.endDate), { hours: endHour, minutes: endMinuteSeg })

    return `${((differenceInMinutes(end, start) % 15) * basePixel)}px`
  }

  return (
    <div
      style={{ height: getBlockHeight(event)}}
      className={`
        relative
        inline-block
        -top-px
        rounded-md
        text-xs
        text-white
        overflow-x-hidden
        flex-1
        px-2.5
        ${colorLookup[event.themeColor]}
        ${index > 0 && 'border-l border-white -ml-2'}
        ${`z-${baseZIndex + index}`}
      `}
    >
      <div className="font-extralight">
        <span className="max-w-xs min-w-0 overflow-hidden whitespace-nowrap">
          {event.title}
        </span>
        {/* , {format(new Date(event.startDate), 'p')} */}
      </div>
    </div>
  )
}

export default TimelineBlock