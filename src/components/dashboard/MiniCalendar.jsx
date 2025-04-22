import React from 'react';
import styled, { useTheme } from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Wrapper = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 0.5rem;
  height: 100%;
`;

const Separator = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.gray || '#ccc'};
  margin: 1rem 0;
`;

const ReservationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ReservationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 0.5rem;
`;

const LeftBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RoomImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.5rem;
`;

const GuestInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const OwnerBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OwnerAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`;

const DaysInfo = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.transparent};
  border: 2px solid ${({ color }) => color || '#999'};
  color: ${({ color }) => color || '#999'};
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: bold;
`;
const ViewMoreContainer = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const ViewMoreText = styled.span`
  color: ${({ theme }) => theme.text }; 
  cursor: pointer;
`;

// Datos de días reservados
const reservedDates = [
  { date: '2025-04-03', color: 'green' },
  { date: '2025-04-16', color: 'red' },
  { date: '2025-04-17', color: 'red' },
  { date: '2025-04-18', color: 'red' },
  { date: '2025-04-30', color: 'orange' }
];

// Agrupar por color
const groupedByColor = reservedDates.reduce((acc, { color, date }) => {
  if (!acc[color]) acc[color] = [];
  acc[color].push(date);
  return acc;
}, {});

const reservations = [
  {
    room: 'Queen Bed A-12324',
    imageUrl: 'https://images.unsplash.com/photo-1643913592251-3f256e90ec0b?w=500&auto=format&fit=crop&q=60', 
    guest: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60',
    reservedAgo: '2 days ago',
    color: 'green'
  },
  {
    room: 'Deluxe Room B-1324',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1670076505419-99468d952c61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGFiaXRhY2lvbmVzfGVufDB8fDB8fHww', 
    guest: 'Alice Smith',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ibmF8ZW58MHx8MHx8fDA%3D',
    reservedAgo: '1 day ago',
    color: 'red'
  },
  {
    room: 'King Big C-2445',
    imageUrl: 'https://images.unsplash.com/photo-1720420021124-4e18564e070f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aGFiaXRhY2lvbmVzfGVufDB8fDB8fHww', 
    guest: 'Robert Brown',
    avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBlcnNvYm5hfGVufDB8fDB8fHww',
    reservedAgo: 'Today',
    color: 'orange'
  }
];

export default function MiniCalendar() {
  const theme = useTheme();

  const getColorByDate = (date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();

    const found = reservedDates.find((res) => {
      const resDate = new Date(res.date);
      return (
        resDate.getFullYear() === y &&
        resDate.getMonth() === m &&
        resDate.getDate() === d
      );
    });

    return found?.color || null;
  };

  return (
    <Wrapper>
      <Calendar
        showNeighboringMonth={false}
        value={new Date()}
        tileClassName={({ date }) => {
          const color = getColorByDate(date);
          return color ? `reserved-${color}` : null;
        }}
      />

      <Separator />

      <ReservationList>
        {reservations.map((res, i) => (
          <ReservationItem key={i}>
            <LeftBlock>
            <RoomImage src={res.imageUrl} alt="Room" />
              <GuestInfo>
                <strong>{res.room}</strong>                
                <OwnerBlock>
                  <OwnerAvatar src={res.avatar} alt="Owner" />
                  <div>
                    <div>{res.guest}</div>
                    <small>Reserved {res.reservedAgo}</small>
                  </div>
                </OwnerBlock>
              </GuestInfo>
            </LeftBlock>
            <DaysInfo color={theme[res.color] || res.color}>
              {groupedByColor[res.color]?.length || 0} {groupedByColor[res.color]?.length === 1 ? 'day' : 'days'}
            </DaysInfo>
          </ReservationItem>
        ))}
      </ReservationList>
      <ViewMoreContainer>
        <ViewMoreText>View More</ViewMoreText>
      </ViewMoreContainer>
    </Wrapper>
  );
}
