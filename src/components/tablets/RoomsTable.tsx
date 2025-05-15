import React from 'react';
import styled from 'styled-components';
import { FiChevronUp, FiChevronDown, FiMoreVertical } from 'react-icons/fi';
import { Room, MenuState } from '../../types/rooms';
const TableWrapper = styled.div`overflow-x: auto;`;
const Table = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`position: relative; padding: .75rem; border-bottom: 1px solid ${({ theme }) => theme.borderColor}; cursor: pointer; text-align: left; white-space: nowrap;`;
const SortIcon = styled.span`position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: .75rem;`;
const Td = styled.td`padding: .75rem; vertical-align: middle; white-space: nowrap;`;
const CenterTd = styled(Td)`text-align: center;`;
const NameCell = styled(Td)`display: flex; align-items: center; gap: 1rem; img { width: 90px; height: 55px; border-radius: 4px; object-fit: cover; }`;
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

// Styled Dropdown Menu
const Menu = styled.ul`
  position: absolute;
  right: 0;
  top: 100%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  border-radius: 4px;
  padding: .25rem 0;
  z-index: 1000;
  list-style: none;
`;
const MenuItem = styled.li`
  padding: .5rem 1rem;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: ${({ theme }) => theme.iconActive}; color: #fff; }
`;

interface RoomsTableProps {
  data: Room[];
  sortField: keyof Room;
  sortAsc: boolean;
  onSort: (field: keyof Room) => void;
  onMore: (e: React.MouseEvent, room: Room) => void;
  menu: MenuState;
  onEdit: () => void;
  onDelete: () => void;
  langMap: { [key: string]: string };
}

export const RoomsTable: React.FC<RoomsTableProps> = ({ data, sortField, sortAsc, onSort, onMore, menu, onEdit, onDelete, langMap }) => {
  const fields: (keyof Room)[] = ['roomName', 'bedType', 'roomFloor', 'facilities', 'rate', 'status'];

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            {fields.map(f => (
              <Th key={f} onClick={() => onSort(f)}>
                {langMap[f] || f}
                {sortField === f && (
                  <SortIcon>{sortAsc ? <FiChevronUp /> : <FiChevronDown />}</SortIcon>
                )}
              </Th>
            ))}
            <Th />
          </tr>
        </thead>
        <tbody>
          {data.map(room => (
            <tr key={room.roomId}>
              <NameCell>
                <img src={room.image} alt={room.roomName} />
                <div>
                  <small>{room.roomId}</small><br />
                  <strong>{room.roomName}</strong>
                </div>
              </NameCell>
              <Td>{room.bedType}</Td>
              <Td>{room.roomFloor}</Td>
              <Td>{room.facilities.join(', ')}</Td>
              <Td>{room.rate}</Td>
              <CenterTd>
                <Button $bg={room.status === 'Available' ? 'green' : 'red'} $color="#fff">
                  {langMap[room.status.toLowerCase()] || room.status}
                </Button>
              </CenterTd>
              <CenterTd style={{ position: 'relative' }}>
                <FiMoreVertical style={{ cursor: 'pointer' }} onClick={e => onMore(e, room)} />
                {menu.visible && menu.room === room && (
                  <Menu>
                    <MenuItem onClick={onEdit}>{langMap.edit || 'Edit'}</MenuItem>
                    <MenuItem onClick={onDelete}>{langMap.delete || 'Delete'}</MenuItem>
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
