import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import initialData from '../../data/guests.json';

if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(initialData));
}

const fakeApi = {
  fetchAll: () => new Promise(res => setTimeout(() => res(JSON.parse(localStorage.getItem('users')||'[]')), 200)),
  fetchOne: id => new Promise(res => setTimeout(() => {
    const all = JSON.parse(localStorage.getItem('users')||'[]');
    res(all.find(u=>u.reservationId===id));
  },200)),
  create: u => new Promise(res => setTimeout(() => {
    const all = JSON.parse(localStorage.getItem('users')||'[]');
    all.push(u);
    localStorage.setItem('users', JSON.stringify(all));
    res(u);
  },200)),
  update: u => new Promise(res => setTimeout(() => {
    let all = JSON.parse(localStorage.getItem('users')||'[]');
    all = all.map(x=> x.reservationId===u.reservationId ? u : x);
    localStorage.setItem('users', JSON.stringify(all));
    res(u);
  },200)),
  remove: id => new Promise(res => setTimeout(() => {
    let all = JSON.parse(localStorage.getItem('users')||'[]');
    all = all.filter(x=>x.reservationId!==id);
    localStorage.setItem('users', JSON.stringify(all));
    res(id);
  },200)),
};

export const fetchUsers    = createAsyncThunk('users/fetchAll',    () => fakeApi.fetchAll());
export const createUser    = createAsyncThunk('users/create',      u => fakeApi.create(u));
export const updateUser    = createAsyncThunk('users/update',      u => fakeApi.update(u));
export const deleteUser    = createAsyncThunk('users/delete',      id => fakeApi.remove(id));

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], status:'idle', error:null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state=>{ state.status='loading'; })
      .addCase(fetchUsers.fulfilled,(state,action)=>{ state.status='succeeded'; state.items=action.payload; })
      .addCase(fetchUsers.rejected,(state,action)=>{ state.status='failed'; state.error=action.error.message; })
      .addCase(createUser.fulfilled,(state,action)=>{ state.items.push(action.payload); })
      .addCase(updateUser.fulfilled,(state,action)=>{ 
         state.items = state.items.map(u=> u.reservationId===action.payload.reservationId ? action.payload : u);
      })
      .addCase(deleteUser.fulfilled,(state,action)=>{ 
         state.items = state.items.filter(u=>u.reservationId!==action.payload);
      });
  }
});

export default usersSlice.reducer;
