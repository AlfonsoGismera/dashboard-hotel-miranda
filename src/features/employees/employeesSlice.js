import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import initialData from '../../data/employees.json';

// Initialize localStorage if empty
if (!localStorage.getItem('employees')) {
  localStorage.setItem('employees', JSON.stringify(initialData));
}

const fakeApi = {
  fetchAll: () => new Promise(res => setTimeout(() => res(JSON.parse(localStorage.getItem('employees')||'[]')), 200)),
  create: emp => new Promise(res => setTimeout(() => {
    const all = JSON.parse(localStorage.getItem('employees')||'[]');
    all.push(emp);
    localStorage.setItem('employees', JSON.stringify(all));
    res(emp);
  },200)),
  update: emp => new Promise(res => setTimeout(() => {
    let all = JSON.parse(localStorage.getItem('employees')||'[]');
    all = all.map(e=> e.employeeId===emp.employeeId ? emp : e);
    localStorage.setItem('employees', JSON.stringify(all));
    res(emp);
  },200)),
  remove: id => new Promise(res => setTimeout(() => {
    let all = JSON.parse(localStorage.getItem('employees')||'[]');
    all = all.filter(e=>e.employeeId!==id);
    localStorage.setItem('employees', JSON.stringify(all));
    res(id);
  },200)),
};

export const fetchEmployees = createAsyncThunk('employees/fetchAll', async () => await fakeApi.fetchAll());
export const createEmployee = createAsyncThunk('employees/create', async emp => await fakeApi.create(emp));
export const updateEmployee = createAsyncThunk('employees/update', async emp => await fakeApi.update(emp));
export const deleteEmployee = createAsyncThunk('employees/delete', async id => await fakeApi.remove(id));

const employeesSlice = createSlice({
  name: 'employees',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEmployees.pending, state => { state.status = 'loading'; })
      .addCase(fetchEmployees.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchEmployees.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
      .addCase(createEmployee.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateEmployee.fulfilled, (state, action) => { state.items = state.items.map(e=> e.employeeId===action.payload.employeeId ? action.payload : e); })
      .addCase(deleteEmployee.fulfilled, (state, action) => { state.items = state.items.filter(e=>e.employeeId!==action.payload); });
  }
});

export default employeesSlice.reducer;
