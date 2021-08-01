import Head from 'next/head'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setTargetDate } from '../reducers/calendar/calendarSettingSlice';
import { setDB } from '../reducers/dbSlice';
import { setCurrentUser } from '../reducers/userSlice';
import { getInitialEventGroups, getInitialEventInvites, getInitialEvents, getInitialInvited, getInitialUserEvents, getInitialUsers } from '../utils/data';

export default function Home() {
  const router = useRouter()
  const dispatch = useDispatch();
  const isDBLoaded = useSelector(state => state.db.isDBLoaded);
  const {
    userDB
  } = useSelector(state => state.db.db)

  useEffect(() => {
    if (!isDBLoaded) {
      console.log('Load DB Data')
      dispatch(setDB({
        userDB: getInitialUsers(),
        userEventDB: getInitialUserEvents(),
        eventDB: getInitialEvents(),
        invitedDB: getInitialInvited(),
        eventGroupDB: getInitialEventGroups(),
        eventInviteDB: getInitialEventInvites(),
      }))
    }
  }, [isDBLoaded, dispatch])

  const loginWithUser = (uid) => {
    dispatch(setTargetDate(Date()));
    dispatch(setCurrentUser(userDB[uid]));
    router.push('/calendar/day');
  }

  return (
    <div>
      <Head>
        <title>Kalendar</title>
        <meta name="description" content="Kalendar" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center justify-center w-screen min-h-screen bg-gray-400 ">
        <div className="max-w-screen-sm p-6 bg-white rounded-md shadow-md ">
          <div className="flex items-center justify-start mb-6">
            <Image src="/google-calender.png" height="32px" width="32px" alt="mail-icon"/>
            <p className="ml-4 text-2xl text-gray-600">Kalendar</p>
          </div>
          <p className="font-bold text-gray-600">
            Welcome to Kalendar
          </p>
          <p className="pb-4 text-gray-400 border-b">
            A Simplified Google Calendar Clone Project Using Next.js
          </p>
          <p className="mt-4 text-gray-600">
            This project is an offline version where the data is pre-populated using Redux in the beginning.
            So, sending emails will only be allowed amongst the users below.
          </p>
          <div className="mt-8">
            <p className="pb-2 font-semibold text-gray-600 border-b">
              Select any user below to login
            </p>
            <div className="mt-4 space-y-2">
              {
                Object.keys(userDB).map(uid => {
                  const {
                    displayName,
                    email,
                    photoUrl
                  } = userDB[uid];
                  return (
                    <div
                      key={uid}
                      className="flex justify-between px-2 py-1 border-2 rounded-md cursor-pointer hover:bg-gray-200 hover:bg-opacity-40"
                      onClick={() => loginWithUser(uid)}
                    >
                      <div className="flex">
                        <Image
                          src={photoUrl}
                          width="25px"
                          height="25px"
                          alt="user-icon"
                          className="rounded-full"
                        />
                        <p className="ml-3">
                          {displayName}
                        </p>
                      </div>
                      <p className="ml-3 text-gray-400">
                        {email}
                      </p>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
