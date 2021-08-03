import { getHours, getMinutes, set } from 'date-fns';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateEventBasis, setIsCreateEventModalOpen } from '../../../reducers/calendar/calendarSettingSlice';
import PanelLeftCalendar from './PanelLeftCalendar';

const PanelLeft = () => {
  const dispatch = useDispatch()
  
  const { targetDate } = useSelector(state => state.calendarSetting)

  const onClickCreate = () => {
    const newEventBaseDate = set(new Date(targetDate), {
      hours: getHours(new Date()),
      minutes: getMinutes(new Date())
    }).toString()

    dispatch(setCreateEventBasis({
      startDate: newEventBaseDate,
      endDate: newEventBaseDate
    }))
    dispatch(setIsCreateEventModalOpen(true))
  }
  
  return (
    <div className="min-w-248">
      <div className="pl-2 my-4">
        <button
          className="flex items-center justify-center h-12 p-3.5 text-sm transition bg-white border rounded-full shadow-md border-opacity-30 min-w-56 hover:shadow-xl hover:bg-blue-50"
          onClick={() => onClickCreate()}
        >
          <Image
            src="/createIcon.png"
            height="32px"
            width="32px"
            alt="create-icon"
          />
          <span className="pr-3 ml-3 font-normal tracking-wide text-gray-500">Create</span>
        </button>
      </div>
      <PanelLeftCalendar />
    </div>
  )
}

export default PanelLeft;