// src/components/BookingList.jsx
import React, { useContext } from 'react';
import styled from 'styled-components';
import { LanguageContext } from '../../context/LanguageContext';

const List = styled.ul`
  background: ${({ theme }) => theme.background};
  border-radius: 0.5rem;
  padding: 1rem;
  list-style: none;
  color: ${({ theme }) => theme.text};
  h3 { margin-top: 0; }
  button {
    margin-top: 1rem;
    background: ${({ theme }) => theme.primary};
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
  }
`;

export default function BookingList() {
  const { t } = useContext(LanguageContext);
  const items = [
    { room: 'Queen Bed A-1234', guest: 'James Salazar', time: '2h ago', badge: 3 },
    { room: 'Deluxe Room B-1234', guest: 'Angela Moss',  time: '4h ago', badge: 5 }
  ];

  return (
    <List>
      <h3>{t.recentBookingSchedule}</h3>
      {items.map((x,i) => (
        <li key={i} style={{ display:'flex', justifyContent:'space-between', margin:'0.5rem 0' }}>
          <div>
            <strong>{x.room}</strong><br/>
            <small>{x.guest} • {x.time}</small>
          </div>
          <span>{x.badge}</span>
        </li>
      ))}
      <button>{t.viewMore}</button>
    </List>
  );
}
