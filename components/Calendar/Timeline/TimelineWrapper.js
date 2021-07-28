import { eachDayOfInterval, format, getDate, setHours } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CalendarViewTypes } from '../../../utils/types';
import Timeline from './Timeline';
import TimelineHeader from './TimelineHeader'

const TimelineWrapper = ({}) => {
  const { targetDate, calendarViewType } = useSelector(state => state.calendarSetting);
  const { dayViewEvents, weekViewEvents } = useSelector(state => state.calendar);
  const [targetDateRange, setTargetDateRange] = useState([]);

  useEffect(() => {
    const getDayList = (targetDate, calendarViewType) => {
      switch(calendarViewType) {
        case CalendarViewTypes.DAY_VIEW: {
          return [new Date(targetDate)]
        }
  
        case CalendarViewTypes.WEEK_VIEW: {
          const [start, end] = getDateRange(calendarViewType, targetDate);
          return eachDayOfInterval({
            start,
            end
          })
        }
      }
    }

    if (targetDate !== null) {  
      setTargetDateRange(
        getDayList(targetDate, calendarViewType)
      )
    }
  }, [targetDate, calendarViewType])

  return (
    <div className="flex flex-col w-full">
      {/* Timeline Header */}
      <TimelineHeader dates={targetDateRange} />
      
      <div className="flex flex-auto overflow-y-scroll timelineHeight">
        
        {/* Left Time Divider */}
        <div className="w-12">
          {
            Array(24)
              .fill()
              .map((v, i) => {
                const date = setHours(new Date(), i);
                return (
                  <div key={i} className="h-12 text-gray-500 text-xxs">
                    <span className="text-right relative -top-1.5">
                      { i !== 0 ? format(date, 'H aa') : ''}
                    </span>
                  </div>
                )
              })
          }
        </div>

        {/* Timeline */}
        <Timeline
          calendarViewType={calendarViewType}
          data={
            calendarViewType === CalendarViewTypes.DAY_VIEW
              ? dayViewEvents
              : weekViewEvents
          }
        />
      </div>
    </div>
  )
}

export default TimelineWrapper