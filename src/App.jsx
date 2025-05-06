import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Employee from './pages/Employee';
import 'react-calendar/dist/Calendar.css';


function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  console.log('PrivateRoute is running');
  console.log('User in PrivateRoute:', user);
  const shouldRedirect = !user;
  console.log('Should redirect:', shouldRedirect);
  return shouldRedirect ? <Navigate to="/login" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/bookings" element={<PrivateRoute><Layout><Bookings /></Layout></PrivateRoute>} />
        <Route path="/bookings/:id" element={<PrivateRoute><Layout><BookingDetail /></Layout></PrivateRoute>} />
        <Route path="/rooms" element={<PrivateRoute><Layout><Rooms /></Layout></PrivateRoute>} />
        <Route path="/rooms/:id" element={<PrivateRoute><Layout><RoomDetail /></Layout></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><Layout><Users /></Layout></PrivateRoute>} />
        <Route path="/users/:id" element={<PrivateRoute><Layout><UserDetail /></Layout></PrivateRoute>} />
        <Route path="/employee" element={<PrivateRoute><Layout><Employee /></Layout></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}