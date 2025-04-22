import React from 'react';
import styled from 'styled-components';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import MiniCalendar from '../components/dashboard/MiniCalendar';
import StatsChart from '../components/StatsChart';
import BookingList from '../components/BookingList';
import QuickStats from '../components/QuickStats';

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
