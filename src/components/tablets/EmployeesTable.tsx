import React from 'react';
import styled from 'styled-components';
import { FiChevronUp, FiChevronDown, FiMoreVertical } from 'react-icons/fi';
import { FaPhoneAlt } from 'react-icons/fa';
import { Employee, MenuState } from '../../types/employees';

const TableWrapper = styled.div`overflow-x:auto;`;
const Table = styled.table`width:100%; border-collapse:collapse;`;
const Th = styled.th`position:relative; padding:.75rem; cursor:pointer; text-align:left; white-space:nowrap; border-bottom:1px solid ${({ theme }) => theme.borderColor};`;
const SortIcon = styled.span`position:absolute; right:8px; top:50%; transform:translateY(-50%); font-size:.75rem;`;
const Td = styled.td`padding:.75rem; vertical-align:middle; white-space:nowrap;`;
const CenterTd = styled(Td)`text-align:center;`;
const NameCell = styled(Td)`display:flex; align-items:center; gap:.5rem; img{width:40px;height:40px;border-radius:10%;object-fit:cover;}`;
const Button = styled.button<{ $bg?: string; $color?: string; $hoverBg?: string }>`
  padding:.3rem .6rem; border:none; border-radius:.25rem; cursor:pointer; font-size:.9rem;
  background:${({ $bg, theme }) => $bg || theme.cardBg};
  color:${({ $color, theme }) => $color || theme.text};
  &:hover{ background:${({ $hoverBg, theme }) => $hoverBg || theme.iconActive}; color: ${({ theme }) => theme.text}; }
`;
const Menu = styled.ul`position:absolute; right:4rem; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.2); border-radius:4px; padding:.25rem 0; z-index:1000; list-style:none;`;
const MenuItem = styled.li`padding:.5rem 1rem; cursor:pointer; white-space:nowrap; &:hover{ background:${({ theme }) => theme.iconActive}; color:#fff; }`;

interface EmployeesTableProps {
  data: Employee[];
  sortField: keyof Employee;
  sortAsc: boolean;
  onSort: (field: keyof Employee) => void;
  onOpenMenu: (e: React.MouseEvent, emp: Employee) => void;
  onViewSchedule: (emp: Employee) => void;
  menu: MenuState;
  onEdit: () => void;
  onDelete: () => void;
  t: { [key: string]: string };
}

export const EmployeesTable: React.FC<EmployeesTableProps> = ({
  data, sortField, sortAsc, onSort, onOpenMenu, onViewSchedule, menu, onEdit, onDelete, t
}) => {
  const fields: (keyof Employee)[] = ['name','jobDesk','schedule','contact','status'];
  return (
    <TableWrapper>
      <Table>
        <thead><tr>
          {fields.map(f=>(
            <Th key={f} onClick={()=>onSort(f)}>
              {t[f]||f}
              {sortField===f && <SortIcon>{sortAsc?<FiChevronUp/>:<FiChevronDown/>}</SortIcon>}
            </Th>
          ))}
          <Th />
        </tr></thead>
        <tbody>
          {data.map(emp=>(
            <tr key={emp.employeeId}>
              <NameCell>
                {emp.image && <img src={emp.image} alt={emp.name}/>}
                <div>
                  <strong>{emp.name}</strong><br/><small>{emp.employeeId}</small><br/><small>{t.joined.replace('{date}',emp.hireDate)}</small>
                </div>
              </NameCell>
              <Td>{emp.jobDesk}</Td>
              <Td>
                {emp.schedule.join(', ')}
                <div style={{cursor:'pointer', fontSize:'0.8rem'}} onClick={()=>onViewSchedule(emp)}>{t.viewSchedule}</div>
              </Td>
              <Td><FaPhoneAlt/> {emp.contact}</Td>
              <CenterTd>
                <Button $bg={emp.status==='Active'?'green':'red'} $color="#fff">{t[emp.status.toLowerCase()]||emp.status}</Button>
              </CenterTd>
              <CenterTd style={{position:'relative'}}>
                <FiMoreVertical style={{cursor:'pointer'}} onClick={e=>onOpenMenu(e,emp)}/>
                {menu.visible && menu.employee===emp && (
                  <Menu>
                    <MenuItem onClick={onEdit}>{t.edit}</MenuItem>
                    <MenuItem onClick={onDelete}>{t.delete}</MenuItem>
                  </Menu>
                )}
              </CenterTd>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};
