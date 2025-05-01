import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from '../features/rooms/roomsSlice';
import employeesReducer from '../features/employees/employeesSlice'
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    employees: employeesReducer, 
    users: usersReducer,
  },
});
