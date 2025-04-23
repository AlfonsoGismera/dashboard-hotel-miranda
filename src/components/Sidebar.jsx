import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { LanguageContext } from '../context/LanguageContext';
import { useContext } from 'react';
import { IoMdKey } from "react-icons/io";
import { LuCalendarCheck2 } from "react-icons/lu";
import { IoPeopleOutline } from "react-icons/io5";
import { HiOutlinePuzzlePiece } from "react-icons/hi2";
import { TbPuzzle2 } from "react-icons/tb";
import { FaHotel } from "react-icons/fa6";

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
      <div className='hotel_logo'>
        <FaHotel className='hotel_icon' />
        <h1 className='hotel_name'>Travi Hotel</h1>
      </div>
      <Link to="/"><TbPuzzle2 /> Dashboard</Link>
      <Link to="/rooms"><IoMdKey /> {t.rooms}</Link>
      <Link to="/bookings"><LuCalendarCheck2 /> {t.bookings}</Link>
      <Link to="/users"><IoPeopleOutline /> {t.users}</Link>
      <Link to="/contact"><HiOutlinePuzzlePiece /> {t.contact}</Link>
      <div>
        <h2>Travi hotel Admin Dashboard</h2>
        <p>Version 1.0.0</p>
        <p>© 2025 Travi hotel. All rights reserved.</p>
      </div>
    </Sider>
  );
}
