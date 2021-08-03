import Head from 'next/head'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import  { fetchEventsForCalendarType } from '../../reducers/calendar/calendarSlice'
import AppLayout from '../../components/App/AppLayout'
import TimelineWrapper from '../../components/CalendarView/Timeline/TimelineWrapper';
import { useRouter } from 'next/router';
import { CalendarViewTypes } from '../../utils/types';
import { setSelectedEvent, setViewType } from '../../reducers/calendar/calendarSettingSlice';
import CalendarViewGrid from '../../components/CalendarView/Grid/Grid';
import EventDetailModal from '../../components/Modal/EventDetailModal';

const CalendarView = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { query } = router;

  const { targetDate, calendarViewType, selectedEvent } = useSelector(state => state.calendarSetting);

  const user = useSelector(state => state.user);
  const userDB = useSelector(state => state.db.db.userDB);
  const eventDB = useSelector(state => state.db.db.eventDB);
  const userEventDB = useSelector(state => state.db.db.userEventDB);
  const invitedDB = useSelector(state => state.db.db.invitedDB);
  const eventGroupDB = useSelector(state => state.db.db.eventGroupDB);

  const dayQueryLookUp = {
    'day': CalendarViewTypes.DAY_VIEW,
    'week': CalendarViewTypes.WEEK_VIEW,
    'month': CalendarViewTypes.MONTH_VIEW,
    'year': CalendarViewTypes.YEAR_VIEW,
  }

  const selectedCalendarView = (calendarViewType) => {
    switch(calendarViewType) {
      case CalendarViewTypes.DAY_VIEW:
      case CalendarViewTypes.WEEK_VIEW: {
        return <TimelineWrapper />
      }
      case CalendarViewTypes.MONTH_VIEW: {
        return <CalendarViewGrid />
      }
    }
  }

  const onCloseEventDetailModal = () => {
    dispatch(setSelectedEvent({
      ...selectedEvent,
      eventUid: ''
    }))
  }

  const onClickOutsideEventDetailModal = eventUid => {
    console.log(selectedEvent.eventUid)
    console.log(eventUid)
  }

  useEffect(() => {
    if (targetDate) {
      console.log("Fetching Data...", targetDate, calendarViewType)
      dispatch(fetchEventsForCalendarType({
        userUid: user.userUid,
        calendarViewType,
        targetDate,
        db: {
          userEventDB,
          eventDB,
          invitedDB,
          eventGroupDB
        }
      }))
    } else {
      router.push('/calendar/day', undefined, { shallow: true })
    }
  }, [
    targetDate,
    calendarViewType,
    userEventDB,
    eventDB,
    invitedDB,
    eventGroupDB
  ])

  useEffect(() => {
    const viewType = query.viewType || []
    if (viewType.length > 0) {
      console.log(viewType)
      if ((viewType[0] in dayQueryLookUp) && calendarViewType !== dayQueryLookUp[viewType[0]]) {
        dispatch(setViewType(dayQueryLookUp[viewType[0]]))
      }
    }
  }, [query])
  
  return (
    <>
      <Head>
        <title>Kalendar - Day View</title>
        <meta name="description" content="Kalendar - Day View" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AppLayout>
          <div
            className={`
              flex
              ${
                (calendarViewType === CalendarViewTypes.DAY_VIEW || calendarViewType === CalendarViewTypes.WEEK_VIEW)
                ? 'flex-col pr-3'
                : ''
              }
              ${
                (calendarViewType === CalendarViewTypes.MONTH_VIEW)
                ? 'h-full'
                : ''
              }
            `}
          >
            {selectedCalendarView(calendarViewType)}
          </div>
          {/* Event Detail Modal */}
          {
            selectedEvent.eventUid.length > 0 &&
            selectedEvent.eventUid in eventDB &&
            (
              <>
                <div
                  className="absolute top-0 left-0 w-full h-full z-1"
                />
                <EventDetailModal
                  selectedEvent={
                    {
                      ...selectedEvent,
                      event: eventDB[selectedEvent.eventUid],
                      eventCreator: userDB[eventDB[selectedEvent.eventUid].eventCreatorUid]
                    }
                  }
                  onCloseModal={onCloseEventDetailModal}
                />
              </>
            )
          }
        </AppLayout>
      </main>
    </>
  )
}

export default CalendarView