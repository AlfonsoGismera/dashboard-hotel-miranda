// src/types/users.ts

export interface User {
  reservationId: string;
  guest: string;
  orderDate: string;
  checkIn: string;   
  checkOut: string;  
  specialRequest: string;
  roomType: string;
  status: 'All' | 'Pending' | 'Booked' | 'Cancelled' | 'Refunded';
  image?: string;
  [key: string]: any; 
}

export interface MenuState {
  visible: boolean;
  x: number;
  y: number;
  user: User | null;
}

export interface UsersProps {} 