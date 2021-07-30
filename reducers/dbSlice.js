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
    },
    addNewEventToDB: (state, action) => {
      const {
        userUid,
        event,
        eventGroup
      } = action.payload

      console.log("Adding Event to DB...")
      console.log(userUid, event, eventGroup)

      state.db.eventDB[event.eventUid] = event
      state.db.userEventDB[userUid].push(event.eventUid)

      if (eventGroup !== null) {
        state.db.eventGroupDB[event.eventGroupUid] = eventGroup
      }
    }
  }
})

export const {
  setDB,
  addNewEventToDB
} = dbSlice.actions

export default dbSlice.reducer