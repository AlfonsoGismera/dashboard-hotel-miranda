import { configureStore, ThunkDispatch, Action } from '@reduxjs/toolkit';
import roomsReducer from '../features/rooms/roomsSlice';
import employeesReducer from '../features/employees/employeesSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    employees: employeesReducer,
    users: usersReducer,
  },
});

// Define el tipo RootState (el tipo del estado completo de la aplicación)
export type RootState = ReturnType<typeof store.getState>;

// Define el tipo AppDispatch (el tipo de la función dispatch del store)
export type AppDispatch = typeof store.dispatch;

// Opcional: Define un tipo AppThunk si vas a usar thunks tipados
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

import { ThunkAction } from 'redux-thunk'; // Asegúrate de importar ThunkAction