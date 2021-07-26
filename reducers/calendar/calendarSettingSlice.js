import { createSlice } from '@reduxjs/toolkit';
import { CalendarViewTypes } from '../../utils/types';

const initialState = {
  targetDate: {
    start: Date(),
    end: Date()
  },
  calendarViewType: CalendarViewTypes.DAY_VIEW
}

export const calendarSettingSlice = createSlice({
  name: 'calendarSetting',
  initialState,
  reducers: {
    setTargetStartDate: (state, action) => {
      state.targetDate.start = action.payload
    },
    setTargetEndDate: (state, action) => {
      state.targetDate.end = action.payload
    },
    setViewType: (state, action) => {
      state.calendarViewType = action.payload
    }
  }
})

export const {
  setTargetStartDate,
  setTargetEndDate,
  setViewType
} = calendarSettingSlice.actions

export default calendarSettingSlice.reducer