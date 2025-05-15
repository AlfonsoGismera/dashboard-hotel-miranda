import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Employee } from '../../types/employees';
import initialData from '../../data/employees.json';

// Initialize localStorage if empty
autoInit();

function autoInit() {
  if (!localStorage.getItem('employees')) {
    localStorage.setItem('employees', JSON.stringify(initialData));
  }
}

// Fake API wrappers
const fakeApi = {
  fetchAll: (): Promise<Employee[]> =>
    new Promise(res =>
      setTimeout(() => res(JSON.parse(localStorage.getItem('employees') || '[]')), 200)
    ),
  create: (emp: Employee): Promise<Employee> =>
    new Promise(res =>
      setTimeout(() => {
        const all: Employee[] = JSON.parse(localStorage.getItem('employees') || '[]');
        all.push(emp);
        localStorage.setItem('employees', JSON.stringify(all));
        res(emp);
      }, 200)
    ),
  update: (emp: Employee): Promise<Employee> =>
    new Promise(res =>
      setTimeout(() => {
        let all: Employee[] = JSON.parse(localStorage.getItem('employees') || '[]');
        all = all.map(e => (e.employeeId === emp.employeeId ? emp : e));
        localStorage.setItem('employees', JSON.stringify(all));
        res(emp);
      }, 200)
    ),
  remove: (id: string): Promise<string> =>
    new Promise(res =>
      setTimeout(() => {
        let all: Employee[] = JSON.parse(localStorage.getItem('employees') || '[]');
        all = all.filter(e => e.employeeId !== id);
        localStorage.setItem('employees', JSON.stringify(all));
        res(id);
      }, 200)
    ),
};

// Thunks
export const fetchEmployees = createAsyncThunk<Employee[]>('employees/fetchAll', async () => {
  return await fakeApi.fetchAll();
});
export const createEmployee = createAsyncThunk<Employee, Employee>('employees/create', async emp => {
  return await fakeApi.create(emp);
});
export const updateEmployee = createAsyncThunk<Employee, Employee>('employees/update', async emp => {
  return await fakeApi.update(emp);
});
export const deleteEmployee = createAsyncThunk<string, string>('employees/delete', async id => {
  return await fakeApi.remove(id);
});

// State type
type Status = 'idle' | 'loading' | 'succeeded' | 'failed';
interface EmployeesState {
  items: Employee[];
  status: Status;
  error: string | null;
}

const initialState: EmployeesState = {
  items: [],
  status: 'idle',
  error: null,
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEmployees.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(createEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.items.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.items = state.items.map(e =>
          e.employeeId === action.payload.employeeId ? action.payload : e
        );
      })
      .addCase(deleteEmployee.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(e => e.employeeId !== action.payload);
      });
  },
});

export default employeesSlice.reducer;