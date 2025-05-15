import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import roomList from '../../data/roomList.json';
import { Room } from '../../types/rooms';

interface RoomsState {
  items: Room[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const fakeApi = {
  fetchAll: (): Promise<Room[]> =>
    new Promise(res =>
      setTimeout(() => {
        if (!localStorage.getItem('rooms')) {
          localStorage.setItem('rooms', JSON.stringify(roomList));
        }
        res(JSON.parse(localStorage.getItem('rooms') || '[]'));
      }, 200)
    ),
  fetchOne: (id: string): Promise<Room | undefined> =>
    new Promise(res =>
      setTimeout(() => {
        const all: Room[] = JSON.parse(localStorage.getItem('rooms') || '[]');
        res(all.find(r => r.roomId === id));
      }, 200)
    ),
  create: (room: Room): Promise<Room> =>
    new Promise(res =>
      setTimeout(() => {
        const all: Room[] = JSON.parse(localStorage.getItem('rooms') || '[]');
        all.push(room);
        localStorage.setItem('rooms', JSON.stringify(all));
        res(room);
      }, 200)
    ),
  update: (room: Room): Promise<Room> =>
    new Promise(res =>
      setTimeout(() => {
        let all: Room[] = JSON.parse(localStorage.getItem('rooms') || '[]');
        all = all.map(r => (r.roomId === room.roomId ? room : r));
        localStorage.setItem('rooms', JSON.stringify(all));
        res(room);
      }, 200)
    ),
  remove: (id: string): Promise<string> =>
    new Promise(res =>
      setTimeout(() => {
        let all: Room[] = JSON.parse(localStorage.getItem('rooms') || '[]');
        all = all.filter(r => r.roomId !== id);
        localStorage.setItem('rooms', JSON.stringify(all));
        res(id);
      }, 200)
    ),
};

export const fetchRooms = createAsyncThunk<Room[], void>( 
  'rooms/fetchAll',
  async () => await fakeApi.fetchAll()
);

export const fetchRoom = createAsyncThunk<Room | undefined, string>(
  'rooms/fetchOne',
  async id => await fakeApi.fetchOne(id)
);

export const createRoom = createAsyncThunk<Room, Room>(
  'rooms/create',
  async (room: Room) => await fakeApi.create(room)
);

export const updateRoom = createAsyncThunk<Room, Room>(
  'rooms/update',
  async (room: Room) => await fakeApi.update(room)
);

export const deleteRoom = createAsyncThunk<string, string>(
  'rooms/delete',
  async id => await fakeApi.remove(id)
);

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  } as RoomsState, // Aplica la interfaz RoomsState al initialState
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchRooms.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch rooms.';
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        const upd = action.payload;
        state.items = state.items.map(r => (r.roomId === upd.roomId ? upd : r));
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.items = state.items.filter(r => r.roomId !== action.payload);
      });
  },
});

export default roomsSlice.reducer;