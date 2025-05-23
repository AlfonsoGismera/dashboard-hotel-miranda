import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

const Overlay = styled.div`
  position:fixed; top:0; left:0; right:0; bottom:0;
  background:rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:1000;
`;
const ModalBox = styled.div`
  background:${({theme})=>theme.background}; padding:1.5rem; border-radius:0.5rem; width:320px; position:relative;
`;
const Close = styled.button`
  position:absolute; top:8px; right:8px; border:none; background:transparent; cursor:pointer; font-size:1.2rem;
`;
const Field = styled.div`margin-bottom:1rem;`;
const Label = styled.label`display:block; font-weight:bold; margin-bottom:0.25rem;`;
const Input = styled.input`width:100%; padding:0.5rem; border:1px solid #ccc; border-radius:4px;`;
const Actions = styled.div`display:flex; justify-content:flex-end; gap:0.5rem;`;
const Button = styled.button`
  padding:0.4rem 0.8rem; border:none; border-radius:0.25rem; cursor:pointer;
  background:${({bg,theme})=>bg||theme.primary}; color:${({color})=>color||'#fff'};
`;
const ImagePreview = styled.img`
  width:100%; height:150px; object-fit:cover; border-radius:0.25rem; margin-bottom:1rem;
`;

export default function UserModal({ user, isNew, onClose, onSave, setUser, t }) {
  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={e=>e.stopPropagation()}>
        <Close onClick={onClose}>×</Close>
        <h3>{isNew ? t.addUser||'Add User' : t.editUser||'Edit User'}</h3>

        <Field>
          <Label>Reservation ID</Label>
          <Input value={user.reservationId} disabled />
        </Field>
        
        <Field>
          <Label>Image URL</Label>
          <Input value={user.image || ''} onChange={e => setUser(u => ({ ...u, image: e.target.value }))} />
        </Field>

        <Field>
          <Label>{t.guest||'Guest'}</Label>
          <Input value={user.guest} onChange={e=>setUser(u=>({...u,guest:e.target.value}))}/>
        </Field>

        <Field>
          <Label>{t.orderDate||'Order Date'}</Label>
          <Input type="date" value={user.orderDate?.slice(0,10) || ''} onChange={e=>setUser(u=>({...u,orderDate:e.target.value}))}/>
        </Field>

        <Field>
          <Label>{t.checkIn||'Check In'}</Label>
          <Input type="date" value={user.checkIn?.slice(0,10) || ''} onChange={e=>setUser(u=>({...u,checkIn:e.target.value}))}/>
        </Field>

        <Field>
          <Label>{t.checkOut||'Check Out'}</Label>
          <Input type="date" value={user.checkOut?.slice(0,10) || ''} onChange={e=>setUser(u=>({...u,checkOut:e.target.value}))}/>
        </Field>

        <Field>
          <Label>{t.roomType||'Room Type'}</Label>
          <Input value={user.roomType} onChange={e=>setUser(u=>({...u,roomType:e.target.value}))}/>
        </Field>
        <Field>
          <Label>{t.specialRequest||'Room Type'}</Label>
          <Input value={user.specialRequest} onChange={e=>setUser(u=>({...u,specialRequest:e.target.value}))}/>
        </Field>

        <Field>
          <Label>{t.status||'Status'}</Label>
          <select value={user.status} onChange={e=>setUser(u=>({...u,status:e.target.value}))} style={{width:'100%',padding:'0.5rem'}}>
            <option>Pending</option>
            <option>Booked</option>
            <option>Cancelled</option>
            <option>Refunded</option>
          </select>
        </Field>

        <Actions>
          <Button bg="#c25c5c" color="#fff" onClick={onClose}>{t.cancel||'Cancel'}</Button>
          <Button bg="#799283" color="#fff"  onClick={onSave}>{t.save||'Save'}</Button>
        </Actions>
      </ModalBox>
    </Overlay>
  );
}