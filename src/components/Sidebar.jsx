import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { LanguageContext } from '../context/LanguageContext';
import { useContext } from 'react';

const Sider = styled.nav`
  width: 200px;
  background: ${({ theme }) => theme.primary};
  color: #fff;
  display: flex;
  flex-direction: column;
`;
const Link = styled(NavLink)`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  &.active { background: rgba(255,255,255,0.2); }
  color: ${({ theme }) => theme.text};
  text-decoration: none;
`;

export default function Sidebar() {
  const { t } = useContext(LanguageContext);
  return (
    <Sider>
      <Link to="/">Dashboard</Link>
      <Link to="/rooms">{t.rooms}</Link>
      <Link to="/bookings">{t.bookings}</Link>
      <Link to="/users">{t.users}</Link>
      <Link to="/contact">{t.contact}</Link>
    </Sider>
  );
}
