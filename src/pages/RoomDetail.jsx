import { useParams } from 'react-router-dom';
export default function RoomDetail() { const { id } = useParams(); return <h1>Room Prueba {id}</h1>; }