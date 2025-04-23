import React, { useState, useMemo, useContext } from 'react';
import styled, { useTheme } from 'styled-components';
import { LanguageContext } from '../context/LanguageContext';
import data from '../data/guests.json';
import { format } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import es from 'date-fns/locale/es';
import { FiMoreVertical, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const Page = styled.div`padding:1rem; position: relative;`;
const Header = styled.div`display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; margin-bottom:1rem;`;
const Title = styled.h1`margin:0;`;
const EntriesInfo = styled.div`font-size:0.9rem; color:${({ theme }) => theme.subtitle};`;
const Tabs = styled.div`display:flex; gap:1rem; border-bottom:1px solid ${({ theme }) => theme.borderColor}; margin-bottom:1rem;`;
const Tab = styled.div`
  padding:0.5rem 1rem;
  cursor:pointer;
  border-bottom: 3px solid ${({ active, theme }) => active ? theme.iconActive : 'transparent'};
  color: ${({ active, theme }) => active ? theme.text : theme.subtitle};
`;
const TableWrapper = styled.div`overflow-x:auto;`;
const Table = styled.table`width:100%; border-collapse:collapse;`;
const Th = styled.th`padding:0.75rem; border-bottom:1px solid ${({ theme }) => theme.borderColor}; text-align:left; cursor:pointer; white-space:nowrap;`;
const Td = styled.td`padding:0.75rem; border-bottom:1px solid ${({ theme }) => theme.borderColor}; vertical-align:top; white-space:nowrap;`;
const CenterTd = styled(Td)`text-align:center;`;
const Button = styled.button`
  padding:0.3rem 0.6rem;
  border:none;
  border-radius:0.25rem;
  cursor:pointer;
  min-width:80px;
  font-size:0.9rem;
  background: ${({ bg, theme }) => bg || theme.cardBg};
  color: ${({ color, theme }) => color || theme.text};
  &:hover { background: ${({ hoverBg, theme }) => hoverBg || theme.iconActive}; color: #fff; }
`;
const PaginationBar = styled.div`display:flex; justify-content:space-between; align-items:center; margin-top:1rem;`;
const PageControls = styled.div`display:flex; align-items:center; gap:0.5rem;`;
const PageButton = styled.button`
  padding:0.4rem 0.8rem;
  border:none;
  background: ${({ active, theme }) => active ? theme.primary : 'transparent'};
  color: ${({ active, theme }) => active ? '#fff' : theme.text};
  cursor:pointer;
  border-radius:0.25rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 1rem;
  border-radius: 0.5rem;
  position: relative;
  width: 300px;
`;
const CloseButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: red;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover { background: darkred; }
`;

export default function Guests() {
    const { t, lang } = useContext(LanguageContext);
    const theme = useTheme();
    const [page, setPage] = useState(1);
    const [sortField, setSortField] = useState('orderDate');
    const [sortAsc, setSortAsc] = useState(true);
    const [filter, setFilter] = useState('All');
    const [modalText, setModalText] = useState(null);
    const pageSize = 10;
    const statusColors = {
        'Checked In': 'green',
        'Checked Out': 'red',
        'Pending': '#b2f31d',
        'Booked': '#0275d8',
        'Cancelled': '#d9534f',
    };

    const locale = lang === 'es' ? es : enUS;
    const statuses = ['All', 'Pending', 'Booked', 'Cancelled', 'Refunded'];

    const filtered = useMemo(() => data.filter(r => filter === 'All' || r.status === filter), [filter]);
    const sorted = useMemo(() => [...filtered].sort((a, b) => {
        let av = a[sortField], bv = b[sortField];
        if (sortField.toLowerCase().includes('date')) { av = new Date(av); bv = new Date(bv); }
        let v = av < bv ? -1 : av > bv ? 1 : 0;
        return sortAsc ? v : -v;
    }), [filtered, sortField, sortAsc]);
    const total = sorted.length;
    const totalPages = Math.ceil(total / pageSize);
    const paged = useMemo(() => sorted.slice((page - 1) * pageSize, page * pageSize), [sorted, page]);

    const start = (page - 1) * pageSize + 1; const end = Math.min(page * pageSize, total);

    function headerClick(field) {
        if (sortField === field) setSortAsc(!sortAsc);
        else { setSortField(field); setSortAsc(true); }
    }

    return (
        <Page>
            {modalText && (
                <ModalOverlay onClick={() => setModalText(null)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <CloseButton onClick={() => setModalText(null)}>×</CloseButton>
                        <p>{modalText}</p>
                    </ModalContent>
                </ModalOverlay>
            )}
            <Header>
                <Tabs>{statuses.map(s => (<Tab key={s} active={filter === s} onClick={() => { setFilter(s); setPage(1); }}>{t[s.toLowerCase()] || s}</Tab>))}</Tabs>
                <EntriesInfo>{t.entriesInfo.replace('{start}', start).replace('{end}', end).replace('{total}', total)}</EntriesInfo>
            </Header>
            <TableWrapper>
                <Table>
                    <thead>
                        <tr>
                            <Th onClick={() => headerClick('guest')}>{t.guest}</Th>
                            <Th onClick={() => headerClick('orderDate')}>{t.orderDate}</Th>
                            <Th onClick={() => headerClick('checkIn')}>{t.checkIn}</Th>
                            <Th onClick={() => headerClick('checkOut')}>{t.checkOut}</Th>
                            <Th>{t.specialRequest}</Th>
                            <Th onClick={() => headerClick('roomType')}>{t.roomType}</Th>
                            <Th onClick={() => headerClick('status')}>{t.status}</Th>
                            <Th></Th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map((r, i) => (
                            <tr key={i}>
                                <Td>
                                    <strong>{r.guest}</strong>
                                    <br />
                                    <small>{r.reservationId}</small>
                                </Td>
                                <Td>{format(new Date(r.orderDate), 'MMM do yyyy hh:mm a', { locale })}</Td>
                                <Td>{format(new Date(r.checkIn), 'MMM do yyyy', { locale })}</Td>
                                <Td>{format(new Date(r.checkOut), 'MMM do yyyy', { locale })}</Td>
                                <CenterTd>
                                    <Button
                                        onClick={() => setModalText(r.specialRequest)}
                                        hoverBg={theme.iconActive}
                                        color={theme.iconActive}
                                    >
                                        {t.viewNotes}
                                    </Button>
                                </CenterTd>
                                <Td>{r.roomType}</Td>
                                <Td>
                                    <Button
                                        bg={statusColors[r.status] || 'orange'}
                                        color="#fff"
                                        hoverbg="#222"
                                    >
                                        {r.status}
                                    </Button>
                                </Td>
                                <CenterTd>
                                    <FiMoreVertical />
                                </CenterTd>
                            </tr>
                        ))}
                    </tbody>

                </Table>
            </TableWrapper>
            <PaginationBar>
                <EntriesInfo>{t.entriesInfo.replace('{start}', start).replace('{end}', end).replace('{total}', total)}</EntriesInfo>
                <PageControls>
                    <PageButton active={false} onClick={() => page > 1 && setPage(page - 1)} disabled={page === 1}>{t.previous}</PageButton>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <PageButton key={i} active={page === i + 1} onClick={() => setPage(i + 1)}>{i + 1}</PageButton>
                    ))}
                    <PageButton active={false} onClick={() => page < totalPages && setPage(page + 1)} disabled={page === totalPages}>{t.next}</PageButton>
                </PageControls>
            </PaginationBar>
        </Page>
    );
}