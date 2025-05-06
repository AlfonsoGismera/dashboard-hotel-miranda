// src/components/Sidebar.jsx
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
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
  overflow-y: auto;     
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
    border-left: 0.2rem solid #E23428;
    color:#E23428;
  }
`;

// lo que antes era FooterCard lo colocamos justo tras los links
const FooterCard = styled.div`
  width: calc(100% - 2rem);
  background: ${({ theme }) => theme.cardBg};
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  margin: 1rem;
  margin-top: 4rem;
`;

const FooterAvatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 0.5rem;
  object-fit: cover;
  margin-top: -2rem;
`;

const FooterName = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
`;

const FooterEmail = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.subtitle};
`;

const ContactButton = styled.button`
  background: #ffffff;
  color: #135846;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  &:hover { background: #CDE6E0; }
  ${({ theme }) => theme.mode === 'dark' && `
    background: #135846;
    color: #EBF1EF;
    &:hover { background: #0f3d33; }
  `}
`;

const HotelFooter = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin-top: 0.5rem;
`;

const FooterLegal = styled.div`
  font-size: 0.6rem;
  color: ${({ theme }) => theme.subtitle};
  text-align: center;
  margin-top: 0.25rem;
`;

export default function Sidebar() {
  const { t } = useContext(LanguageContext);
  const { logout, user } = useContext(AuthContext);

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
            <Subtitle>{t.hotelSubtitle}</Subtitle>
          </TextColumn>
        </Header>
        <Links>
          <LinkItem to="/"><TbPuzzle2 /> {t.dashboard}</LinkItem>
          <LinkItem to="/rooms"><IoMdKey /> {t.rooms}</LinkItem>
          <LinkItem to="/bookings"><LuCalendarCheck2 /> {t.bookings}</LinkItem>
          <LinkItem to="/users"><IoPeopleOutline /> {t.users}</LinkItem>
          <LinkItem to="/employee"><HiOutlinePuzzlePiece /> {t.Employee}</LinkItem>
        </Links>
        <FooterCard>
          <FooterAvatar src="https://randomuser.me/api/portraits/women/10.jpg" alt={user.name} />
          <FooterName>Johana Martín</FooterName>
          <FooterEmail>{user.email || 'Johana_Martin@mail.com'}</FooterEmail>
          <ContactButton onClick={logout}>{t.logout}</ContactButton>
        </FooterCard>
      </div>
      <HotelFooter>{t.hotelName}</HotelFooter>
      <FooterLegal>© 2025 Travl All Rights Reserved</FooterLegal>
    </Sider>
  );
}
