import { createSlice } from '@reduxjs/toolkit';
import { CalendarViewTypes } from '../../utils/types';

const initialState = {
  targetDate: Date(),
  calendarViewType: CalendarViewTypes.DAY_VIEW,

  isCreateEventModalOpen: false,

  selectedEvent: {
    eventUid: '',
    // Location to find where to locate the Event-Detail Modal
    top: 0,
    left: 0,
    height: 0,
    width: 0
  },

  createEventBasis: {
    startDate: Date(),
    endDate: Date()
  }
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
    },
    setCreateEventBasis: (state, action) => {
      state.createEventBasis = action.payload
    },
    setIsCreateEventModalOpen: (state, action) => {
      state.isCreateEventModalOpen = action.payload
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload
    },
    resetCalendarSettings: (state) => {
      state.targetDate = Date()
      state.calendarViewType = CalendarViewTypes.DAY_VIEW
      state.isCreateEventModalOpen = false
      state.selectedEvent = {
        eventUid: '',
        top: 0,
        left: 0,
        height: 0,
        width: 0
      }
    }
  }
})

export const {
  setTargetDate,
  setViewType,
  setCreateEventBasis,
  setIsCreateEventModalOpen,
  setSelectedEvent,
  resetCalendarSettings
} = calendarSettingSlice.actions

export default calendarSettingSlice.reducer