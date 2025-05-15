// src/types/rooms.d.ts

export interface Room {
  roomId: string;
  roomName: string;
  bedType: string;
  roomFloor: string;
  facilities: string[];
  rate: string;
  status: 'All' | 'Available' | 'Booked';
  image: string;
}

export interface MenuState {
  visible: boolean;
  room: Room | null;
  x?: number;
  y?: number;
}

export interface RoomsState {
  page: number;
  sortField: keyof Room;
  sortAsc: boolean;
  filter: 'All' | 'Available' | 'Booked';
  menu: MenuState;
  editRoom: Room | null;
  isNew: boolean;
}

export interface RoomsProps {}