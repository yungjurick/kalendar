import { CalendarViewTypes } from '../../../utils/types';
import TimelineBlock from './TimelineBlock';

const Timeline = ({
  calendarViewType,
  data = {}
}) => {
  console.log(data);

  const dayViewTimeline = (data) => (
    Object.keys(data.hours).map((h, i) => {

      const minuteSegments = Object.keys(data['hours'][h]).map(seg => {
        const {
          events,
          startColIndex,
          colCount,
          baseZIndex
        } = data['hours'][h][seg]

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
                  key={e.eventUid}
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
  )

  return (
    <div className="flex-auto w-full ml-2 border-l">
      {
        calendarViewType === CalendarViewTypes.DAY_VIEW 
        ? dayViewTimeline(data)
        : (
          <div></div>
        )
      }
    </div>
  )
}

export default Timeline