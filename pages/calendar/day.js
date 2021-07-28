import Head from 'next/head'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import  { fetchEventsForCalendarType } from '../../reducers/calendar/calendarSlice'
import AppLayout from '../../components/App/AppLayout'
import TimelineWrapper from '../../components/Calendar/Timeline/TimelineWrapper';
import { setCurrentUser } from '../../reducers/userSlice';
import { getInitialUsers } from '../../utils/data';

const CalendarDayView = () => {
  const dispatch = useDispatch();
  const { targetDate , calendarViewType } = useSelector(state => state.calendarSetting);

  const user = useSelector(state => state.user);
  const eventDB = useSelector(state => state.db.db.eventDB);
  const userEventDB = useSelector(state => state.db.db.userEventDB);
  const invitedDB = useSelector(state => state.db.db.invitedDB);
  const eventGroupDB = useSelector(state => state.db.db.eventGroupDB);

  console.log(targetDate, calendarViewType);

  useEffect(() => {
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
  }, [targetDate])

  return (
    <>
      <Head>
        <title>Kalendar - Day View</title>
        <meta name="description" content="Kalendar - Day View" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AppLayout>
          <div className="flex flex-col pr-3">
            <TimelineWrapper />
          </div>
        </AppLayout>
      </main>
    </>
  )
}

export default CalendarDayView