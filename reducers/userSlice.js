import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userUid: '',
  displayName: '',
  email: '',
  photoUrl: '',
  timezone: '',
  defaultThemeColor: '',
  friendsUidList: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: () => {
      state = initialState
    },
    setCurrentUser: (state, action) => {
      return action.payload
    }
  }
})

export const {
  logout,
  setCurrentUser
} = userSlice.actions

export default userSlice.reducer