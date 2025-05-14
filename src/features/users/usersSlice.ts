// src/features/users/usersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import initialData from '../../data/guests.json';
import { User } from '../../types/users';

// Seed localStorage on first load
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(initialData as User[]));
}

// Fake API simulating asynchronous storage operations
const fakeApi = {
  fetchAll: (): Promise<User[]> =>
    new Promise(res =>
      setTimeout(() => res(JSON.parse(localStorage.getItem('users') || '[]') as User[]), 200)
    ),
  fetchOne: (id: string): Promise<User | undefined> =>
    new Promise(res =>
      setTimeout(() => {
        const all = JSON.parse(localStorage.getItem('users') || '[]') as User[];
        res(all.find(u => u.reservationId === id));
      }, 200)
    ),
  create: (u: User): Promise<User> =>
    new Promise(res =>
      setTimeout(() => {
        const all = JSON.parse(localStorage.getItem('users') || '[]') as User[];
        all.push(u);
        localStorage.setItem('users', JSON.stringify(all));
        res(u);
      }, 200)
    ),
  update: (u: User): Promise<User> =>
    new Promise(res =>
      setTimeout(() => {
        let all = JSON.parse(localStorage.getItem('users') || '[]') as User[];
        all = all.map(x => (x.reservationId === u.reservationId ? u : x));
        localStorage.setItem('users', JSON.stringify(all));
        res(u);
      }, 200)
    ),
  remove: (id: string): Promise<string> =>
    new Promise(res =>
      setTimeout(() => {
        let all = JSON.parse(localStorage.getItem('users') || '[]') as User[];
        all = all.filter(x => x.reservationId !== id);
        localStorage.setItem('users', JSON.stringify(all));
        res(id);
      }, 200)
    ),
};

// Thunks with proper generics for TypeScript
export const fetchUsers = createAsyncThunk<User[], void>('users/fetchAll', () => fakeApi.fetchAll());
export const createUser = createAsyncThunk<User, User>('users/create', u => fakeApi.create(u));
export const updateUser = createAsyncThunk<User, User>('users/update', u => fakeApi.update(u));
export const deleteUser = createAsyncThunk<string, string>('users/delete', id => fakeApi.remove(id));

// Slice state interface
type UsersState = {
  items: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: UsersState = {
  items: [],
  status: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.items.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.items = state.items.map(u =>
          u.reservationId === action.payload.reservationId ? action.payload : u
        );
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(u => u.reservationId !== action.payload);
      });
  },
});

export default usersSlice.reducer;

