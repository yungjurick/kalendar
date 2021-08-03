import { CalendarViewTypes } from '../../../utils/types';
import TimelineBlock from './TimelineBlock';

const Timeline = ({
  calendarViewType,
  data = {},
  onClickTimelineBlock
}) => {
  const dayViewTimeline = (data) => {
    return Object.keys(data).map((h, i) => {

      const minuteSegments = Object.keys(data[h]).map(seg => {
        const {
          events,
          startColIndex,
          colCount,
          baseZIndex
        } = data[h][seg]

        return (
          <div
            key={`${h}-${seg}`}
            style={{
              height: '11px',
              paddingLeft:`calc(2rem * ${startColIndex})`
            }}
            className={`
              relative flex w-full pr-2 timelineSegmentSpacing
            `}
          >
            {
              events.map((e, i) => (
                <TimelineBlock
                  key={i}
                  index={i}
                  baseZIndex={baseZIndex}
                  startColIndex={startColIndex}
                  event={e}
                  onClickTimelineBlock={onClickTimelineBlock}
                />
              ))
            }
          </div>
        )
      })

      return (
        <div key={i} className="relative w-full h-12 border-b height-min">
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
    <div
      className={`
        flex-auto w-full h-full border-l
        ${(calendarViewType === CalendarViewTypes.WEEK_VIEW) ? 'flex divide-x' : '' }
      `}
    >
      {
        calendarViewType === CalendarViewTypes.DAY_VIEW 
        ? dayViewTimeline(data['hours'])
        : weekViewTimeline(data)
      }
    </div>
  )
}

export default Timeline