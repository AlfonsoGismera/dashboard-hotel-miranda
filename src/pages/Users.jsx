// src/pages/Users.jsx
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { format, isValid } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import es from 'date-fns/locale/es';
import { LanguageContext } from '../context/LanguageContext';
import { fetchUsers, createUser, updateUser, deleteUser } from '../features/users/usersSlice';
import { FiMoreVertical, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import UserModal from '../components/UserModal';

const Page = styled.div`padding:1rem; position:relative;`;
const Header = styled.div`display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;`;
const Tabs = styled.div`display:flex; gap:1rem; margin-bottom:1rem; border-bottom:1px solid ${({theme})=>theme.borderColor};`;
const Tab = styled.div`
  padding:0.5rem 1rem; cursor:pointer;
  border-bottom:3px solid ${({$active,theme})=>$active?theme.iconActive:'transparent'};
  color:${({$active,theme})=>$active?theme.text:theme.subtitle};
`;
const AddButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;
const TableWrapper = styled.div`overflow-x:auto;`;
const Table = styled.table`width:100%; border-collapse:collapse;`;
const Th = styled.th`position:relative; padding:0.75rem; border-bottom:1px solid ${({theme})=>theme.borderColor}; text-align:left; cursor:pointer; white-space:nowrap;`;
const SortIcon = styled.span`position:absolute; right:8px; top:50%; transform:translateY(-50%); font-size:0.75rem;`;
const Td = styled.td`padding:0.75rem; border-bottom:1px solid ${({theme})=>theme.borderColor}; vertical-align:middle; white-space:nowrap;`;
const CenterTd = styled(Td)`text-align:center;`;
const NameCell = styled(Td)`display:flex; align-items:center; gap:0.5rem;
  img { width:40px; height:40px; border-radius:10%; object-fit:cover; }
`;
const Button = styled.button`
  padding:0.3rem 0.6rem; border:none; border-radius:0.25rem; cursor:pointer; font-size:0.9rem;
  background:${({ $bg, theme }) => $bg || theme.cardBg}; color:${({ $color, theme }) => $color || theme.text};
  &:hover{background:${({ $hoverBg, theme }) => $hoverBg || theme.iconActive}; color:#fff;}
`;
const Menu = styled.ul`
  position: absolute;
  right: 4rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  border-radius:4px;
  padding:0.25rem 0;
  z-index:1000;
  list-style:none;
`;
const MenuItem = styled.li`padding:0.5rem 1rem; cursor:pointer; &:hover{background:${({theme})=>theme.iconActive};color:#fff;}`;
const PaginationBar = styled.div`display:flex; justify-content:space-between; align-items:center; margin-top:1rem;`;
const PageControls = styled.div`display:flex; gap:0.5rem;`;
const PageButton = styled.button`
  padding:0.4rem 0.8rem; border:none; border-radius:0.25rem; cursor:pointer;
  background:${({$active,theme})=>$active?theme.primary:'transparent'}; color:${({$active,theme})=>$active?'#fff':theme.text};
  &:hover{background:${({theme})=>theme.iconActive};color:#fff;}
`;

// overlay para special request
const NoteOverlay = styled.div`
  position:fixed; top:0; left:0; right:0; bottom:0;
  background:rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:1500;
`;
const NoteBox = styled.div`
  background:${({theme})=>theme.background}; padding:1rem; border-radius:0.5rem; max-width:300px; position:relative;
`;
const CloseNote = styled.button`
  position:absolute; top:8px; right:8px; border:none; background:transparent; cursor:pointer; font-size:1.2rem;
`;

export default function Users(){
  const { t, lang } = useContext(LanguageContext);
  const theme = useTheme();
  const dispatch = useDispatch();
  const users = useSelector(s=>s.users.items||[]);

  useEffect(()=>{ dispatch(fetchUsers()) },[dispatch]);

  const [page,setPage]=useState(1),
        [sortField,setSortField]=useState('orderDate'),
        [sortAsc,setSortAsc]=useState(true),
        [filter,setFilter]=useState('All'),
        [menu,setMenu]=useState({visible:false,x:0,y:0,user:null}),
        [editUser,setEditUser]=useState(null),
        [isNew,setIsNew]=useState(false),
        [note,setNote]=useState(null);

  const statuses = ['All','Pending','Booked','Cancelled','Refunded'];
  const locale = lang==='es'?es:enUS;

  const filtered = useMemo(()=> users.filter(u=> filter==='All' || u.status===filter ),[users,filter]);
  const sorted   = useMemo(()=> {
    return [...filtered].sort((a,b)=>{
      let av=a[sortField], bv=b[sortField];
      if(sortField.toLowerCase().includes('date')){ av=new Date(av); bv=new Date(bv); }
      if(!isValid(av)||!isValid(bv)) return 0;
      if(av < bv) return sortAsc?-1:1;
      if(av > bv) return sortAsc?1:-1;
      return 0;
    });
  },[filtered,sortField,sortAsc]);

  const total = sorted.length, pageSize=10, totalPages=Math.ceil(total/pageSize);
  const paged = useMemo(()=> sorted.slice((page-1)*pageSize, page*pageSize),[sorted,page]);

  function headerClick(f){
    if(sortField===f) setSortAsc(!sortAsc);
    else { setSortField(f); setSortAsc(true); }
  }

  function onMore(e,u){
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenu({ visible:true, x:rect.right, y:rect.top, user:u });
  }
  function closeMenu(){ setMenu(m=>({...m,visible:false})); }

  function handleDelete(){ dispatch(deleteUser(menu.user.reservationId)); closeMenu(); }
  function handleEdit(){ setIsNew(false); setEditUser(menu.user); closeMenu(); }

  function openCreate(){
    const max = users.reduce((acc,u)=> Math.max(acc, parseInt(u.reservationId.slice(1))||0),0);
    setIsNew(true);
    setEditUser({
      reservationId:'U'+String(max+1).padStart(3,'0'),
      guest:'', orderDate:new Date().toISOString(),
      checkIn:new Date().toISOString(), checkOut:new Date().toISOString(),
      specialRequest:'', roomType:'', status:'Pending',
      image:'https://randomuser.me/api/portraits/women/23.jpg'
    });
  }
  function handleSave(){
    isNew ? dispatch(createUser(editUser)) : dispatch(updateUser(editUser));
    setEditUser(null);
  }

  return (
    <Page onClick={closeMenu}>
      <Header>
        <Tabs>
          {statuses.map(s=>(
            <Tab key={s} $active={filter===s} onClick={()=>{setFilter(s);setPage(1);}}>
              {t[s.toLowerCase()]||s}
            </Tab>
          ))}
        </Tabs>
        <AddButton onClick={openCreate}>{t.addUser||'Add User'}</AddButton>
      </Header>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              {['guest','orderDate','checkIn','checkOut','specialRequest','roomType','status'].map(f=>(
                <Th key={f} onClick={()=>f!=='specialRequest'&&headerClick(f)}>
                  {t[f]||f}
                  {sortField===f && f!=='specialRequest' && <SortIcon>{sortAsc?<FiChevronUp/>:<FiChevronDown/>}</SortIcon>}
                </Th>
              ))}
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {paged.map(u=>(
              <tr key={u.reservationId}>
                <NameCell>
                  <Link to={`/users/${u.reservationId}`}>
                    {u.image && <img src={u.image} alt={u.guest}/>}
                  </Link>
                  <div><strong>{u.guest}</strong><br/><small>{u.reservationId}</small></div>
                </NameCell>
                <Td>
                  {isValid(new Date(u.orderDate))?format(new Date(u.orderDate),'MMM do yyyy',{locale}):'-'}
                  <br/><small>{isValid(new Date(u.orderDate))?format(new Date(u.orderDate),'hh:mm a',{locale}):''}</small>
                </Td>
                <Td>
                  {isValid(new Date(u.checkIn))?format(new Date(u.checkIn),'MMM do yyyy',{locale}):'-'}
                  <br/><small>{isValid(new Date(u.checkIn))?format(new Date(u.checkIn),'hh:mm a',{locale}):''}</small>
                </Td>
                <Td>
                  {isValid(new Date(u.checkOut))?format(new Date(u.checkOut),'MMM do yyyy',{locale}):'-'}
                  <br/><small>{isValid(new Date(u.checkOut))?format(new Date(u.checkOut),'hh:mm a',{locale}):''}</small>
                </Td>
                <CenterTd>
                  <Button $bg={theme.cardBg} $color={theme.text} onClick={()=>setNote(u.specialRequest)}>
                    {t.viewNotes||'View'}
                  </Button>
                </CenterTd>
                <Td>{u.roomType}</Td>
                <CenterTd>
                  <Button $bg={u.status==='Booked'?'green':'red'} $color="#fff">{u.status}</Button>
                </CenterTd>
                <CenterTd style={{position:'relative'}}>
                  <FiMoreVertical style={{cursor:'pointer'}} onClick={e=>onMore(e,u)}/>
                  {menu.visible && menu.user===u && (
                    <Menu>
                      <MenuItem onClick={handleEdit}>{t.edit||'Edit'}</MenuItem>
                      <MenuItem onClick={handleDelete}>{t.delete||'Delete'}</MenuItem>
                    </Menu>
                  )}
                </CenterTd>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      <PaginationBar>
        <div>
          {t.entriesInfo
            .replace('{start}',(page-1)*pageSize+1)
            .replace('{end}',Math.min(page*pageSize,total))
            .replace('{total}',total)
          }
        </div>
        <PageControls>
          <PageButton onClick={()=>page>1&&setPage(page-1)} disabled={page===1}>{t.previous}</PageButton>
          {Array.from({length:totalPages},(_,i)=><PageButton key={i} $active={page===i+1} onClick={()=>setPage(i+1)}>{i+1}</PageButton>)}
          <PageButton onClick={()=>page<totalPages&&setPage(page+1)} disabled={page===totalPages}>{t.next}</PageButton>
        </PageControls>
      </PaginationBar>

      {note && (
        <NoteOverlay onClick={()=>setNote(null)}>
          <NoteBox onClick={e=>e.stopPropagation()}>
            <CloseNote onClick={()=>setNote(null)}>×</CloseNote>
            <p>{note}</p>
          </NoteBox>
        </NoteOverlay>
      )}

      {editUser && (
        <UserModal
          user={editUser}
          isNew={isNew}
          onClose={()=>setEditUser(null)}
          onSave={handleSave}
          setUser={setEditUser}
          t={t}
          theme={theme}
        />
      )}
    </Page>
  );
}
