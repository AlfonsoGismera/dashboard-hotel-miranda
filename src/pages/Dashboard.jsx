import React from 'react';
import styled from 'styled-components';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import SummaryCard from '../components/dashboard/SummaryCard';
import MiniCalendar from '../components/dashboard/MiniCalendar';
import StatsChart from '../components/dashboard/StatsChart';


const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.pageBackground};
  
`;

const TopCards = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  & > * {
    flex: 1 1 0;
    min-width: 200px;
  }
`;

const TwoColumns = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: stretch;

  & > * {
    flex: 1 1 48%;
    min-width: 300px;
    min-height: 400px; 
    height: 100%;
  }
`;


const OneThird = styled.div`
  flex: 1;
  min-width: 300px;
`;
      const reservedDates = [
  { date: '2025-04-03', color: 'green' },
  { date: '2025-04-16', color: 'red' },
  { date: '2025-04-17', color: 'red' },
  { date: '2025-04-18', color: 'red' },
  { date: '2025-04-30', color: 'orange' }
];

export default function Dashboard() {
  return (
    <PageWrapper>
      <TopCards>
        <SummaryCard icon={<Calendar />} labelKey="newBooking" value="8,461" />
        <SummaryCard icon={<Clock />} labelKey="scheduledRoom" value="963" />
        <SummaryCard icon={<Users />} labelKey="guests" value="753" />
        <SummaryCard icon={<CheckCircle />} labelKey="checkOut" value="516" />
      </TopCards>



<TwoColumns>
  <MiniCalendar reservedDates={reservedDates} />
  <StatsChart />
</TwoColumns>

    </PageWrapper>
  );
}
