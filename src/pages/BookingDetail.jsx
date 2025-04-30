import { GiSentryGun } from 'react-icons/gi';
import { useParams } from 'react-router-dom';
export default function BookingDetail() { const { id } = useParams(); return <h1>Booking {id}</h1>; }
