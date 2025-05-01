import React, { useState, useMemo, useContext, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageContext } from '../context/LanguageContext';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../features/employees/employeesSlice';
import { FiMoreVertical, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { FaPhoneAlt } from 'react-icons/fa';
import EmployeeModal from '../components/EmployeeModal';

const Page = styled.div`padding:1rem;`;
const Header = styled.div`display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;`;
const EntriesInfo = styled.div`color:${({ theme }) => theme.subtitle};`;
const Tabs = styled.div`display:flex; gap:1rem; margin-bottom:1rem; border-bottom:1px solid ${({ theme }) => theme.borderColor};`;
const Tab = styled.div`
  padding:0.5rem 1rem;
  cursor:pointer;
  border-bottom:3px solid ${({ $active, theme }) => $active ? theme.iconActive : 'transparent'};
  color:${({ $active, theme }) => $active ? theme.text : theme.subtitle};
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
const Th = styled.th`
  position:relative; padding:0.75rem;
  border-bottom:1px solid ${({ theme }) => theme.borderColor};
  cursor:pointer; text-align:left;
`;
const SortIcon = styled.span`
  position:absolute; right:8px; top:50%;
  transform:translateY(-50%); font-size:0.75rem;
`;
const Td = styled.td`
  padding:0.75rem; border-bottom:1px solid ${({ theme }) => theme.borderColor};
  vertical-align:middle;
`;
const CenterTd = styled(Td)`text-align:center;`;

const NameCell = styled(Td)`
  display:flex; align-items:center; gap:0.5rem;
  img { width:40px; height:40px; border-radius:10%; object-fit:cover; }
`;

const Button = styled.button`
  padding:0.3rem 0.6rem; border:none; border-radius:0.25rem; cursor:pointer;
  font-size:0.9rem;
  background:${({ $bg, theme }) => $bg||theme.cardBg};
  color:${({ $color, theme }) => $color||theme.text};
  &:hover{ background:${({ $hoverBg, theme }) => $hoverBg||theme.iconActive}; color:#fff; }
`;

const PaginationBar = styled.div`display:flex; justify-content:space-between; align-items:center; margin-top:1rem;`;
const PageControls = styled.div`display:flex; gap:0.5rem;`;
const PageButton = styled.button`
  padding:0.4rem 0.8rem; border:none; border-radius:0.25rem; cursor:pointer;
  background:${({ $active, theme }) => $active? theme.primary : 'transparent'};
  color:${({ $active, theme }) => $active? '#fff' : theme.text};
  &:hover{background:${({ theme }) => theme.iconActive}; color:#fff;}
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
const MenuItem = styled.li`
  padding:0.5rem 1rem; cursor:pointer;
  &:hover{ background: ${({ theme }) => theme.iconActive}; color:#fff; }
`;

export default function Employees(){
  const { t } = useContext(LanguageContext);
  const theme = useTheme();
  const dispatch = useDispatch();
  const items = useSelector(s => s.employees.items);

  useEffect(() => { dispatch(fetchEmployees()) }, [dispatch]);

  const [page,setPage] = useState(1),
        [sortField,setSortField] = useState('name'),
        [sortAsc,setSortAsc] = useState(true),
        [filter,setFilter] = useState('All');
  const [menu,setMenu] = useState({ visible:false, employee:null }),
        [editEmp,setEditEmp] = useState(null),
        [isNew,setIsNew] = useState(false);

  const statuses = ['All','Active','Inactive'];
  const filtered = useMemo(() => items.filter(e => filter==='All' || e.status===filter), [items,filter]);
  const sorted = useMemo(() => [...filtered].sort((a,b) => {
    let av=a[sortField], bv=b[sortField];
    if(av<bv) return sortAsc?-1:1;
    if(av>bv) return sortAsc?1:-1;
    return 0;
  }), [filtered,sortField,sortAsc]);
  const total = sorted.length, pageSize=10, totalPages=Math.ceil(total/pageSize);
  const paged = useMemo(() => sorted.slice((page-1)*pageSize, page*pageSize), [sorted,page]);
  const start = (page-1)*pageSize+1, end = Math.min(page*pageSize,total);

  function headerClick(f){
    if(sortField===f) setSortAsc(!sortAsc);
    else { setSortField(f); setSortAsc(true); }
  }
  function onMore(e,emp){
    e.stopPropagation();
    setMenu({ visible:true, employee:emp });
  }
  function closeMenu(){ setMenu(m=>({...m,visible:false})); }
  function handleDelete(){ dispatch(deleteEmployee(menu.employee.employeeId)); closeMenu(); }
  function handleEdit(){ setIsNew(false); setEditEmp(menu.employee); closeMenu(); }
  function openCreate(){
    const max = items.reduce((acc,e)=>Math.max(acc, parseInt(e.employeeId.slice(3))), 0);
    setIsNew(true);
    setEditEmp({
      employeeId: `EMP${String(max+1).padStart(3,'0')}`,
      name:'ADoom Prueba', jobDesk:'Housekeeper', hireDate:'2021-06-15', 
      schedule:["Wed, Thu"], 
      contact:'+34-600-567-890', 
      status:'Active', 
      image:'https://randomuser.me/api/portraits/women/22.jpg'
    });
  }
  function handleSave(){
    isNew ? dispatch(createEmployee(editEmp)) : dispatch(updateEmployee(editEmp));
    setEditEmp(null);
  }

  return (
    <Page onClick={closeMenu}>
      <Header>
        <Tabs>
          {statuses.map(s=>(
            <Tab key={s} $active={filter===s} onClick={()=>{ setFilter(s); setPage(1); }}>
              {t[s.toLowerCase()]||s}
            </Tab>
          ))}
        </Tabs>
        <AddButton onClick={openCreate}>{t.addEmployee||'Add Employee'}</AddButton>
      </Header>

      <TableWrapper>
        <Table>
          <thead><tr>
            {['name','jobDesk','schedule','contact','status'].map(f=>(
              <Th key={f} onClick={()=>headerClick(f)}>
                {t[f]||f}
                {sortField===f && <SortIcon>{sortAsc?<FiChevronUp/>:<FiChevronDown/>}</SortIcon>}
              </Th>
            ))}
            <Th></Th>
          </tr></thead>
          <tbody>
            {paged.map(emp=>(
              <tr key={emp.employeeId}>
                <NameCell>
                  {emp.image && <img src={emp.image} alt={emp.name}/>}
                  <div>
                    <strong>{emp.name}</strong><br/>
                    <small>{emp.employeeId}</small><br/>
                    <small>Joined on {emp.hireDate}</small>
                  </div>
                </NameCell>
                <Td>{emp.jobDesk}</Td>
                <Td>
                {emp.schedule.join(', ')}
                <div style={{ color: 'green', fontSize: '0.8rem', marginBottom: '4px' }}>View Schedule</div>
                </Td>
                
                <Td><FaPhoneAlt/> {emp.contact}</Td>
                <CenterTd>
                  <Button $bg={emp.status==='Active'?'green':'red'} $color="#fff">
                    {t[emp.status.toLowerCase()]||emp.status}
                  </Button>
                </CenterTd>
                <CenterTd style={{position:'relative'}}>
                  <FiMoreVertical onClick={e=>onMore(e,emp)} style={{cursor:'pointer'}}/>
                  {menu.visible && menu.employee===emp && (
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
        <EntriesInfo>
          {t.entriesInfo.replace('{start}',start).replace('{end}',end).replace('{total}',total)}
        </EntriesInfo>
        <PageControls>
          <PageButton onClick={()=>page>1&&setPage(page-1)} disabled={page===1}>{t.previous}</PageButton>
          {Array.from({length:totalPages},(_,i)=>(
            <PageButton key={i} $active={page===i+1} onClick={()=>setPage(i+1)}>{i+1}</PageButton>
          ))}
          <PageButton onClick={()=>page<totalPages&&setPage(page+1)} disabled={page===totalPages}>{t.next}</PageButton>
        </PageControls>
      </PaginationBar>

      {editEmp && 
        <EmployeeModal
          employee={editEmp}
          isNew={isNew}
          onClose={()=>setEditEmp(null)}
          onSave={handleSave}
          setEmployee={setEditEmp}
          t={t}
          theme={theme}
        />
      }
    </Page>
  );
}
