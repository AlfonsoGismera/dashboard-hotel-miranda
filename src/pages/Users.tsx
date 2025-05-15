import React, { useState, useMemo, useEffect, useContext } from 'react';
import styled, { useTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import { format, isValid } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { LanguageContext } from '../context/LanguageContext';
import { fetchUsers, createUser, updateUser, deleteUser } from '../features/users/usersSlice';
import { useAppDispatch } from '../hooks/hooks';
import UserModal from '../components/moldals/UserModal';
import { UsersTable } from '../components/tablets/UsersTable';
import { User, MenuState } from '../types/users';

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
  &:hover { opacity: .9; }
`;
const PaginationBar = styled.div`display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;`;
const PageControls = styled.div`display: flex; gap: .5rem;`;
const PageButton = styled.button<{ $active?: boolean }>`
  padding: .4rem .8rem;
  border: none;
  border-radius: .25rem;
  cursor: pointer;
  background: ${({ $active, theme }) => ($active ? theme.primary : 'transparent')};
  color: ${({ theme }) => theme.text};
  &:hover { background: ${({ theme }) => theme.iconActive}; color: #fff; }
`;
// Note overlay styles
const NoteOverlay = styled.div`
  position: fixed; top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.4);
  display: flex; justify-content: center; align-items: center;
  z-index: 1500;
`;
const NoteBox = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 1rem; border-radius: .5rem; max-width:300px; position: relative;
`;
const CloseNote = styled.button`
  position: absolute; top:8px; right:8px; border:none; background:transparent; cursor:pointer; font-size:1.2rem;
`;

const initialMenu: MenuState = { visible: false, x: 0, y: 0, user: null };

export default function Users() {
  const { t, lang } = useContext(LanguageContext);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const users = useSelector((s: any) => s.users.items || []);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'All'|'Pending'|'Booked'|'Cancelled'|'Refunded'>('All');
  const [sortField, setSortField] = useState<keyof User>('orderDate');
  const [sortAsc, setSortAsc] = useState(true);
  const [menu, setMenu] = useState(initialMenu);
  const [editUser, setEditUser] = useState<User|null>(null);
  const [isNew, setIsNew] = useState(false);
  const [note, setNote] = useState<string|null>(null);

  const statuses = ['All','Pending','Booked','Cancelled','Refunded'] as const;
  const locale = lang === 'es' ? es : enUS;

  const filtered = useMemo(
    () => users.filter(u => filter==='All' || u.status===filter),
    [users, filter]
  );
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = a[sortField]; let bv = b[sortField];
      if (typeof sortField === 'string' && sortField.toLowerCase().includes('date')) {
        av = new Date(av as string); bv = new Date(bv as string);
      }
      if (!isValid(av as any) || !isValid(bv as any)) return 0;
      return av < bv ? (sortAsc ? -1 : 1) : av > bv ? (sortAsc ? 1 : -1) : 0;
    });
  }, [filtered, sortField, sortAsc]);

  const total = sorted.length;
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);
  const paged = sorted.slice((page-1)*pageSize, page*pageSize);

  // Handlers
  const handleSort = (field: keyof User) => {
    if (field === sortField) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };
  const handleMore = (e: React.MouseEvent, u: User) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenu({ visible: true, x: rect.right, y: rect.top, user: u });
  };
  const closeMenu = () => setMenu(m => ({ ...m, visible: false }));
  const handleEdit = () => {
    if (menu.user) { setIsNew(false); setEditUser(menu.user); closeMenu(); }
  };
  const handleDelete = () => {
    if (menu.user?.reservationId) { dispatch(deleteUser(menu.user.reservationId)); closeMenu(); }
  };
  const openCreate = () => {
    // generate next reservationId
    const max = users.reduce((acc,u) => Math.max(acc, parseInt(u.reservationId?.slice(1)||'0',10)), 0);
    const newId = 'U'+String(max+1).padStart(3,'0');
    setIsNew(true);
    setEditUser({
      reservationId: newId,
      guest: '',
      orderDate: new Date().toISOString(),
      checkIn: new Date().toISOString(),
      checkOut: new Date().toISOString(),
      specialRequest: '',
      roomType: '',
      status: 'Pending',
      image: 'https://randomuser.me/api/portraits/lego/1.jpg',
    });
  };
  const handleSave = () => {
    if (editUser) {
      isNew ? dispatch(createUser(editUser)) : dispatch(updateUser(editUser));
      setEditUser(null);
    }
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
        <AddButton onClick={openCreate}>{t.addUser||'Add User'}</AddButton>
      </Header>

      <UsersTable
        data={paged}
        sortField={sortField}
        sortAsc={sortAsc}
        onSort={handleSort}
        onViewNotes={setNote}
        onOpenMenu={handleMore}
        onEdit={handleEdit}
        onDelete={handleDelete}
        menu={menu}
        lang={lang}
      />

      <PaginationBar>
        <div>{`${(page-1)*pageSize+1}-${Math.min(page*pageSize,total)} of ${total}`}</div>
        <PageControls>
          <PageButton onClick={() => page>1&&setPage(page-1)} disabled={page===1}>{t.previous||'Prev'}</PageButton>
          {Array.from({length: totalPages},(_,i)=>(<PageButton key={i} $active={page===i+1} onClick={()=>setPage(i+1)}>{i+1}</PageButton>))}
          <PageButton onClick={()=>page<totalPages&&setPage(page+1)} disabled={page===totalPages}>{t.next||'Next'}</PageButton>
        </PageControls>
      </PaginationBar>

      {note && (
        <NoteOverlay onClick={() => setNote(null)}>
          <NoteBox onClick={e=>e.stopPropagation()}>
            <CloseNote onClick={() => setNote(null)}>×</CloseNote>
            <p>{note}</p>
          </NoteBox>
        </NoteOverlay>
      )}

      {editUser && (
        <UserModal
          user={editUser}
          isNew={isNew}
          onClose={() => setEditUser(null)}
          onSave={handleSave}
          setUser={setEditUser}
          t={t}
        />
      )}
    </Page>
  );
}
