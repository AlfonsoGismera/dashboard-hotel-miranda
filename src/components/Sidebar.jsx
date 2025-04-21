import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Sider = styled.nav`
  width: 200px;
  background: ${({ theme }) => theme.primary};
  color: #fff;
  display: flex;
  flex-direction: column;
`;
const Link = styled(NavLink)`
  padding: 0.75rem 1rem;
  &.active { background: rgba(255,255,255,0.2); }
`;

export default function Sidebar() {
  return (
    <Sider>
      <Link to="/">Dashboard</Link>
      <Link to="/rooms">Rooms</Link>
      <Link to="/bookings">Bookings</Link>
      <Link to="/users">Users</Link>
      <Link to="/contact">Contact</Link>
    </Sider>
  );
}
