import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { LanguageContext } from '../context/LanguageContext';
import guests from '../data/guests.json';
import rooms from '../data/rooms.json';
import { format } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import es from 'date-fns/locale/es';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// --- layout ---
const Page = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1rem;
  
`;
const Left = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.cardBg};
  padding: 1rem;
  border-radius: 0.5rem;
  
`;
const Right = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
`;

// --- left side ---
const Avatar = styled.img`
  width: 80px; height: 80px;
  border-radius: 0.5rem;
  object-fit: cover;
`;
const Name = styled.h2`margin: .5rem 0;`;
const Id = styled.div`color: ${({ theme }) => theme.subtitle}; font-size: .9rem;`;
const Row = styled.div`margin: .75rem 0;`;
const Label = styled.span`font-weight: bold;`;
const Facilities = styled.div`display:flex; flex-wrap:wrap; gap: .5rem; margin-top:.5rem;`;
const Facility = styled.span`
  background: ${({ theme }) => theme.primary}80;
  color: ${({ theme }) => theme.text};
  padding: 0.7rem 1.5rem;
  border-radius: .25rem;
  font-size: .8rem;
`;
const getEmoji = (facility) => {
    switch (facility.toLowerCase()) {
        case 'tv': return '📺';
        case 'wifi': return '📶';
        case 'air conditioning': return '❄️';
        case 'pool': return '🏊';
        case 'gym': return '🏋️';
        case 'spa': return '💆';
        default: return '✨';
    }
};

// --- right side (carousel) ---
const Slide = styled.div`
  width: 100%; height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;
const Arrow = styled.div`
  position: absolute; top:80%; transform: translateY(-50%);
  padding: 0.5rem; background: ${({ theme }) => theme.primary}aa; border-radius: 10%;
  cursor: pointer; color: #fff;
  ${({ $left }) => $left ? 'left:1rem' : 'right:1rem'};
  &:hover { background: ${({ theme }) => theme.primary}; }
`;
const Banner = styled.div`
  position: absolute;
  top: 1rem;
  right: -3.5rem; 
  width: 200px;
  background: ${({ theme }) => theme.iconActive};
  color: #fff;
  text-align: center;
  padding: 1rem 0;
  transform: rotate(45deg);
  font-weight: bold;
  font-size: 0.9rem;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  text-transform: uppercase;
`;

export default function UserDetail() {
    const { id } = useParams();
    const { t, lang } = useContext(LanguageContext);
    const locale = lang === 'es' ? es : enUS;

    // retrieve guest or fallback test data
    const found = guests.find(g => g.reservationId.toString() === id);
    const guest = {
        reservationId: id,
        guest: 'Invitado de prueba',
        image: 'https://via.placeholder.com/80',
        checkIn: new Date().toISOString(),
        checkOut: new Date(Date.now() + 86400000).toISOString(),
        roomType: 'Deluxe A - 02',
        price: 100,
        specialRequest: 'Sin petición',
        amenities: ['TV', 'WIFI', 'Air Conditioning'],
        ...found
    };

    // extract room number and retrieve room or fallback
    const part = guest.roomType.split(/[-–]/).pop().trim();
    const foundRoom = rooms.find(r => r.roomNumber.toString() === part);
    const room = {
        roomNumber: part,
        roomId: 'RM0000',
        bedType: 'Single Bed',
        description: 'Habitación individual cómoda con escritorio y vistas al jardín.',
        photos: [
            "https://images.unsplash.com/photo-1645131506334-bb66f3f02bcc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFiaXRhY2klQzMlQjNuJTIwZGUlMjBob3RlbHxlbnwwfHwwfHx8MA%3D%3D",
            "https://plus.unsplash.com/premium_photo-1675195905377-e78fccd629c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QkElQzMlOTFPfGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1614929345515-b04334c1bdcb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODZ8fHZpc3RhJTIwZGUlMjBwbGF5YXxlbnwwfHwwfHx8MA%3D%3D"
        ],
        status: 'Available',
        rate: 80,
        discount: 10,
        offerPrice: 72,
        facilities: ['TV', 'WIFI', 'Air Conditioning'],
        ...foundRoom
    };

    const [idx, setIdx] = useState(0);
    const photos = room.photos;

    return (
        <Page>
            <Left>
                <Avatar src={guest.image} alt={guest.guest} />
                <Name>{guest.guest}</Name>
                <Id>ID {guest.reservationId}</Id>

                <Row>
                    <Label>{t.checkIn}:</Label><br />
                    {format(new Date(guest.checkIn), 'PPPp', { locale })}
                </Row>
                <Row>
                    <Label>{t.checkOut}:</Label><br />
                    {format(new Date(guest.checkOut), 'PPPp', { locale })}
                </Row>
                <Row>
                    <Label>{t.roomType}:</Label><br />
                    {guest.roomType}
                </Row>
                <Row>
                    <Label>{t.price}:</Label><br />
                    ${guest.price} / {t.night}
                </Row>
                <Row>
                    <Label>{t.specialRequest}:</Label><br />
                    {guest.specialRequest}
                </Row>
                <Row>
                    <Label>{t.facilities}:</Label>
                    <Facilities>
                        {guest.amenities.map(a => (
                            <Facility key={a}>
                                {getEmoji(a)} {a}
                            </Facility>
                        ))}
                    </Facilities>

                </Row>
            </Left>

            <Right>
                <Banner>{room.status.toLowerCase()}</Banner>
                {photos.length > 0 && <Slide src={photos[idx]} />}

                <Arrow $left onClick={() => setIdx(i => i > 0 ? i - 1 : photos.length - 1)}>
                    <FiChevronLeft size={24} />
                </Arrow>
                <Arrow onClick={() => setIdx(i => i < photos.length - 1 ? i + 1 : 0)}>
                    <FiChevronRight size={24} />
                </Arrow>

                <div style={{
                    position: 'absolute', bottom: '0rem', left: '0rem', color: '#fff',
                    background: '#00000080', padding: '.5rem', borderRadius: '.25rem',
                     width: '100%',
                }}>
                    <div>{room.bedType}</div>
                    <div style={{ fontSize: '.8rem', marginTop: '.5rem' }}>{room.description}</div>
                </div>
            </Right>
        </Page>
    );
}
