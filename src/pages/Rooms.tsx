import React, { useState, useMemo, useContext, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageContext } from '../context/LanguageContext';
import {
  fetchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../features/rooms/roomsSlice';
import { FiMoreVertical, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { Room, MenuState, RoomsProps } from '../types/rooms'; // Importa las interfaces
import { UnknownAction } from 'redux';

const Page = styled.div`padding:1rem; position: relative;`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;
const Tab = styled.div<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-bottom: 3px solid
    ${({ $active, theme }) => ($active ? theme.iconActive : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.text : theme.subtitle)};
`;
const AddButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const TableWrapper = styled.div`overflow-x: auto;`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  position: relative;
  padding: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  cursor: pointer;
  text-align: left;
`;
const SortIcon = styled.span`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
`;
const Td = styled.td`
  padding: 0.75rem;
  vertical-align: middle;
`;
const CenterTd = styled(Td)`text-align: center;`;
const NameCell = styled(Td)`
  display: flex;
  align-items: center;
  gap: 1rem;
  img {
    width: 90px;
    height: 55px;
    border-radius: 4px;
    object-fit: cover;
  }
`;

const Button = styled.button<{ $bg?: string; $color?: string; $hoverBg?: string }>`
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  background: ${({ $bg, theme }) => $bg || theme.cardBg};
  color: ${({ $color, theme }) => $color || theme.text};
  &:hover {
    background: ${({ $hoverBg, theme }) => $hoverBg || theme.iconActive};
    color: ${({ theme }) => theme.text};
  }
`;

const PaginationBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;
const PageControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;
const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  background: ${({ $active, theme }) => ($active ? theme.primary : 'transparent')};
  color: ${({ $active, theme }) =>
    $active ? ' color: ${({ theme }) => theme.text};' : theme.text};
  &:hover {
    background: ${({ theme }) => theme.iconActive};
    color: #fff;
  }
`;

// desplegable
const Menu = styled.ul<{ y?: number }>`
  position: absolute;
  right: 4rem;

  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 0.25rem 0;
  z-index: 1000;
  list-style: none;
`;
const MenuItem = styled.li`
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.iconActive};
    color: #fff;
  }
