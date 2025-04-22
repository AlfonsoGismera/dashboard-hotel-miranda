import React from 'react';
import styled from 'styled-components';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';


const Wrapper = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 0.5rem;
  padding: 1rem;
`;

export default function MiniCalendar() {
  return (
    <Wrapper>
      <Calendar
        showNeighboringMonth={false}
        value={new Date()}
      />
    </Wrapper>
  );
}
