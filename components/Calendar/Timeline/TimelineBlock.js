import { format } from 'date-fns';
import { ThemeColorTypes } from '../../../utils/types'

const TimelineBlock = ({
  index,
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

  console.log(event);

  return (
    <div className={`
      relative
      -top-px
      h-3
      rounded-md
      text-xs
      text-white
      flex
      items-center
      flex-1
      px-2.5
      ${colorLookup[event.themeColor]}
      ${index > 0 && 'border-l border-white -ml-2'}
    `}>
      <span className="font-extralight">
        {event.title},
      </span>
      <span className="ml-1 font-thin">
        {format(new Date(event.startDate), 'p')}
      </span>
    </div>
  )
}

export default TimelineBlock