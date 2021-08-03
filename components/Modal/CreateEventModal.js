import { endOfDay, format, getDate, getHours, getMinutes, getMonth, getYear, isAfter, isBefore, set, startOfDay } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { MdAccessTime, MdArrowDropDown, MdCheckBox, MdCheckBoxOutlineBlank, MdClose, MdColorLens, MdDragHandle, MdLocationOn, MdPeople, MdSubject, MdToday } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { uuid } from 'uuidv4'
import { setTargetDate } from '../../reducers/calendar/calendarSettingSlice'
import { setIsCreateEventModalOpen } from '../../reducers/calendar/calendarSettingSlice'
import { addNewEventToDB } from '../../reducers/dbSlice'
import { colorLookup, isValidTime, repeatTypeStringLookup } from '../../utils/helpers'
import { EventRepeatTypes, ThemeColorTypes } from '../../utils/types'
import IconButton from '../Common/Button/IconButton'
import Calendar from '../Common/Calendar/Calendar'
import Dropdown from '../Common/Dropdown/Dropdown'

const CreateEventModal = () => {
  const createEventModalRef = useRef(null)
  const startDateInputRef = useRef(null)
  const endDateInputRef = useRef(null)

  const [isMouseDown, setIsMouseDown] = useState(false)

  const dispatch = useDispatch()

  const currentUser = useSelector(state => state.user)
  const { createEventBasis } = useSelector(state => state.calendarSetting)

  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  const [startDate, setStartDate] = useState(Date())
  const [startDateInputValue, setStartDateInputValue] = useState('')
  const [showStartDateInput, setShowStartDateInput] = useState(false)

  const [endDate, setEndDate] = useState(Date())
  const [endDateInputValue, setEndDateInputValue] = useState('')
  const [showEndDateInput, setShowEndDateInput] = useState(false)

  const [isAllDay, setIsAllDay] = useState(false)
  const [repeatType, setRepeatType] = useState(-1)
  const [themeColor, setThemeColor] = useState(0)
  
  const [isRepeatTypeDropdownOpen, setIsRepeatTypeDropdownOpen] = useState(false)
  const [isStartDateCalendarOpen, setIsStartDateCalendarOpen] = useState(false)
  const [isEndDateCalendarOpen, setIsEndDateCalendarOpen] = useState(false)

  const repeatTypeDropdownData = [
    {
      leftLabel: 'Does not repeat',
      rightLabel: '',
      onClickHandler: () => {
        setRepeatType(-1)
        setIsRepeatTypeDropdownOpen(false)
      }
    },
    {
      leftLabel: 'Daily',
      rightLabel: '',
      onClickHandler: () => {
        setRepeatType(EventRepeatTypes.DAILY)
        setIsRepeatTypeDropdownOpen(false)
      }
    },
    {
      leftLabel: 'Weekly',
      rightLabel: '',
      onClickHandler: () => {
        setRepeatType(EventRepeatTypes.WEEKLY)
        setIsRepeatTypeDropdownOpen(false)
      }
    },
    {
      leftLabel: 'Bi-weekly',
      rightLabel: '',
      onClickHandler: () => {
        setRepeatType(EventRepeatTypes.BI_WEEKLY)
        setIsRepeatTypeDropdownOpen(false)
      }
    },
    {
      leftLabel: 'Monthly',
      rightLabel: '',
      onClickHandler: () => {
        setRepeatType(EventRepeatTypes.MONTHLY)
        setIsRepeatTypeDropdownOpen(false)
      }
    },
    {
      leftLabel: 'Week-days',
      rightLabel: '',
      onClickHandler: () => {
        setRepeatType(EventRepeatTypes.WEEK_DAYS)
        setIsRepeatTypeDropdownOpen(false)
      }
    }
  ]

  const onToggleAllDay = (newVal) => {
    if (newVal) {
      const updatedStartDate = startOfDay(new Date(startDate))
      const updatedEndDate = endOfDay(new Date(endDate))

      setStartDate(updatedStartDate.toString())
      setEndDate(updatedEndDate.toString())
    } else {
      const curHour = getHours(new Date())
      const curMin = getMinutes(new Date())

      setStartDate(set(new Date(startDate), { hours: curHour, minutes: curMin }).toString())
      setEndDate(set(new Date(endDate), { hours: curHour, minutes: curMin }).toString())
    }

    setIsAllDay(newVal)
  }

  const onChangeDate = (target, newDateVal) => {
    const base = new Date(newDateVal)

    const year = getYear(base)
    const month = getMonth(base)
    const date = getDate(base)

    if (target === 'start') {
      const updated = set(new Date(startDate), { year, month, date })

      setStartDate(updated.toString())

      // Update target date to move calendar date location
      dispatch(setTargetDate(updated.toString()))

      // Check if interval is valid
      if (isBefore(new Date(endDate), updated)) {
        setEndDate(updated.toString())
      }

      setIsStartDateCalendarOpen(false);

    } else if (target === 'end') {
      const updated = set(new Date(endDate), { year, month, date })

      setEndDate(updated.toString())

      // Check if interval is valid
      if (isBefore(updated, new Date(startDate))) {
        // Update target date to move calendar date location
        dispatch(setTargetDate(updated.toString()))

        setStartDate(updated.toString())
      }

      setIsEndDateCalendarOpen(false);
    }
  }

  const onBlurInput = (target, value) => {
    // Check if value is valid time
    const [isValid, hours, minutes] = isValidTime(value)

    if (target === 'start') {
      if (isValid) {
        const newStartDate = set(new Date(startDate), { hours, minutes})

        // Check if new start date is after end date
        if (isAfter(newStartDate, new Date(endDate))) {
          const newEndDate = set(new Date(endDate), { hours, minutes})
          setEndDate(newEndDate.toString())
        }

        setStartDate(newStartDate.toString())
      }

      setShowStartDateInput(false)
    } else if (target === 'end') {
      if (isValid) {
        const newEndDate = set(new Date(endDate), { hours, minutes})

        // Check if new end date is before start date
        if (isBefore(newEndDate, new Date(startDate))) {
          const newStartDate = set(new Date(startDate), { hours, minutes})
          setStartDate(newStartDate.toString())
        }

        setEndDate(newEndDate.toString())
      }

      setShowEndDateInput(false)
    }
  }

  const onSaveEvent = () => {
    let eventGroupUid = null
    let eventGroupDetail = null

    if (repeatType > -1) {
      eventGroupUid = uuid()
      eventGroupDetail = {
        groupUid: eventGroupUid,
        repeatType,
        repeatChanges: {}
      }
    }

    const newEvent = {
      title: title.length > 0 ? title : '(No Title)',
      description,
      eventCreatorUid: currentUser.userUid,
      eventGroupUid,
      startDate,
      endDate,
      themeColor,
      location,
      invites: [],
      isAllDay,
      eventUid: uuid(),
      createdAt: Date()
    }

    dispatch(setIsCreateEventModalOpen(false))

    dispatch(addNewEventToDB({
      userUid: currentUser.userUid,
      event: newEvent,
      eventGroup: eventGroupDetail
    }))
  }

  useEffect(() => {
    setStartDate(createEventBasis.startDate.toString())
    setEndDate(createEventBasis.endDate.toString())
  }, [])

  useEffect(() => {
    const onMouseMove = (e) => {
      if (isMouseDown && createEventModalRef && createEventModalRef.current) {
        e.preventDefault()

        const deltaX = e.movementX
        const deltaY = e.movementY

        const rect = createEventModalRef.current.getBoundingClientRect()
        createEventModalRef.current.style.left = rect.x + deltaX + 'px'
        createEventModalRef.current.style.top = rect.y + deltaY + 'px'
      }
    }

    document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [createEventModalRef, isMouseDown])

  useEffect(() => {
    if (currentUser) {
      setThemeColor(currentUser.defaultThemeColor)
    }
  }, [currentUser])

  useEffect(() => {
    setStartDateInputValue(format(new Date(startDate), 'H:mm'))
  }, [startDate])

  useEffect(() => {
    setEndDateInputValue(format(new Date(endDate), 'H:mm'))
  }, [endDate])

  useEffect(() => {
    if (startDateInputRef && startDateInputRef.current) {
      if (showStartDateInput) {
        startDateInputRef.current.focus()
      }
    }

    if (endDateInputRef && endDateInputRef.current) {
      if (setShowEndDateInput) {
        endDateInputRef.current.focus()
      }
    }
  }, [startDateInputRef, endDateInputRef, showStartDateInput, showEndDateInput])

  return (
    <div
      ref={createEventModalRef}
      className="fixed z-40 flex flex-col bg-white rounded-md h-580px min-w-448 bottom-10 left-10 createEventModalBoxShadow"
    >
      {/* Header */}
      <div
        className={`
          flex items-center justify-between px-3 py-1 rounded-t-md bg-opacity-20 transition cursor-move
          ${colorLookup[themeColor]}
        `}
        onMouseDown={e => setIsMouseDown(true)}
        onMouseUp={e => setIsMouseDown(false)}
      >
        <IconButton
          label="Dock to sidebar"
          size="small"
          tooltipLocation="bottom"
          imgComponent={
            <MdDragHandle size="24px" color="rgba(75, 85, 99)"/>
          }
          onClickHandler={() => {}}
        />
        <IconButton
          label="Close"
          size="small"
          tooltipLocation="bottom"
          imgComponent={
            <MdClose size="24px" color="rgba(75, 85, 99)"/>
          }
          onClickHandler={() => dispatch(setIsCreateEventModalOpen(false))}
        />
      </div>

      {/* Modal Content */}
      <div className="pt-2">

        {/* Title Input */}
        <div className="flex py-4 pl-16 pr-5">
          <input
            type="text"
            value={title}
            placeholder="Add title"
            onChange={e => setTitle(e.target.value)}
            className="w-full text-2xl antialiased font-normal border-b outline-none"
          />
        </div>

        {/* Event Types */}
        <div className="flex pl-16 pr-5 space-x-2">
          <div className={`px-2 py-2 text-sm text-white ${colorLookup[themeColor]} bg-opacity-80 transition rounded-md cursor-default`}>
            Event
          </div>
          <div className="px-2 py-2 text-sm text-gray-600 cursor-not-allowed">
            Task
          </div>
          <div className="px-2 py-2 text-sm text-gray-600 cursor-not-allowed">
            Reminder
          </div>
        </div>

        {/* Time Select */}
        <div className="flex px-5 py-4">
          <div className="flex items-start justify-center">
            <MdAccessTime size="20px" color="rgba(75, 85, 99)"/>
          </div>
          <div className="flex flex-col flex-auto pl-6 text-sm text-gray-500">

            {/* Date Selector */}
            <div className="flex items-center justify-start">

              {/* Start Date */}
              <div className="relative">
                <div
                  className="px-1 transition rounded-sm cursor-pointer hover:bg-gray-100"
                  onClick={() => setIsStartDateCalendarOpen(true)}
                >
                  {format(new Date(startDate), 'eeee, MMMM d')}
                </div>
                {
                  isStartDateCalendarOpen &&
                  <div
                    className="absolute z-50 w-64 bg-white h-min top-full dropdownBoxShadow"
                  >
                    <Calendar
                      targetDate={startDate}
                      onClickDate={(newDate) => onChangeDate('start', newDate)}
                      isModal
                      onClose={() => setIsStartDateCalendarOpen(false)}
                    />
                  </div>
                }
              </div>

              {
                !isAllDay &&
                <div>
                  {
                    showStartDateInput
                    ? (
                      <input
                        ref={startDateInputRef}
                        type="text"
                        value={startDateInputValue}
                        className="w-20 text-center border rounded-md outline-none"
                        onChange={(e) => setStartDateInputValue(e.target.value)}
                        onBlur={(e) => onBlurInput('start', e.target.value)}
                      />
                    )
                    : (
                      <div
                        className="px-1 transition rounded-sm cursor-pointer hover:bg-gray-100"
                        onClick={() => setShowStartDateInput(true)}
                      >
                        {format(new Date(startDate), 'H:mm a')}
                      </div>
                    )
                  }
                </div>
              }

              <span className="px-1">
                -
              </span>

              {
                !isAllDay &&
                <div>
                  {
                    showEndDateInput
                    ? (
                      <input
                        ref={endDateInputRef}
                        type="text"
                        value={endDateInputValue}
                        className="w-20 text-center border rounded-md outline-none"
                        onChange={(e) => setEndDateInputValue(e.target.value)}
                        onBlur={(e) => onBlurInput('end', e.target.value)}
                      />
                    )
                    : (
                      <div
                        className="px-1 transition rounded-sm cursor-pointer hover:bg-gray-100"
                        onClick={() => setShowEndDateInput(true)}
                      >
                        {format(new Date(endDate), 'H:mm a')}
                      </div>
                    )
                  }
                </div>
              }

              {/* End Date */}
              <div className="relative">
                <div
                  className="px-1 transition rounded-sm cursor-pointer hover:bg-gray-100"
                  onClick={() => setIsEndDateCalendarOpen(true)}
                >
                  {format(new Date(endDate), 'eeee, MMMM d')}
                </div>
                {
                  isEndDateCalendarOpen &&
                  <div
                    className="absolute z-50 w-64 bg-white h-min top-full dropdownBoxShadow"
                  >
                    <Calendar
                      targetDate={endDate}
                      onClickDate={(newDate) => onChangeDate('end', newDate)}
                      isModal
                      onClose={() => setIsEndDateCalendarOpen(false)}
                    />
                  </div>
                }
              </div>
            </div>

            {/* All Day Selector */}
            <div className="flex items-center mt-2 -ml-1">
              <div className="mr-1.5">
                <IconButton
                  label=""
                  size="small"
                  imgComponent={
                    isAllDay
                    ? <MdCheckBox size="24px" color="gray" />
                    : <MdCheckBoxOutlineBlank size="24px" color="gray" />
                  }
                  onClickHandler={() => onToggleAllDay(!isAllDay)}
                />
              </div>
              <div>
                All day
              </div>
            </div>

            {/* Repeat Selector */}
            <div className="relative mt-2">
              <button
                className="flex px-2 py-1 -ml-1 transition rounded-md hover:bg-gray-100"
                onClick={() => setIsRepeatTypeDropdownOpen(true)}
              >
                <span className="mr-0.5">
                  {repeatTypeStringLookup[repeatType]}
                </span>
                <MdArrowDropDown size="18px" color="rgba(75, 85, 99)" />
              </button>
              {
                isRepeatTypeDropdownOpen &&
                <Dropdown
                  data={repeatTypeDropdownData}
                  onCloseDropdown={() => setIsRepeatTypeDropdownOpen(false)}
                />
              }
            </div>
          </div>
        </div>

        {/* Guest */}
        {/* <div className="px-5 py-4">
          <div>
            <MdPeople size="20px" color="rgba(75, 85, 99)"/>
          </div>
          <div>
            
          </div>
        </div> */}

        {/* Location */}
        <div className="flex items-center px-5 py-4 border-t">
          <div>
            <MdLocationOn size="20px" color="rgba(75, 85, 99)"/>
          </div>
          <div className="flex-auto pl-6">
            <input
              type="text"
              value={location}
              placeholder="Location"
              onChange={e => setLocation(e.target.value)}
              className="w-full px-2 py-1 text-sm bg-gray-100 border-b outline-none"
            />
          </div> 
        </div>

        {/* Description */}
        <div className="flex px-5 py-4 border-t">
          <div>
            <MdSubject size="20px" color="rgba(75, 85, 99)"/>
          </div>
          <div className="flex-auto pl-6">
            <textarea
              type="text"
              value={description}
              placeholder="Description"
              onChange={e => setDescription(e.target.value)}
              className="w-full px-2 py-1 text-sm bg-gray-100 border-b outline-none resize-none"
            />
          </div>
        </div>

        {/* User */}
        <div className="flex px-5 py-4 border-t border-b">
          <div>
            <MdColorLens size="20px" color="rgba(75, 85, 99)"/>
          </div>
          <div className="flex flex-auto pl-6 space-x-4 text-xs -mt-1.5">
            {
              Object.keys(ThemeColorTypes).map(key => {
                return (
                  <div
                    key={key}
                    className={`
                      flex flex-col items-center px-1 py-1.5 transition rounded-md cursor-pointer
                      hover:${colorLookup[ThemeColorTypes[key]]}
                      hover:bg-opacity-20
                      ${
                        themeColor === ThemeColorTypes[key] &&
                        `${colorLookup[ThemeColorTypes[key]]} bg-opacity-20`
                      }
                    `}
                    onClick={() => setThemeColor(ThemeColorTypes[key])}
                  >
                    <span className="mb-2 tracking-wide text-gray-500 text-xxs">
                      {key}
                    </span>
                    <div
                      className={`
                        w-4 h-4 rounded-full
                        ${colorLookup[ThemeColorTypes[key]]}
                      `}
                    />
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-end px-4 py-3">
        <button
          className={`px-6 py-2 text-sm text-white bg-opacity-80 transition ${colorLookup[themeColor]} rounded-md`}
          onClick={() => onSaveEvent()}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default CreateEventModal