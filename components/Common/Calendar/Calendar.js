import { addMonths, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format, getDate, getMonth, isSameDay, setMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import IconButton from '../../Common/Button/IconButton';

const Calendar = ({
  targetDate,
  onClickDate,
  isModal = false,
  onClose = () => {}
}) => {
  const today = new Date();
  const calendarRef = useRef();
  const [ calendarDate, setCalendarDate ] = useState(Date());

  useEffect(() => {
    const diff = getMonth(new Date(targetDate)) - getMonth(new Date(calendarDate));
    
    if (diff > 0) {
      setCalendarDate(addMonths(new Date(calendarDate), diff));
    } else if (diff < 0) {
      setCalendarDate(subMonths(new Date(calendarDate), Math.abs(diff)));
    }
  }, [targetDate])

  useEffect(() => {
    if (isModal) {
      const checkOutsideClick = (e) => {
        if (calendarRef && calendarRef.current) {
          const outsideClick = !calendarRef.current.contains(e.target);
          if (outsideClick) {
            onClose()
          }
        }
      }

      document.addEventListener('click', checkOutsideClick)

      return () => {
        document.removeEventListener('click', checkOutsideClick)
      }
    }
  }, [calendarRef, isModal, onClose])

  const onClickMoveMonth = (dir) => {
    const newDate = new Date(calendarDate);
    if (dir === 'prev') {
      setCalendarDate(subMonths(newDate, 1));
    } else {
      setCalendarDate(addMonths(newDate, 1));
    }
  }

  const isEqualDate = (a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);

    return isSameDay(dateA, dateB);
  }

  const gridHeader = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
    return (
      <div
        key={i}
        className="flex items-center justify-center h-6 text-gray-500 bg-white text-xxs"
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

    const dynamicDateColor = (today, date, targetDate, curDateMonth, targetMonth) => {
      if (
        (isEqualDate(today, date) && isEqualDate(targetDate, date)) ||
        isEqualDate(today, date)
      ){
        return 'bg-blue-500 text-white hover:bg-blue-700'
      }

      if (isEqualDate(targetDate, date)) {
        return 'bg-blue-300 text-blue-700 hover:bg-blue-400'
      }

      if ((curDateMonth !== targetMonth) && !isEqualDate(today, date)) {
        return 'text-gray-400'
      }
    }

    const days = eachDayOfInterval({
      start: monthRangeStart,
      end: monthRangeEnd
    }).map((date, i) => {
      const curDateMonth = getMonth(date);
      return (
        <div
          key={i}
          className="flex items-center justify-center bg-white cursor-pointer text-xxs"
          onClick={() => onClickDate(date) }
        >
          <p
            className={`
              flex items-center justify-center w-6 h-6 transition rounded-full hover:bg-gray-200
              ${dynamicDateColor(today, date, targetDate, curDateMonth, targetMonth)}
            `}
          >
            {getDate(date)}
          </p>
        </div>
      )
    })

    return days
  }

  return (
    <div
      ref={calendarRef}
      className="px-4 pt-2 pb-6 bg-white"
    >
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

export default Calendar