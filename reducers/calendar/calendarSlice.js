import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: []
}

export const calendarSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    fetchCalendarEvents: (state, { payload }) => {
      const { currentUserUid, currentCalendarType } = payload;
      const { userDB, eventDB, inviteDB, eventGroupDB, eventInviteDB } = payload.db;
    }
  }
})

export const {
  fetchCalendarEvents,
} = calendarSlice.actions

export default calendarSlice.reducer