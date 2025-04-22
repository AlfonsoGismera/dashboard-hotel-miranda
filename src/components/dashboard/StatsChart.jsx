import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { LanguageContext } from '../../context/LanguageContext';

const data = [
  
  { day: 'Mon', checkIn: 28, checkOut: 18 },
  { day: 'Tue', checkIn: 18, checkOut: 38 },
  { day: 'Wed', checkIn: 8, checkOut: 28 },
  { day: 'Thu', checkIn: 12, checkOut: 22 },
  { day: 'Fri', checkIn: 20, checkOut: 30 },
  { day: 'Sat', checkIn: 25, checkOut: 15 },
  { day: 'Sun', checkIn: 32, checkOut: 20 },
  { day: 'Total', checkIn: 143, checkOut: 171 }
];

const Wrapper = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 0.5rem;
  padding: 1rem;
`;

export default function StatsChart() {
  const { t } = useContext(LanguageContext);
  return (
    <Wrapper>
      <h3>{t.bookings}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="checkIn"  name={t.checkIn || 'Check In'}  stackId="a" />
          <Bar dataKey="checkOut" name={t.checkOut} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </Wrapper>
  );
}
