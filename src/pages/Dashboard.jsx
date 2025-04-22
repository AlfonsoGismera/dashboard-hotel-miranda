// src/pages/Dashboard.jsx
import React from 'react';
import styled from 'styled-components';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import SummaryCard from '../components/dashboard/SummaryCard';
import MiniCalendar from '../components/dashboard/MiniCalendar';
import StatsChart from '../components/dashboard/StatsChart';
import BookingList from '../components/dashboard/BookingList';
import QuickStats from '../components/dashboard/QuickStats';

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem;
  grid-template-columns: repeat(12, 1fr);
  @media(max-width: 1024px) { grid-template-columns: repeat(6, 1fr); }
  @media(max-width: 768px)  { grid-template-columns: 1fr; }
`;
const TopCards = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  @media(max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media(max-width: 480px) { grid-template-columns: 1fr; }
`;
const MainSection = styled.div`
  display: grid;
  grid-column: 1 / -1;
  gap: 1rem;
  @media(min-width: 769px) {
    grid-column: 1 / 8;
    grid-template-columns: 1fr;
  }
`;
const SideSection = styled.div`
  display: grid;
  gap: 1rem;
  grid-column: 1 / -1;
  @media(min-width: 769px) { grid-column: 8 / -1; }
  @media(max-width: 480px) { grid-template-columns: repeat(2, 1fr); }
`;
const BottomSection = styled.div`
  grid-column: 1 / -1;
  display: grid;
  gap: 1rem;
  @media(min-width: 769px) { grid-template-columns: 2fr 1fr; }
  @media(max-width: 768px) { grid-template-columns: 1fr; }
`;

export default function Dashboard() {
  return (
    <Grid>
      <TopCards>
        <SummaryCard icon={<Calendar />}    labelKey="newBooking"   value="8,461" />
        <SummaryCard icon={<Clock />}       labelKey="scheduledRoom" value="963"   />
        <SummaryCard icon={<Users />}       labelKey="guests"        value="753"   />
        <SummaryCard icon={<CheckCircle />} labelKey="checkOut"      value="516"   />
      </TopCards>
      <MainSection>
        <MiniCalendar />
        <StatsChart />
      </MainSection>
      <SideSection>
        <QuickStats titleKey="availableToday" value="683" />
        <QuickStats titleKey="soldOutToday"   value="156" />
      </SideSection>
      <BottomSection>
        <BookingList />
        <div>
          <h3>{/* Totals can be translated similarly */}</h3>
          <p>569</p>
          <h3>{/* */}</h3>
          <p>76k</p>
        </div>
      </BottomSection>
    </Grid>
  );
}
