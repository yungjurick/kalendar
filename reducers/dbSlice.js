import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userDB: {},
  eventDB: {},
  invitedDB: {},
  eventGroupDB: {},
  eventInviteDB: {},
}

export const dbSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    setDB: (state, action) => {
      switch (action.payload.type) {
        case 'user': {
          state.userDB = action.payload.data
          break
        }

        case 'event': {
          state.eventDB = action.payload.data
          break
        }

        case 'invite': {
          state.inviteDB = action.payload.data
          break
        }

        case 'eventGroup': {
          state.eventGroupDB = action.payload.data
          break
        }

        case 'eventInvite': {
          state.eventInviteDB = action.payload.data
          break
        }

        default:
          break
      }
    }
  }
})

export const {
  setDB,
} = dbSlice.actions

export default dbSlice.reducer