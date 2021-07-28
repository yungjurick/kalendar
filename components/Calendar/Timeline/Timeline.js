import { CalendarViewTypes } from '../../../utils/types';
import TimelineBlock from './TimelineBlock';

const Timeline = ({
  calendarViewType,
  data = {}
}) => {
  console.log(data);

  const dayViewTimeline = (data) => {
    console.log(data);
    return Object.keys(data).map((h, i) => {

      const minuteSegments = Object.keys(data[h]).map(seg => {
        const {
          events,
          startColIndex,
          colCount,
          baseZIndex
        } = data[h][seg]

        // console.log(events);

        return (
          <div
            key={`${h}-${seg}`}
            className={`
              relative flex w-full pl-2
            `}
          >
            {
              events.map((e, i) => (
                <TimelineBlock
                  key={i}
                  index={i}
                  event={e}
                  calendarViewType={calendarViewType}
                />
              ))
            }
          </div>
        )
      })

      return (
        <div key={i} className="relative h-12 -ml-2 border-b height-min">
          {minuteSegments}
        </div>
      )
    })
  }

  const weekViewTimeline = (data) => {
    console.log('Week Data', data);
    const week = Object.keys(data['days']).map((d, i) => {
      const dayView = dayViewTimeline(data['days'][d])
      return (
        <div
          key={`day-${i}`}
          className="flex-1 w-1/7"
        >
          {dayView}
        </div>
      )
    })
    // 0 index is set to the end since index 0 is Sunday
    return [
      ...week.slice(1),
      week[0]
    ]
  }

  return (
    <div className={`
      flex-auto w-full h-full ml-2 border-l
      ${calendarViewType === CalendarViewTypes.WEEK_VIEW && 'flex divide-x' }
    `}>
      {
        calendarViewType === CalendarViewTypes.DAY_VIEW 
        ? dayViewTimeline(data['hours'])
        : weekViewTimeline(data)
      }
    </div>
  )
}

export default Timeline