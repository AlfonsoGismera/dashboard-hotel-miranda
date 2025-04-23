import React, { useState, useMemo, useContext } from 'react';
import styled from 'styled-components';
import { LanguageContext } from '../context/LanguageContext';
import data from '../data/guest.json';

const Page = styled.div`padding:1rem;`;
const Controls = styled.div`display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:1rem;`;
const Select = styled.select`padding:0.5rem;`;
const Table = styled.table`width:100%; border-collapse:collapse;`;
const Th = styled.th`text-align:left; padding:0.5rem; border-bottom:1px solid ${({theme})=>theme.borderColor}; cursor:pointer;`;
const Td = styled.td`padding:0.5rem; border-bottom:1px solid ${({theme})=>theme.borderColor}; vertical-align:top;`;
const Button = styled.button`padding:0.25rem 0.5rem; border:none; border-radius:0.25rem; cursor:pointer;`;

export default function Guests() {
  const { t } = useContext(LanguageContext);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('orderDate');
  const [sortAsc, setSortAsc] = useState(true);
  const [filter, setFilter] = useState('All');
  const pageSize = 10;

  const filtered = useMemo(() => data.filter(r => filter==='All' || r.status===filter), [filter]);
  const sorted = useMemo(() => [...filtered].sort((a,b)=>{
    let v = a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0;
    return sortAsc ? v : -v;
  }), [filtered, sortField, sortAsc]);
  const paged = useMemo(() => sorted.slice((page-1)*pageSize, page*pageSize), [sorted, page]);
  const totalPages = Math.ceil(filtered.length/pageSize);

  function headerClick(field) {
    if(sortField===field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  }

  return (
    <Page>
      <h1>{t.guestsPageTitle||'Guests'}</h1>
      <Controls>
        <Select value={filter} onChange={e=>{setFilter(e.target.value); setPage(1);}}>
          <option>All</option><option>Pending</option><option>Booked</option><option>Cancelled</option><option>Refunded</option>
        </Select>
      </Controls>
      <Table>
        <thead>
          <tr>
            <Th onClick={()=>headerClick('guest')}>{t.guest||'Guest'}</Th>
            <Th onClick={()=>headerClick('orderDate')}>{t.orderDate||'Order Date'}</Th>
            <Th onClick={()=>headerClick('checkIn')}>{t.checkIn||'Check In'}</Th>
            <Th onClick={()=>headerClick('checkOut')}>{t.checkOut||'Check Out'}</Th>
            <Th>{t.specialRequest||'Special Request'}</Th>
            <Th>{t.roomType||'Room Type'}</Th>
            <Th onClick={()=>headerClick('status')}>{t.status||'Status'}</Th>
            <Th>{t.email||'Email'}</Th>
            <Th>{t.phone||'Phone'}</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {paged.map((r,i)=>(<tr key={i}>
            <Td><strong>{r.guest}</strong><br/><small>{r.reservationId}</small></Td>
            <Td>{new Date(r.orderDate).toLocaleString()}</Td>
            <Td>{new Date(r.checkIn).toLocaleDateString()}</Td>
            <Td>{new Date(r.checkOut).toLocaleDateString()}</Td>
            <Td><Button onClick={()=>alert(r.specialRequest)}>{t.viewNotes||'View Notes'}</Button></Td>
            <Td>{r.roomType}</Td>
            <Td><Button style={{background: r.status==='Checked In'?'green':r.status==='Checked Out'?'red':'orange', color:'#fff'}}>{r.status}</Button></Td>
            <Td>{r.email}</Td>
            <Td>{r.phone}</Td>
            <Td><Button>...</Button></Td>
          </tr>))}
        </tbody>
      </Table>
      <div style={{marginTop:'1rem'}}>
        <Button onClick={()=>page>1&&setPage(p=>p-1)} disabled={page===1}>{t.previous||'Previous'}</Button>
        <span style={{margin:'0 1rem'}}>{page}/{totalPages}</span>
        <Button onClick={()=>page<totalPages&&setPage(p=>p+1)} disabled={page===totalPages}>{t.next||'Next'}</Button>
      </div>
    </Page>
  );
}