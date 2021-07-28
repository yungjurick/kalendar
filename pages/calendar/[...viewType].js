import Head from 'next/head'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import  { fetchEventsForCalendarType } from '../../reducers/calendar/calendarSlice'
import AppLayout from '../../components/App/AppLayout'
import TimelineWrapper from '../../components/Calendar/Timeline/TimelineWrapper';
import { useRouter } from 'next/router';
import { CalendarViewTypes } from '../../utils/types';
import { setViewType } from '../../reducers/calendar/calendarSettingSlice';

const CalendarDayView = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { targetDate, calendarViewType } = useSelector(state => state.calendarSetting);
  const { query } = router;

  const user = useSelector(state => state.user);
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

  useEffect(() => {
    if (calendarViewType) {
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
  }, [targetDate, calendarViewType])

  useEffect(() => {
    const viewType = query.viewType || []
    if (viewType.length > 0) {
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
          <div className="flex flex-col pr-3">
            {
              (
                (calendarViewType === CalendarViewTypes.DAY_VIEW ||
                calendarViewType === CalendarViewTypes.WEEK_VIEW)
              )
              &&
              <TimelineWrapper />
            }
          </div>
        </AppLayout>
      </main>
    </>
  )
}

export default CalendarDayView