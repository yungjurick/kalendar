import { combineReducers } from 'redux';
import userSlice from './userSlice';
import dbSlice from './dbSlice';
import calendarSettingSlice from './calendar/calendarSettingSlice'
import calendarSlice from './calendar/calendarSlice';

const appReducer = combineReducers({
  user: userSlice,
  db: dbSlice,
  calendarSetting: calendarSettingSlice,
  calendar: calendarSlice
})

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer