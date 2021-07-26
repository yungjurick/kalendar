import Head from 'next/head'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setTargetStartDate, setTargetEndDate, setViewType } from '../../reducers/calendar/calendarSettingSlice';
import AppLayout from '../../components/App/AppLayout'

const CalendarDayView = () => {
  const dispatch = useDispatch();
  const { targetDate , calendarViewType } = useSelector(state => state.calendarSetting);

  console.log(targetDate, calendarViewType);

  return (
    <>
      <Head>
        <title>Kalendar - Day View</title>
        <meta name="description" content="Kalendar - Day View" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AppLayout>
          <div className="flex flex-col">
            Day View
          </div>
        </AppLayout>
      </main>
    </>
  )
}

export default CalendarDayView