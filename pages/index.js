import Head from 'next/head'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../reducers/userSlice';
import { getInitialUsers } from '../utils/data';

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    const tempUser = getInitialUsers()['Rick-1234'];
    dispatch(setCurrentUser(tempUser));
  }, [])

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
