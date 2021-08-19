import { format, isSameDay } from 'date-fns';
import { useRef } from 'react';
import { MdClose, MdDelete, MdEdit, MdToday } from 'react-icons/md';
import { colorLookup } from '../../utils/helpers';
import IconButton from '../Common/Button/IconButton';

/*
  When a user clicks on an event, the eventUid is passed to the page component
  After receiving the selected EventUid, it looks for the event in the eventDB using the uid,
  and then, the event is passed to the event-detail modal
*/
const EventDetailModal = ({
  selectedEvent,
  onCloseModal
}) => {
  console.log("Event Detail: ", selectedEvent)
  const eventDetailModalRef = useRef(null)

  const parseEventDate = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isSameDay(start, end)) {
      return `${format(start, 'eeee, MMMM d ⋅ h:mmaaa')} – ${format(end, 'h:mmaaa')}`
    } else {
      return `${format(start, 'MMMM d, yyyy h:mmaaa')} – ${format(end, 'MMMM d, yyyy h:mmaaa')}`
    }
  }
  
  const { event, eventCreator } = selectedEvent

  return (
    <div
      ref={eventDetailModalRef}
      style={{
        top: selectedEvent.top,
        left: selectedEvent.left
      }}
      className="absolute z-50 py-2 transition bg-white rounded-md min-w-448 eventDetailModalBoxShadow"
    >
      <div className="flex items-center justify-end px-1.5">
        <IconButton
          size="small"
          imgComponent={
            <MdEdit size="20px" color="gray" />
          }
          onClickHandler={() => {}}
        />
        <IconButton
          size="small"
          imgComponent={
            <MdDelete size="20px" color="gray" />
          }
          onClickHandler={() => {}}
        />
        <IconButton
          size="small"
          imgComponent={
            <MdClose size="20px" color="gray" />
          }
          onClickHandler={onCloseModal}
        />
      </div>
      <div>
        <div className="flex px-5">
          <div className="flex items-start justify-center">
            {/* Theme Color Rect */}
            <div className={`mt-0.5 h-3.5 w-3.5 rounded-sm ${colorLookup[event.themeColor]}`}/>
          </div>
          <div className="flex flex-col items-start justify-start flex-auto pl-6">
            <span className="text-xl leading-none">
              {event.title}
            </span>
            <span className="pt-2 text-xs font-normal text-gray-500">
              {
                parseEventDate(
                  event.startDate,
                  event.endDate
                )
              }
            </span>
          </div>
        </div>
        <div className="flex px-4 pb-2 mt-4">
          <div className="pl-0.5 flex items-center justify-center">
            <MdToday size="20px" color="gray" />
          </div>
          <div className="flex items-start justify-start flex-auto pl-5 text-xs text-gray-500">
            {eventCreator.displayName}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailModal