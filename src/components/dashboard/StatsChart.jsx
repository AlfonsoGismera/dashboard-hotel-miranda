import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styled, { useTheme } from 'styled-components';
import { LanguageContext } from '../../context/LanguageContext';

const data = [
  { day: 'Mon', checkIn: 28, checkOut: 18 },
  { day: 'Tue', checkIn: 18, checkOut: 28 },
  { day: 'Wed', checkIn: 8,  checkOut: 10 },
  { day: 'Thu', checkIn: 12, checkOut: 22 },
  { day: 'Fri', checkIn: 20, checkOut: 30 },
  { day: 'Sat', checkIn: 25, checkOut: 15 },
  { day: 'Sun', checkIn: 32, checkOut: 20 }

];

const Wrapper = styled.div`
 background: ${({ theme }) => theme.background};
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};

  h3 {
    color: ${({ theme }) => theme.subtitle};
    margin-bottom: 1rem;
  }
`;

export default function StatsChart() {
  const { t } = useContext(LanguageContext);
  const theme = useTheme();

  return (
    <Wrapper>
      <h3>{t.bookings}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          barCategoryGap="20%" // espacio entre grupos de barras
        >
          <XAxis dataKey="day" stroke={theme.text} />
          <YAxis stroke={theme.text} />
          <Tooltip contentStyle={{ backgroundColor: theme.cardBg, border: 'none' }} />
          <Legend />
          <Bar
            dataKey="checkIn"
            name={t.checkIn || 'Check In'}
            fill={theme.chart.barPrimary}
          />
          <Bar
            dataKey="checkOut"
            name={t.checkOut || 'Check Out'}
            fill={theme.chart.barSecondary}
          />
        </BarChart>
      </ResponsiveContainer>
    </Wrapper>
  );
}
