import { createSlice } from '@reduxjs/toolkit';
import { CalendarViewTypes } from '../../utils/types';

const initialState = {
  targetDate: Date(),
  calendarViewType: CalendarViewTypes.DAY_VIEW
}

export const calendarSettingSlice = createSlice({
  name: 'calendarSetting',
  initialState,
  reducers: {
    setTargetDate: (state, action) => {
      state.targetDate = action.payload
    },
    setViewType: (state, action) => {
      state.calendarViewType = action.payload
    }
  }
})

export const {
  setTargetDate,
  setViewType
} = calendarSettingSlice.actions

export default calendarSettingSlice.reducer