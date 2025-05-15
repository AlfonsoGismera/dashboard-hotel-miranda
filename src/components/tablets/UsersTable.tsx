import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { format, isValid } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { FiChevronUp, FiChevronDown, FiMoreVertical } from 'react-icons/fi';
import { User, MenuState } from '../../types/users';

const TableWrapper = styled.div`overflow-x: auto;`;
const Table = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`position: relative; padding: .75rem; border-bottom: 1px solid ${({ theme }) => theme.borderColor}; text-align: left; cursor: pointer; white-space: nowrap;`;
const SortIcon = styled.span`position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: .75rem;`;
const Td = styled.td`padding: .75rem; vertical-align: middle; white-space: nowrap;`;
const CenterTd = styled(Td)`text-align: center;`;
const NameCell = styled(Td)`display: flex; align-items: center; gap: .5rem; img { width: 40px; height: 40px; border-radius: 10%; object-fit: cover; }`;
const Button = styled.button<{ $bg?: string; $color?: string; }>`
  padding: .3rem .6rem;
  border: none;
  border-radius: .25rem;
  cursor: pointer;
  font-size: .9rem;
  background: ${({ $bg, theme }) => $bg || theme.cardBg};
  color: ${({ $color, theme }) => $color || theme.text};
  &:hover { opacity: .9; }
`;

interface UsersTableProps {
  data: User[];
  sortField: keyof User;
  sortAsc: boolean;
  onSort: (field: keyof User) => void;
  onViewNotes: (note: string) => void;
  onOpenMenu: (e: React.MouseEvent, user: User) => void;
  menu: MenuState;
  lang: 'es' | 'en';
}

export const UsersTable: React.FC<UsersTableProps> = ({
  data,
  sortField,
  sortAsc,
  onSort,
  onViewNotes,
  onOpenMenu,
  menu,
  lang,
}) => {
  const locale = lang === 'es' ? es : enUS;
  const fields: (keyof User)[] = ['guest', 'orderDate', 'checkIn', 'checkOut', 'specialRequest', 'roomType', 'status'];

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            {fields.map(f => (
              <Th key={f} onClick={() => f !== 'specialRequest' && onSort(f)}>
                {f}
                {sortField === f && f !== 'specialRequest' && (
                  <SortIcon>{sortAsc ? <FiChevronUp /> : <FiChevronDown />}</SortIcon>
                )}
              </Th>
            ))}
            <Th />
          </tr>
        </thead>
        <tbody>
          {data.map(u => (
            <tr key={u.reservationId}>
              <NameCell>
                <Link to={`/users/${u.reservationId}`}>
                  {u.image && <img src={u.image} alt={u.guest} />}
                </Link>
                <div>
                  <strong>{u.guest}</strong><br />
                  <small>{u.reservationId}</small>
                </div>
              </NameCell>
              {(['orderDate', 'checkIn', 'checkOut'] as (keyof User)[]).map(dateField => {
                const value = u[dateField] as string;
                const date = new Date(value);
                return (
                  <Td key={dateField}>
                    {isValid(date)
                      ? format(date, 'MMM do yyyy', { locale })
                      : '-'}
                    <br />
                    <small>
                      {isValid(date)
                        ? format(date, 'hh:mm a', { locale })
                        : ''}
                    </small>
                  </Td>
                );
              })}
              <CenterTd>
                <Button onClick={() => onViewNotes(u.specialRequest || '')}>View</Button>
              </CenterTd>
              <Td>{u.roomType}</Td>
              <CenterTd>
                <Button $bg={u.status === 'Booked' ? 'green' : 'red'} $color="#fff">
                  {u.status}
                </Button>
              </CenterTd>
              <CenterTd style={{ position: 'relative' }}>
                <FiMoreVertical
                  style={{ cursor: 'pointer' }}
                  onClick={e => onOpenMenu(e, u)}
                />
                {menu.visible && menu.user === u && (
                  <div style={{ position: 'absolute', right: 0, top: '100%' }}>
                    {/* Aquí monta tu <Menu> con acciones Edit/Delete */}
                  </div>
                )}
              </CenterTd>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};