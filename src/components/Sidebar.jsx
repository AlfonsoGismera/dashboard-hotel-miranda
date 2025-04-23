// src/components/Sidebar.jsx
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { LanguageContext } from '../context/LanguageContext';
import { FaHotel } from 'react-icons/fa6';
import { GiStarsStack } from 'react-icons/gi';
import { TbPuzzle2 } from 'react-icons/tb';
import { IoMdKey } from 'react-icons/io';
import { LuCalendarCheck2 } from 'react-icons/lu';
import { IoPeopleOutline } from 'react-icons/io5';
import { HiOutlinePuzzlePiece } from 'react-icons/hi2';

const Sider = styled.nav`
  width: 200px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  margin-bottom: 2rem;
`;
const IconColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;
const StarsIcon = styled(GiStarsStack)`
  color: ${({ theme }) => theme.chart.barSecondary};
  font-size: 1.25rem;
`;

const HotelIcon = styled(FaHotel)`
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;
const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.75rem;
`;

const HotelName = styled.h1`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const Subtitle = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.subtitle};
`;

const Links = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 1rem;
`;

const LinkItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  border-radius: 0.25rem;
  &.active, &:hover {
    background: ${({ theme }) => theme.iconActive};
    color: #fff;
  }
`;

const Footer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 1rem;
  text-align: center;
`;

const FooterCard = styled.div`
  background-image: url('https://plus.unsplash.com/premium_photo-1669077046750-bef49171b059?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGV0cmElMjBoJTIwbG9nb3xlbnwwfHwwfHx8MA%3D%3D');
  background-size: cover;
  background-position: center;
  height: 40px;
  width: 40px;
  border-radius: 0.5rem;
  margin: 0 auto;
  margin-bottom: 0.5rem;
`;

const FooterName = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;


const ContactButton = styled.button`
  background: #EBF1EF;
  color: #135846;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  &:hover {
    background: #CDE6E0;
  }
  ${({ theme }) => theme.mode === 'dark' && `
    background: #135846;
    color: #EBF1EF;
    &:hover { background: #0f3d33; }
  `}
`;

const FooterLegal = styled.div`
  font-size: 0.6rem;
  color: ${({ theme }) => theme.subtitle};
  margin-top: 0.5rem;
`;

export default function Sidebar() {
  const { t } = useContext(LanguageContext);

  return (
    <Sider>
       <div>
        <Header>
          <IconColumn>
            <StarsIcon />
            <HotelIcon />
          </IconColumn>
          <TextColumn>
            <HotelName>Travl</HotelName>
            <Subtitle>{t.hotelSubtitle || 'Hotel admin dashboard'}</Subtitle>
          </TextColumn>
        </Header>
        <Links>
          <LinkItem to="/"><TbPuzzle2 /> Dashboard</LinkItem>
          <LinkItem to="/rooms"><IoMdKey /> {t.rooms}</LinkItem>
          <LinkItem to="/bookings"><LuCalendarCheck2 /> {t.bookings}</LinkItem>
          <LinkItem to="/users"><IoPeopleOutline /> {t.users}</LinkItem>
          <LinkItem to="/contact"><HiOutlinePuzzlePiece /> {t.contact}</LinkItem>
        </Links>
      </div>
      <Footer>
        <FooterCard />
        <FooterName>{t.hotelName}</FooterName>
        <ContactButton>{t.contactUs || 'Contact Us'}</ContactButton>
        <FooterLegal>© 2025 Travl All rights reserved.</FooterLegal>
      </Footer>
    </Sider>
  );
}
