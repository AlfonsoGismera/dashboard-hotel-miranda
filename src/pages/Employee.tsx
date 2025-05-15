import React, { useState, useMemo, useContext, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import { LanguageContext } from '../context/LanguageContext';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../features/employees/employeesSlice';
import { useAppDispatch } from '../hooks/hooks';
import EmployeeModal from '../components/moldals/EmployeeModal';
import { EmployeesTable } from '../components/tablets/EmployeesTable';
import { Employee, MenuState } from '../types/employees';

const Page = styled.div`padding:1rem;`;
const Header = styled.div`display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;`;
const EntriesInfo = styled.div`color:${({ theme }) => theme.subtitle};`;
const Tabs = styled.div`display:flex; gap:1rem; margin-bottom:1rem; border-bottom:1px solid ${({ theme }) => theme.borderColor};`;
const Tab = styled.div<{ $active?: boolean }>`
  padding:0.5rem 1rem;
  cursor:pointer;
  border-bottom:3px solid ${({ $active, theme }) => ($active ? theme.iconActive : 'transparent')};
  color:${({ $active, theme }) => ($active ? theme.text : theme.subtitle)};
`;
const AddButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;
const PaginationBar = styled.div`display:flex; justify-content:space-between; align-items:center; margin-top:1rem;`;
const PageControls = styled.div`display:flex; gap:0.5rem;`;
const PageButton = styled.button<{ $active?: boolean }>`
  padding:0.4rem 0.8rem;
  border:none;
  border-radius:0.25rem;
  cursor:pointer;
  background:${({ $active, theme }) => ($active ? theme.primary : 'transparent')};
  color:${({ theme }) => theme.text};
  &:hover{background:${({ theme }) => theme.iconActive}; color:#fff;}
`;

export default function Employees() {
  const { t } = useContext(LanguageContext);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const items = useSelector((s: any) => s.employees.items as Employee[]);

  useEffect(() => { dispatch(fetchEmployees()); }, [dispatch]);

  const [page, setPage] = useState<number>(1);
  const [sortField, setSortField] = useState<keyof Employee>('name');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [filter, setFilter] = useState<'All'|'Active'|'Inactive'>('All');
  const [menu, setMenu] = useState<MenuState>({ visible: false, employee: null });
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);

  const statuses = ['All','Active','Inactive'] as const;

  const filtered = useMemo(
    () => items.filter(e => filter === 'All' || e.status === filter),
    [items, filter]
  );
  const sorted = useMemo(
    () => [...filtered].sort((a,b) => {
      const av = a[sortField] as any;
      const bv = b[sortField] as any;
      return av < bv ? (sortAsc ? -1 : 1) : av > bv ? (sortAsc ? 1 : -1) : 0;
    }),
    [filtered, sortField, sortAsc]
  );

  const total = sorted.length;
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);
  const paged = useMemo(
    () => sorted.slice((page - 1) * pageSize, page * pageSize),
    [sorted, page]
  );
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  // Handlers
  const handleSort = (f: keyof Employee) => {
    if (f === sortField) setSortAsc(!sortAsc);
    else { setSortField(f); setSortAsc(true); }
  };
  const onMore = (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation(); setMenu({ visible: true, employee: emp });
  };
  const closeMenu = () => setMenu(m => ({ ...m, visible: false }));
  const handleEdit = () => { if (menu.employee) { setIsNew(false); setEditEmp(menu.employee); closeMenu(); }};
  const handleDelete = () => { if (menu.employee) { dispatch(deleteEmployee(menu.employee.employeeId)); closeMenu(); }};
  const openCreate = () => {
    const max = items.reduce((acc,e) => Math.max(acc, parseInt(e.employeeId.slice(3), 10)), 0);
    setIsNew(true);
    setEditEmp({
      employeeId: `EMP${String(max+1).padStart(3,'0')}`,
      name: 'ADoom Prueba', jobDesk: 'Housekeeper', hireDate: '2021-06-15',
      schedule: ['Wed','Thu'], contact: '+34-600-567-890', status: 'Active',
      image: 'https://randomuser.me/api/portraits/women/22.jpg'
    });
  };
  const handleSave = () => { if (editEmp) { isNew ? dispatch(createEmployee(editEmp)) : dispatch(updateEmployee(editEmp)); setEditEmp(null); }};

  return (
    <Page onClick={closeMenu}>
      <Header>
        <Tabs>
          {statuses.map(s => (
            <Tab key={s} $active={filter===s} onClick={() => { setFilter(s); setPage(1); }}>
              {t[s.toLowerCase()] || s}
            </Tab>
          ))}
        </Tabs>
        <AddButton onClick={openCreate}>{t.addEmployee || 'Add Employee'}</AddButton>
      </Header>

      <EmployeesTable
        data={paged}
        sortField={sortField}
        sortAsc={sortAsc}
        onSort={handleSort}
        onOpenMenu={onMore}
        onViewSchedule={() => {}}
        menu={menu}
        onEdit={handleEdit}
        onDelete={handleDelete}
        t={t}
      />

      <PaginationBar>
        <EntriesInfo>
          {t.entriesInfo.replace('{start}', String(start)).replace('{end}', String(end)).replace('{total}', String(total))}
        </EntriesInfo>
        <PageControls>
          <PageButton onClick={() => page>1 && setPage(page-1)} disabled={page===1}>{t.previous}</PageButton>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageButton key={i} $active={page===i+1} onClick={() => setPage(i+1)}>
              {i+1}
            </PageButton>
          ))}
          <PageButton onClick={() => page<totalPages && setPage(page+1)} disabled={page===totalPages}>{t.next}</PageButton>
        </PageControls>
      </PaginationBar>

      {editEmp && (
        <EmployeeModal
          employee={editEmp}
          isNew={isNew}
          onClose={() => setEditEmp(null)}
          onSave={handleSave}
          setEmployee={setEditEmp}
          t={t}
          theme={theme}
        />
      )}
    </Page>
  );
}
