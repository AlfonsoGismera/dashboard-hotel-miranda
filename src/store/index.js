import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from '../features/rooms/roomsSlice';
import employeesReducer from '../features/employees/employeesSlice'

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    employees: employeesReducer, 
  },
});
