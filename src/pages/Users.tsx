import React, { useState, useMemo, useContext, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { format, isValid } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { LanguageContext } from '../context/LanguageContext';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../features/users/usersSlice';
import { useAppDispatch } from '../hooks/hooks';
import UserModal from '../components/UserModal';
import { UsersTable } from '../components/tablets/UsersTable';
import { User, MenuState } from '../types/users';

const Page = styled.div`padding: 1rem; position: relative;`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`;
const Tabs = styled.div`display: flex; gap: 1rem; margin-bottom: 1rem; border-bottom: 1px solid ${({ theme }) => theme.borderColor};`;
const Tab = styled.div<{ $active?: boolean }>`
  padding: .5rem 1rem;
  cursor: pointer;
  border-bottom: 3px solid
    ${({ $active, theme }) => ($active ? theme.iconActive : 'transparent')};
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
const NoteOverlay = styled.div`/* ...same overlay styles... */`;
const NoteBox = styled.div`/* ... */`;
const CloseNote = styled.button`/* ... */`;

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
    () => users.filter(u => filter==='All'||u.status===filter),
    [users, filter]
  );
  const sorted = useMemo(() => {
    const arr = [...filtered].sort((a,b)=>{
      let av=a[sortField], bv=b[sortField];
      if (typeof sortField === 'string' && sortField.toLowerCase().includes('date')) {
        av=new Date(av as string); bv=new Date(bv as string);
      }
      if(!isValid(av as any)||!isValid(bv as any)) return 0;
      return av < bv ? (sortAsc ? -1 : 1) : av > bv ? (sortAsc ? 1 : -1) : 0;
    });
    return arr;
  },[filtered,sortField,sortAsc]);

  const pageSize=10;
  const total = sorted.length;
  const totalPages = Math.ceil(total/pageSize);
  const paged = sorted.slice((page-1)*pageSize, page*pageSize);

  // Handlers
  const handleSort = (field: keyof User) => {
    if(field===sortField) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };
  const handleMore = (e: React.MouseEvent, u: User) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenu({ visible:true, x:rect.right, y:rect.top, user:u });
  };
  const closeMenu = () => setMenu(m=>({ ...m, visible:false }));
  const handleEdit = () => { setIsNew(false); setEditUser(menu.user); closeMenu(); };
  const handleDelete = () => { if(menu.user?.reservationId) dispatch(deleteUser(menu.user.reservationId)); closeMenu(); };
  const openCreate = () => { /* calculate new ID... */ setIsNew(true); /* setEditUser(...) */ };
  const handleSave = () => { if(editUser){ isNew?dispatch(createUser(editUser)):dispatch(updateUser(editUser)); setEditUser(null);} };

  return (
    <Page onClick={closeMenu}>
      <Header>
        <Tabs>
          {statuses.map(s=>(
            <Tab key={s} $active={filter===s} onClick={()=>{setFilter(s); setPage(1);}}>
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
        menu={menu}
        lang={lang}
      />

      {/* Paginación */}
      <PaginationBar>
        <div>{`${(page-1)*pageSize+1}-${Math.min(page*pageSize,total)} of ${total}`}</div>
        <PageControls>
          <PageButton onClick={()=>page>1&&setPage(page-1)} disabled={page===1}>{t.previous||'Prev'}</PageButton>
          {Array.from({length:totalPages},(_,i)=>(
            <PageButton key={i} $active={page===i+1} onClick={()=>setPage(i+1)}>
              {i+1}
            </PageButton>
          ))}
          <PageButton onClick={()=>page<totalPages&&setPage(page+1)} disabled={page===totalPages}>{t.next||'Next'}</PageButton>
        </PageControls>
      </PaginationBar>

      {/* Overlay Notas */}
      {note && (
        <NoteOverlay onClick={()=>setNote(null)}>
          <NoteBox onClick={e=>e.stopPropagation()}>
            <CloseNote onClick={()=>setNote(null)}>×</CloseNote>
            <p>{note}</p>
          </NoteBox>
        </NoteOverlay>
      )}

      {/* Modal Crear/Editar */}
      {editUser && (
        <UserModal
          user={editUser}
          isNew={isNew}
          onClose={()=>setEditUser(null)}
          onSave={handleSave}
          setUser={setEditUser}
          t={t}
        />
      )}
    </Page>
  );
}
