import { addMonths, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format, getDate, getMonth, isSameDay, setMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux'
import { setTargetDate } from '../../../reducers/calendar/calendarSettingSlice';
import { CalendarViewTypes } from '../../../utils/types';
import IconButton from '../../Common/Button/IconButton';

const PanelLeftCalendar = () => {
  const today = new Date();
  const dispatch = useDispatch();
  const { targetDate, calendarViewType } = useSelector(state => state.calendarSetting);
  const [ calendarDate, setCalendarDate ] = useState(Date());

  const isEqualDate = (a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);

    return isSameDay(dateA, dateB);
  }

  const gridHeader = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
    return (
      <div
        key={i}
        className="flex items-center justify-center h-6 text-gray-500 text-xxs"
      >
        {d}
      </div>
    )
  })

  const gridDates = (startDate = Date()) => {
    const baseDate = new Date();
    const target = new Date(startDate);
    const targetMonth = getMonth(target);
    
    const month = setMonth(baseDate, targetMonth);
    const monthRangeStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const monthRangeEnd = addWeeks(endOfWeek(endOfMonth(month), { weekStartsOn: 1 }), 1);

    const days = eachDayOfInterval({
      start: monthRangeStart,
      end: monthRangeEnd
    }).map((date, i) => {
      const curDateMonth = getMonth(date);
      return (
        <div
          key={i}
          className="flex items-center justify-center cursor-pointer text-xxs"
          onClick={() => onClickDate(date) }
        >
          <p
            className={`
              flex items-center justify-center w-6 h-6 transition rounded-full hover:bg-gray-200
              ${isEqualDate(today, date) && 'bg-blue-500 text-white hover:bg-blue-700'}
              ${isEqualDate(targetDate, date) && 'bg-blue-300 text-blue-700 hover:bg-blue-400'}
              ${(curDateMonth !== targetMonth) && !isEqualDate(today, date) && 'text-gray-400'}
            `}
          >
            {getDate(date)}
          </p>
        </div>
      )
    })

    return days
  }

  const onClickMoveMonth = (dir) => {
    const newDate = new Date(calendarDate);
    if (dir === 'prev') {
      setCalendarDate(subMonths(newDate, 1));
    } else {
      setCalendarDate(addMonths(newDate, 1));
    }
  }

  const onClickDate = (date) => {
    switch (calendarViewType) {
      case CalendarViewTypes.DAY_VIEW: {
        dispatch(setTargetDate(date.toString()));
        break;
      }

      case CalendarViewTypes.WEEK_VIEW: {
        break;
      }

      case CalendarViewTypes.MONTH_VIEW: {
        break;
      }

      case CalendarViewTypes.YEAR_VIEW: {
        break;
      }
    }
  }

  return (
    <div className="px-4 pb-4.5 pt-2">
      <div className="flex items-center justify-between pl-2.5 pr-1">
        <p className="text-sm">{format(new Date(calendarDate), "MMMM yyyy")}</p>
        <div className="flex">
          <IconButton
            size="xs"
            label="Previous Month"
            tooltipLocation="bottom"
            imgComponent={
              <MdKeyboardArrowLeft size="20px" color="rgba(95, 105, 119)" />
            }
            onClickHandler={() => onClickMoveMonth('prev')}
          />
          <IconButton
            size="xs"
            label="Next Month"
            tooltipLocation="bottom"
            imgComponent={
              <MdKeyboardArrowRight size="20px" color="rgba(95, 105, 119)" />
            }
            onClickHandler={() => onClickMoveMonth('next')}
          />
        </div>
      </div>
      <div className="grid grid-cols-7 mt-2 grid-rows-7 gap-y-1">
        {gridHeader}
        {gridDates(calendarDate)}
      </div>
    </div>
  )
}

export default PanelLeftCalendar