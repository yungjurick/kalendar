import '../styles/globals.css'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import config from '../config/store';

const { store, persistor } = config();

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  )
}

export default MyApp
