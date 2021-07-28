import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MdMenu, MdKeyboardArrowRight, MdKeyboardArrowLeft, MdArrowDropDown, MdApps, MdHelpOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../Common/Button/IconButton';
import { CalendarViewTypes } from '../../utils/types';
import { endOfWeek, format, isSameWeek, startOfWeek } from 'date-fns';
import { setTargetDate, setViewType } from '../../reducers/calendar/calendarSettingSlice';
import Dropdown from '../Common/Dropdown/Dropdown';
// import UserProfile from '../Profile/UserProfile';

export const HeaderBar = () => {
  const { photoUrl = '' } = useSelector(state => state.user);
  const { targetDate, calendarViewType } = useSelector(state => state.calendarSetting);
  
  const router = useRouter();
  const dispatch = useDispatch();

  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isViewTypeDropdownOpen, setIsViewTypeDropdownOpen] = useState(false);

  const profilePhoto = photoUrl === ''
    ? 'https://gravatar.com/avatar/762cbbab74ca0b222c1aaed8948be973?s=400&d=identicon&r=x'
    : photoUrl

  const getHeaderTitle = (date, typeView) => {
    const tempDate = new Date(date);

    switch (typeView) {
      case CalendarViewTypes.DAY_VIEW: {
        return format(tempDate, 'MMMM d, yyyy')
      }

      case CalendarViewTypes.WEEK_VIEW: {
        const weekStart = startOfWeek(tempDate, { weekStartsOn: 1})
        const weekEnd = endOfWeek(tempDate, { weekStartsOn: 1})
        return isSameWeek(weekStart, weekEnd)
          ? format(tempDate, 'MMMM yyyy')
          : `${format(weekStart, 'MMM')} - ${format(weekEnd, 'MMM yyyy')}`
        
      }

      case CalendarViewTypes.MONTH_VIEW: {
        return format(tempDate, 'MMMM yyyy')
      }

      case CalendarViewTypes.YEAR_VIEW: {
        return format(tempDate, 'yyyy')
      }
    }
  }

  const calendarViewTypeDropdownData = [
    {
      leftLabel: 'Day',
      rightLabel: 'D',
      onClickHandler: () => {
        dispatch(setViewType(CalendarViewTypes.DAY_VIEW))
        router.push('/calendar/day', undefined, { shallow: true })
        setIsViewTypeDropdownOpen(false);
      }
    },
    {
      leftLabel: 'Week',
      rightLabel: 'W',
      onClickHandler: () => {
        dispatch(setViewType(CalendarViewTypes.WEEK_VIEW))
        router.push('/calendar/week', undefined, { shallow: true })
        setIsViewTypeDropdownOpen(false);
      }
    },
    {
      leftLabel: 'Month',
      rightLabel: 'M',
      onClickHandler: () => {
        dispatch(setViewType(CalendarViewTypes.MONTH_VIEW))
        router.push('/calendar/month', undefined, { shallow: true })
        setIsViewTypeDropdownOpen(false);
      }
    },
    {
      leftLabel: 'Year',
      rightLabel: 'Y',
      onClickHandler: () => {
        dispatch(setViewType(CalendarViewTypes.YEAR_VIEW))
        router.push('/calendar/year', undefined, { shallow: true })
        setIsViewTypeDropdownOpen(false);
      }
    }
  ]

  const viewTypeStringLookUp = {
    [CalendarViewTypes.DAY_VIEW]: 'Day',
    [CalendarViewTypes.WEEK_VIEW]: 'Week',
    [CalendarViewTypes.MONTH_VIEW]: 'Month',
    [CalendarViewTypes.YEAR_VIEW]: 'Year'
  }

  return (
    <div className="flex w-full p-2 border-b">
      {/* Left Section */}
      <div className="flex items-center justify-start pl-2 mr-12 text-2xl">
        <div className="p-1 ml-1 mr-2">
          <IconButton
            size="medium"
            label="Menu"
            tooltipLocation="bottom"
            imgComponent={
              <MdMenu size="24px" color="rgba(75, 85, 99)"/>
            }
            onClickHandler={() => {}}
          />
        </div>
        <div
          className="flex items-center justify-center"
        >
          <Image src="/google-calender.png" height="32px" width="32px" alt="mail-icon"/>
          <p className="ml-4 font-normal text-gray-500">Kalendar</p>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex items-center flex-auto">
        <div className="flex items-center justify-start">
          <div
            className="px-3 py-2 text-sm font-normal text-gray-700 transition border rounded-sm cursor-pointer hover:bg-gray-100"
            onClick={() => dispatch(setTargetDate(Date()))}
          >
            Today
          </div>
          <div className="flex ml-3 w-min">
            <IconButton
              size="small"
              label={`Previous ${viewTypeStringLookUp[calendarViewType]}`}
              tooltipLocation="bottom"
              imgComponent={
                <MdKeyboardArrowLeft size="24px" color="rgba(75, 85, 99)"/>
              }
              onClickHandler={() => {}}
            />
            <IconButton
              size="small"
              label={`Next ${viewTypeStringLookUp[calendarViewType]}`}
              tooltipLocation="bottom"
              imgComponent={
                <MdKeyboardArrowRight size="24px" color="rgba(75, 85, 99)"/>
              }
              onClickHandler={() => {}}
            />
          </div>
          <div className="ml-5 text-xl text-gray-600">
            {getHeaderTitle(targetDate, calendarViewType)}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative flex items-center justify-end pl-6 pr-2">
        <div className="flex items-center justify-center mr-8 space-x-3">
          <IconButton
            size="medium"
            label="Apps"
            tooltipLocation="bottom"
            imgComponent={
              <MdHelpOutline size="24px" color="rgba(75, 85, 99)" />
            }
            onClickHandler={() => {}}
          />
          <div
            className="relative flex items-center justify-between text-sm tracking-wide text-gray-700 border rounded-md cursor-pointer hover:bg-gray-100"
          >
            <span
              className="mr-1.5 py-2 pl-3"
              onClick={() => setIsViewTypeDropdownOpen(true)}
            >
              {viewTypeStringLookUp[calendarViewType]}
            </span>
            <MdArrowDropDown
              size="20px"
              color="rgba(75, 85, 99)"
              className="pr-0.5"
              onClick={() => setIsViewTypeDropdownOpen(true)}
            />
            {
              isViewTypeDropdownOpen &&
              <Dropdown
                data={calendarViewTypeDropdownData}
                onCloseDropdown={() => setIsViewTypeDropdownOpen(false)}
              />
            }
          </div>
        </div>
        <div className="flex space-x-2">
          <IconButton
            size="medium"
            label="Apps"
            tooltipLocation="bottom"
            imgComponent={
              <MdApps size="24px" color="rgba(75, 85, 99)" />
            }
            onClickHandler={() => {}}
          />
          <IconButton
            size="medium"
            label="Profile"
            tooltipLocation="none"
            imgComponent={
              <Image
                src={profilePhoto}
                alt="Profile Picture"
                width="32px"
                height="32px"
                className="z-10 flex items-center justify-center rounded-full"
              />
            }
            onClickHandler={() => setIsUserProfileOpen(true)}
          />
        </div>
        {/* {
          isUserProfileOpen &&
          <UserProfile onCloseUserProfile={() => setIsUserProfileOpen(false)}/>
        } */}
      </div>
    </div>
  )
}