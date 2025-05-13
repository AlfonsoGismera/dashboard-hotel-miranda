import React from 'react';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';

const Overlay = styled.div`position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);display:flex;justify-content:center;align-items:center;z-index:2000;`;
const ModalBox = styled.div`background:${p=>p.theme.background};padding:1.5rem;border-radius:0.5rem;position:relative;width:320px;max-width:90%;`;
const Close = styled(IoClose)`position:absolute;top:8px;right:8px;cursor:pointer;color:${p=>p.theme.subtitle};`;
const Field = styled.div`margin-bottom:1rem;`;
const Label = styled.label`display:block;font-weight:bold;margin-bottom:0.25rem;`;
const Input = styled.input`width:100%;padding:0.5rem;border:1px solid #ccc;border-radius:4px;`;
const Actions = styled.div`display:flex;justify-content:flex-end;gap:0.5rem;`;
const Button = styled.button`padding:0.3rem 0.6rem;border:none;border-radius:0.25rem;cursor:pointer;background:${p=>p.bg||p.theme.cardBg};color:${p=>p.color||p.theme.text};`;

export default function EmployeeModal({ employee, isNew, onClose, onSave, setEmployee, t, theme }) {
  return (
    <Overlay>
      <ModalBox onClick={e=>e.stopPropagation()}>
        <Close size={20} onClick={onClose} />
        <h3>{isNew ? t.addEmployee : t.editEmployee} {employee.name}</h3>
        <Field><Label>ID</Label><Input value={employee.employeeId} disabled /></Field>
        <Field><Label>{t.name}</Label><Input value={employee.name} onChange={e=>setEmployee({...employee, name:e.target.value})}/></Field>
        <Field><Label>{t.jobDesk}</Label><Input value={employee.jobDesk} onChange={e=>setEmployee({...employee, jobDesk:e.target.value})}/></Field>
        <Field><Label>{t.hireDate}</Label><Input type="date" value={employee.hireDate} onChange={e=>setEmployee({...employee, hireDate:e.target.value})}/></Field>
        <Field><Label>{t.schedule}</Label><Input value={employee.schedule.join(',')} onChange={e=>setEmployee({...employee, schedule:e.target.value.split(',')})}/></Field>
        <Field><Label>{t.contact}</Label><Input value={employee.contact} onChange={e=>setEmployee({...employee, contact:e.target.value})}/></Field>
        <Field><Label>{t.status}</Label><select value={employee.status} onChange={e=>setEmployee({...employee, status:e.target.value})} style={{width:'100%',padding:'0.5rem',borderRadius:'4px'}}>
          <option value="Active">{t.active}</option><option value="Inactive">{t.inactive}</option>
        </select></Field> 
        <Actions>
          <Button onClick={onClose} bg="#c25c5c" color="#fff">{t.cancel}</Button>
          <Button onClick={onSave} bg={theme.subtitle} color="#fff">{t.save}</Button>
        </Actions>
      </ModalBox>
    </Overlay>
  );
}