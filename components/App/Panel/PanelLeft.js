import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setIsCreateEventModalOpen } from '../../../reducers/calendar/calendarSlice';
import PanelLeftCalendar from './PanelLeftCalendar';

const PanelLeft = ({
  // category,
  // handleComposeMailOpenStatus
}) => {
  const dispatch = useDispatch()
  return (
    <div className="min-w-248">
      <div className="pl-2 my-4">
        <button
          className="flex items-center justify-center h-12 p-3.5 text-sm transition bg-white border rounded-full shadow-md border-opacity-30 min-w-56 hover:shadow-xl hover:bg-blue-50"
          onClick={() => dispatch(setIsCreateEventModalOpen(true))}
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