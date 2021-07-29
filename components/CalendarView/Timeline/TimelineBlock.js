import { differenceInMinutes, format, set } from 'date-fns';
import { colorLookup, getClosestIndexForDayViewEvents } from '../../../utils/helpers';

const TimelineBlock = ({
  index,
  baseZIndex,
  event,
}) => {
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