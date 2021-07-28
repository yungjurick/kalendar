import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDBLoaded: false,
  db: {
    userDB: {},
    userEventDB: {},
    eventDB: {},
    invitedDB: {},
    eventGroupDB: {},
    eventInviteDB: {},
  }
}

export const dbSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    setDB: (state, action) => {
      state.db = action.payload
      state.isDBLoaded = true
    }
  }
})

export const {
  setDB,
} = dbSlice.actions

export default dbSlice.reducer