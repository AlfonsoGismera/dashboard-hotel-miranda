import React, { useState, useMemo, useEffect, useContext } from 'react';
import styled, { useTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import { LanguageContext } from '../context/LanguageContext';
import { fetchRooms, createRoom, updateRoom, deleteRoom } from '../features/rooms/roomsSlice';
import { useAppDispatch } from '../hooks/hooks';
import { RoomModal } from '../components/moldals/RoomModal';
import { RoomsTable } from '../components/tablets/RoomsTable';
import { Room, MenuState } from '../types/rooms';
const Page = styled.div`padding: 1rem; position: relative;`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`;
const Tabs = styled.div`display: flex; gap: 1rem; margin-bottom: 1rem; border-bottom: 1px solid ${({ theme }) => theme.borderColor};`;
const Tab = styled.div<{ $active?: boolean }>`
  padding: .5rem 1rem;
  cursor: pointer;
  border-bottom: 3px solid ${({ $active, theme }) => ($active ? theme.iconActive : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.text : theme.subtitle)};
`;
const AddButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
  border: none;
  padding: .5rem 1rem;
  border-radius: .25rem;
  cursor: pointer;
  &:hover { opacity:.9 }
`;
const PaginationBar = styled.div`display:flex; justify-content:space-between; margin-top:1rem;`;
const PageControls = styled.div`display:flex; gap:.5rem;`;
const PageButton = styled.button<{ $active?: boolean }>`
  padding:.4rem .8rem;
  border:none;
  border-radius:.25rem;
  cursor:pointer;
  background:${({ $active, theme }) => ($active ? theme.primary : 'transparent')};
  color:${({ theme }) => theme.text};
  &:hover { background:${({ theme }) => theme.iconActive}; color:#fff }
`;

const initialMenu: MenuState = { visible: false, room: null, x: 0, y: 0 };

export default function Rooms() {
  const { t, lang } = useContext(LanguageContext);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const rooms = useSelector((s: any) => s.rooms.items || []);

  useEffect(() => { dispatch(fetchRooms()); }, [dispatch]);

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'All'|'Available'|'Booked'>('All');
  const [sortField, setSortField] = useState<keyof Room>('roomName');
  const [sortAsc, setSortAsc] = useState(true);
  const [menu, setMenu] = useState(initialMenu);
  const [editRoom, setEditRoom] = useState<Room|null>(null);
  const [isNew, setIsNew] = useState(false);

  const statuses = ['All','Available','Booked'] as const;
  const filtered = useMemo(() => rooms.filter(r => filter==='All' || r.status===filter), [rooms, filter]);
  const sorted = useMemo(() => [...filtered].sort((a,b) => {
    const av = a[sortField] as any, bv = b[sortField] as any;
    if(av < bv) return sortAsc ? -1 : 1;
    if(av > bv) return sortAsc ? 1 : -1;
    return 0;
  }), [filtered, sortField, sortAsc]);
  const total = sorted.length;
  const pageSize = 10;
  const totalPages = Math.ceil(total/pageSize);
  const paged = useMemo(() => sorted.slice((page-1)*pageSize, page*pageSize), [sorted, page]);
  const start = (page-1)*pageSize + 1;
  const end = Math.min(page*pageSize, total);

  const headerClick = (f: keyof Room) => {
    if(f === sortField) setSortAsc(!sortAsc);
    else { setSortField(f); setSortAsc(true); }
  };
  const handleMore = (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenu({ visible:true, room, x:rect.right, y:rect.top });
  };
  const closeMenu = () => setMenu(m => ({ ...m, visible:false }));
  const handleEdit = () => { if(menu.room) { setIsNew(false); setEditRoom(menu.room); closeMenu(); }};
  const handleDelete = () => { if(menu.room) { dispatch(deleteRoom(menu.room.roomId)); closeMenu(); }};
  const openCreate = () => {
    const maxId = Math.max(0, ...rooms.map(r => parseInt(r.roomId.slice(1),10)));
    const nextId = `R${String(maxId+1).padStart(3,'0')}`;
    setIsNew(true);
    setEditRoom({
      roomId: nextId,
      roomName: 'Example Room',
      bedType: 'Queen',
      roomFloor: '1st',
      facilities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
      rate: '$100/Night',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60',
    });
  };
  const handleSave = () => { if(editRoom) { isNew ? dispatch(createRoom(editRoom)) : dispatch(updateRoom(editRoom)); setEditRoom(null); }};

  const langMap = {
    roomName: t.roomName, bedType: t.bedType, roomFloor: t.roomFloor,
    facilities: t.facilities, rate: t.rate, status: t.status,
    available: t.available, booked: t.booked, edit: t.edit, delete: t.delete
  };

  return (
    <Page onClick={closeMenu}>
      <Header>
        <Tabs>
          {statuses.map(s => (
            <Tab key={s} $active={filter===s} onClick={() => { setFilter(s); setPage(1); }}>
              {t[s.toLowerCase()]||s}
            </Tab>
          ))}
        </Tabs>
        <AddButton onClick={openCreate}>{t.addRoom||'Add Room'}</AddButton>
      </Header>

      <RoomsTable
        data={paged}
        sortField={sortField}
        sortAsc={sortAsc}
        onSort={headerClick}
        onMore={handleMore}
        menu={menu}
        onEdit={handleEdit}
        onDelete={handleDelete}
        langMap={langMap}
      />

      <PaginationBar>
        <div>{`${start}-${end} of ${total}`}</div>
        <PageControls>
          <PageButton onClick={() => page>1 && setPage(page-1)} disabled={page===1}>
            {t.previous||'Prev'}
          </PageButton>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageButton key={i} $active={page===i+1} onClick={() => setPage(i+1)}>
              {i+1}
            </PageButton>
          ))}
          <PageButton onClick={() => page<totalPages && setPage(page+1)} disabled={page===totalPages}>
            {t.next||'Next'}
          </PageButton>
        </PageControls>
      </PaginationBar>

      {editRoom && (
        <RoomModal
          room={editRoom}
          isNew={isNew}
          t={t}
          onClose={() => setEditRoom(null)}
          onSave={handleSave}
          setRoom={setEditRoom}
        />
      )}
    </Page>
  );
}