`;

// modal
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;
const Modal = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 1.5rem;
  border-radius: 0.5rem;
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
const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;
const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const initialMenuState: MenuState = { visible: false, room: null };
const initialEditRoomState: Room = {
  roomId: '',
  roomName: '',
  bedType: '',
  roomFloor: '',
  facilities: [],
  rate: '',
  status: 'Available',
  image: '',
};

interface RoomsState {
  page: number;
  sortField: keyof Room;
  sortAsc: boolean;
  filter: 'All' | 'Available' | 'Booked';
  menu: MenuState;
  editRoom: Room | null;
  isNew: boolean;
}

const Rooms: React.FC<RoomsProps> = () => {
  const { t } = useContext(LanguageContext);
  const theme = useTheme();
  const dispatch = useDispatch();
  const rooms = useSelector((s: { rooms: { items: Room[] } }) => s.rooms.items);

  useEffect(() => {
    dispatch(fetchRooms() as unknown as UnknownAction);
  }, [dispatch]);

  const [page, setPage] = useState<number>(1);
  const [sortField, setSortField] = useState<keyof Room>('roomName');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [filter, setFilter] = useState<'All' | 'Available' | 'Booked'>('All');
  const [menu, setMenu] = useState<MenuState>(initialMenuState);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);

  const pageSize = 10;
  const statuses: ('All' | 'Available' | 'Booked')[] = [
    'All',
    'Available',
    'Booked',
  ];

  const filtered = useMemo(() =>
    rooms.filter(r => filter === 'All' || r.status === filter)
  ,[rooms, filter]);
  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => {
      let av = a[sortField];
      let bv = b[sortField];
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    })
  ,[filtered, sortField, sortAsc]);
  const total = sorted.length;
  const totalPages = Math.ceil(total / pageSize);
  const paged = useMemo(() =>
    sorted.slice((page - 1) * pageSize, page * pageSize)
  ,[sorted, page]);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const headerClick = (f: keyof Room) => {
    if (sortField === f) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(f);
      setSortAsc(true);
    }
  };

  const onMore = (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    setMenu({ visible: true, room, x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => {
    setMenu(prevMenu => ({ ...prevMenu, visible: false }));
  };

  const handleDelete = () => {
    if (menu.room) {
      dispatch(deleteRoom(menu.room.roomId) as unknown as UnknownAction);
      closeMenu();
    }
  };

  const handleEdit = () => {
    if (menu.room) {
      setIsNew(false);
      setEditRoom(menu.room);
      closeMenu();
    }
  };

  const openCreate = () => {
  console.log("Contenido del array 'rooms':", rooms); // Paso 1: Ver el array completo

  const mappedIds = rooms.map(room => {
    const match = room.roomId.match(/^R-(\d+)$/);
    const parsedId = match ? parseInt(match[1], 10) : null;
    console.log(`Room ID: ${room.roomId}, Match: ${match}, Parsed ID: ${parsedId}`); // Paso 2: Ver cada ID, la coincidencia y el resultado del parse
    return parsedId;
  });

  console.log("Array 'mappedIds' después del map:", mappedIds); // Paso 3: Ver el array después del map

  const existingIds = mappedIds.filter(id => id !== null);
  console.log("Array 'existingIds' después del filter:", existingIds); // Paso 4: Ver el array final de IDs válidos

  let nextIdNumber = 1;
  if (existingIds.length > 0) {
    nextIdNumber = Math.max(...existingIds) + 1;
  }

  const id = 'R-' + String(nextIdNumber).padStart(3, '0');
    setIsNew(true);
    setEditRoom({
      roomId: id,
      roomName: 'Example Room',
      bedType: 'Queen',
      roomFloor: '1st',
      facilities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
      rate: '120',
      status: 'Available',
      image:
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWx8ZW58MHx8MHx8fDA%3D',
    });
  };

  const handleSave = () => {
    if (editRoom) {
      if (isNew) {
        dispatch(createRoom(editRoom) as unknown as UnknownAction);
      } else {
        dispatch(updateRoom(editRoom) as unknown as UnknownAction);
      }
      setEditRoom(null);
    }
  };

  return (
    <Page onClick={closeMenu}>
      <Header>
        <Tabs>
          {statuses.map(s => (
            <Tab
              key={s}
              $active={filter === s}
              onClick={() => {
                setFilter(s);
                setPage(1);
              }}
            >
              {t[s.toLowerCase()] || s}
            </Tab>
          ))}
        </Tabs>
        <AddButton onClick={openCreate}>{t.addRoom || 'Add Room'}</AddButton>
      </Header>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              {(
                ['roomName', 'bedType', 'roomFloor', 'facilities', 'rate', 'status'] as (keyof Room)[]
              ).map(f => (
                <Th key={f} onClick={() => headerClick(f)}>
                  {t[f] || f}
                  {sortField === f && (
                    <SortIcon>{sortAsc ? <FiChevronUp /> : <FiChevronDown />}</SortIcon>
                  )}
                </Th>
              ))}
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={i}>
                <NameCell>
                  <img src={r.image} alt="" />
                  <div>
                    <small>{r.roomId}</small>
                    <br />
                    <strong>{r.roomName}</strong>
                  </div>
                </NameCell>
                <Td>{r.bedType}</Td>
                <Td>{r.roomFloor}</Td>
                <Td>{r.facilities.join(', ')}</Td>
                <Td>{r.rate}</Td>
                <CenterTd>
                  <Button
                    $bg={r.status === 'Available' ? 'green' : 'red'}
                    $color="#fff"
                  >
                    {t[r.status.toLowerCase()] || r.status}
                  </Button>
                </CenterTd>
                <CenterTd style={{ position: 'relative' }}>
                  <FiMoreVertical
                    style={{ cursor: 'pointer' }}
                    onClick={e => onMore(e, r)}
                  />
                  {menu.visible && menu.room === r && (
                    <Menu y={menu.y}>
                      <MenuItem onClick={handleEdit}>{t.edit || 'Edit'}</MenuItem>
                      <MenuItem onClick={handleDelete}>
                        {t.delete || 'Delete'}
                      </MenuItem>
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
          {t.entriesInfo?.replace('{start}', String(start)).replace('{end}', String(end)).replace('{total}', String(total))}
        </div>
        <PageControls>
          <PageButton
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
          >
            {t.previous}
          </PageButton>
          {Array.from({ length: totalPages }, (_, j) => (
            <PageButton
              key={j}
              $active={page === j + 1}
              onClick={() => setPage(j + 1)}
            >
              {j + 1}
            </PageButton>
          ))}
          <PageButton
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
          >
            {t.next}
          </PageButton>
        </PageControls>
      </PaginationBar>

      {editRoom && (
        <Overlay>
          <Modal onClick={e => e.stopPropagation()}>
            <CloseIcon size={20} onClick={() => setEditRoom(null)} />
            <h3>
              {isNew ? t.addRoom || 'Add Room' : t.edit || 'Edit'}{' '}
              {editRoom.roomName}
            </h3>
            <Field>
              <Label>Room ID</Label>
              <Input value={editRoom.roomId} disabled />
            </Field>
            <Field>
              <Label>Room Name</Label>
              <Input
                value={editRoom.roomName}
                onChange={e =>
                  setEditRoom(r => r ? { ...r, roomName: e.target.value } : r)
                }
              />
            </Field>
            <Field>
              <Label>Bed Type</Label>
              <Input
                value={editRoom.bedType}
                onChange={e =>
                  setEditRoom(r =>  r ? ({ ...r, bedType: e.target.value }): r)
                }
              />
            </Field>
            <Field>
              <Label>Floor</Label>
              <Input
                value={editRoom.roomFloor}
                onChange={e =>
                  setEditRoom(r => r ? ({ ...r, roomFloor: e.target.value }): r)
                }
              />
            </Field>
            <Field>
              <Label>Facilities (comma)</Label>
              <Input
                value={editRoom.facilities.join(',')}
                onChange={e =>
                  setEditRoom(r =>r ?  ({
                    ...r,
                    facilities: e.target.value.split(','),
                  }): r)
                }
              />
            </Field>
            <Field>
              <Label>Rate</Label>
              <Input
                value={editRoom.rate}
                onChange={e =>
                  setEditRoom(r =>r ?  ({ ...r, rate: e.target.value }): r)
                }
              />
            </Field>
            <Field>
              <Label>Status</Label>
              <select
                value={editRoom.status}
                onChange={e =>
                  setEditRoom(r =>r ?  ({
                    ...r,
                    status: e.target.value as 'Available' | 'Booked',
                  }): r)
                }
                style={{
                  padding: '0.5rem',
                  width: '100%',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
              </select>
            </Field>
            <Field>
              <Label>Image URL</Label>
              <Input
                value={editRoom.image}
                onChange={e =>
                  setEditRoom(r =>r ? ({ ...r, image: e.target.value }): r)
                }
              />
            </Field>
            <Actions>
              <Button
                $bg={theme.subtitle}
                $color="#fff"
                onClick={() => setEditRoom(null)}
              >
                {t.cancel || 'Cancel'}
              </Button>
              <Button
                $bg={theme.primary}
                $color="#fff"
                onClick={handleSave}
              >
                {t.save || 'Save'}
              </Button>
            </Actions>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
};

export default Rooms;