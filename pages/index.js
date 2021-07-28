import Head from 'next/head'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setDB } from '../reducers/dbSlice';
import { setCurrentUser } from '../reducers/userSlice';
import { getInitialEventGroups, getInitialEventInvites, getInitialEvents, getInitialInvited, getInitialUserEvents, getInitialUsers } from '../utils/data';

export default function Home() {
  const dispatch = useDispatch();
  const isDBLoaded = useSelector(state => state.db.isDBLoaded);

  useEffect(() => {
    const tempUser = getInitialUsers()['Rick-1234'];
    dispatch(setCurrentUser(tempUser));
  }, [])

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

  return (
    <div>
      <Head>
        <title>Kalendar</title>
        <meta name="description" content="Kalendar" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        Landing Page
      </main>
    </div>
  )
}
