import React from 'react';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';
import { Room } from '../../types/rooms';

interface RoomModalProps {
  room: Room;
  isNew: boolean;
  t: { [key: string]: string };
  onClose: () => void;
  onSave: () => void;
  setRoom: (room: Room) => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 1.5rem;
  border-radius: .5rem;
  width: 320px;
  max-width: 90%;
  position: relative;
`;

const CloseIcon = styled(IoClose)`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.subtitle};
`;

const Field = styled.div`margin-bottom: 1rem;`;
const Label = styled.label`display: block; font-weight: bold; margin-bottom: .25rem;`;
const Input = styled.input`width: 100%; padding: .5rem; border: 1px solid #ccc; border-radius: 4px;`;
const Actions = styled.div`display: flex; justify-content: flex-end; gap: .5rem;`;
const Button = styled.button<{ $bg?: string; $color?: string }>`
  padding: .3rem .6rem;
  border: none;
  border-radius: .25rem;
  cursor: pointer;
  font-size: .9rem;
  background: ${({ $bg, theme }) => $bg || theme.cardBg};
  color: ${({ $color, theme }) => $color || theme.text};
  &:hover { opacity: .9; }
`;

export const RoomModal: React.FC<RoomModalProps> = ({ room, isNew, t, onClose, onSave, setRoom }) => (
  <Overlay onClick={onClose}>
    <Modal onClick={e => e.stopPropagation()}>
      <CloseIcon size={20} onClick={onClose} />
      <h3>{isNew ? t.addRoom : t.edit} {room.roomName}</h3>
      <Field>
        <Label>{t.roomId}</Label>
        <Input value={room.roomId} disabled />
      </Field>
      <Field>
        <Label>{t.roomName}</Label>
        <Input value={room.roomName} onChange={e => setRoom({ ...room, roomName: e.target.value })} />
      </Field>
      <Field>
        <Label>{t.bedType}</Label>
        <Input value={room.bedType} onChange={e => setRoom({ ...room, bedType: e.target.value })} />
      </Field>
      <Field>
        <Label>{t.roomFloor}</Label>
        <Input value={room.roomFloor} onChange={e => setRoom({ ...room, roomFloor: e.target.value })} />
      </Field>
      <Field>
        <Label>{t.facilities}</Label>
        <Input value={room.facilities.join(',')} onChange={e => setRoom({ ...room, facilities: e.target.value.split(',') })} />
      </Field>
      <Field>
        <Label>{t.rate}</Label>
        <Input value={room.rate} onChange={e => setRoom({ ...room, rate: e.target.value })} />
      </Field>
      <Field>
        <Label>{t.status}</Label>
        <select
          value={room.status}
          onChange={e => setRoom({ ...room, status: e.target.value as 'Available' | 'Booked' })}
          style={{ padding: '.5rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="Available">{t.available}</option>
          <option value="Booked">{t.booked}</option>
        </select>
      </Field>
      <Field>
        <Label>{t.image}</Label>
        <Input value={room.image} onChange={e => setRoom({ ...room, image: e.target.value })} />
      </Field>
      <Actions>
        <Button $bg="#c25c5c" $color="#fff" onClick={onClose}>{t.cancel}</Button>
        <Button $bg={"#4CAF50"} $color="#fff" onClick={onSave}>{t.save}</Button>
      </Actions>
    </Modal>
  </Overlay>
);
