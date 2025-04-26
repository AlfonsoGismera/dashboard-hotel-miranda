// src/pages/Rooms.jsx
import React, { useState, useMemo, useContext } from 'react';
import styled, { useTheme } from 'styled-components';
import { LanguageContext } from '../context/LanguageContext';
import rooms from '../data/roomList.json';
import { FiMoreVertical, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const Page = styled.div`padding:1rem;`;
const Header = styled.div`
  display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;
`;
const EntriesInfo = styled.div`color:${({theme})=>theme.subtitle};`;
const Tabs = styled.div`
  display:flex; gap:1rem; margin-bottom:1rem; border-bottom:1px solid ${({theme})=>theme.borderColor};
`;
const Tab = styled.div`
  padding:0.5rem 1rem; cursor:pointer;
  border-bottom:3px solid ${({$active,theme})=> $active? theme.iconActive : 'transparent'};
  color: ${({$active,theme})=> $active? theme.text : theme.subtitle};
`;
const TableWrapper = styled.div`overflow-x:auto;`;
const Table = styled.table`width:100%; border-collapse:collapse;`;
const Th = styled.th`
  position:relative; padding:0.75rem; border-bottom:1px solid ${({theme})=>theme.borderColor};
  cursor:pointer; text-align:left;
`;
const SortIcon = styled.span`
  position:absolute; right:8px; top:50%; transform:translateY(-50%); font-size:0.75rem;
`;
const Td = styled.td`
  padding:0.75rem; border-bottom:1px solid ${({theme})=>theme.borderColor}; vertical-align:middle;
`;
const CenterTd = styled(Td)`text-align:center;`;

const NameCell = styled(Td)`
  display:flex; align-items:center; gap:0.5rem;
  img { width:40px; height:40px; border-radius:4px; object-fit:cover; }
`;

const Button = styled.button`
  padding:0.3rem 0.6rem; border:none; border-radius:0.25rem; cursor:pointer; font-size:0.9rem;
  background:${({$bg,theme})=> $bg||theme.cardBg};
  color:${({$color,theme})=> $color||theme.text};
  &:hover{ background:${({$hoverBg,theme})=> $hoverBg||theme.iconActive}; color:#fff; }
`;

const PaginationBar = styled.div`
  display:flex; justify-content:space-between; align-items:center; margin-top:1rem;
`;
const PageControls = styled.div`display:flex; gap:0.5rem;`;
const PageButton = styled.button`
  padding:0.4rem 0.8rem; border:none; border-radius:0.25rem; cursor:pointer;
  background:${({$active,theme})=> $active? theme.primary : 'transparent'};
  color:${({$active,theme})=> $active? '#fff' : theme.text};
  &:hover{background:${({theme})=>theme.iconActive}; color:#fff;}
`;

export default function Rooms() {
  const { t } = useContext(LanguageContext);
  const theme = useTheme();

  const [page,setPage] = useState(1);
  const [sortField,setSortField] = useState('roomName');
  const [sortAsc,setSortAsc] = useState(true);
  const [filter,setFilter] = useState('All');
  const pageSize = 10;

  const statuses = ['All','Available','Booked'];
  const filtered = useMemo(
    ()=> rooms.filter(r=> filter==='All' || r.status===filter),
    [filter]
  );
  const sorted = useMemo(()=>[...filtered].sort((a,b)=>{
    let av=a[sortField], bv=b[sortField];
    if(av < bv) return sortAsc ? -1 : 1;
    if(av > bv) return sortAsc ? 1 : -1;
    return 0;
  }),[filtered,sortField,sortAsc]);
  const total = sorted.length, totalPages = Math.ceil(total/pageSize);
  const paged = useMemo(
    ()=> sorted.slice((page-1)*pageSize, page*pageSize),
    [sorted,page]
  );
  const start = (page-1)*pageSize+1, end = Math.min(page*pageSize,total);

  const headerClick = f => {
    if(sortField===f) setSortAsc(!sortAsc);
    else { setSortField(f); setSortAsc(true); }
  };

  return (
    <Page>
      <Header>
        <Tabs>
          {statuses.map(s=>(
            <Tab key={s} $active={filter===s} onClick={()=>{setFilter(s); setPage(1);}}>
              {t[s.toLowerCase()]||s}
            </Tab>
          ))}
        </Tabs>
      </Header>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              {['roomName','bedType','roomFloor','facilities','rate','status'].map(field=>(
                <Th key={field} onClick={()=>headerClick(field)}>
                  {t[field]||field}
                  {sortField===field && (
                    <SortIcon>{sortAsc ? <FiChevronUp/> : <FiChevronDown/>}</SortIcon>
                  )}
                </Th>
              ))}
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r,i)=>(
              <tr key={i}>
                <NameCell>
                  <img src={r.image} alt={r.roomName}/>
                  <div>
                    <strong>{r.roomName}</strong><br/>
                    <small>{r.roomId}</small>
                  </div>
                </NameCell>
                <Td>{r.bedType}</Td>
                <Td>{r.roomFloor}</Td>
                <Td>{r.facilities.join(', ')}</Td>
                <Td>{r.rate}</Td>
                <CenterTd>
                  <Button
                    $bg={r.status==='Available'?'green':'red'}
                    $color="#fff"
                  >
                    {t[r.status.toLowerCase()]||r.status}
                  </Button>
                </CenterTd>
                <CenterTd><FiMoreVertical/></CenterTd>
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
          <PageButton $active={false} onClick={()=>page>1&&setPage(page-1)} disabled={page===1}>
            {t.previous}
          </PageButton>
          {Array.from({length:totalPages},(_,j)=>(
            <PageButton key={j} $active={page===j+1} onClick={()=>setPage(j+1)}>
              {j+1}
            </PageButton>
          ))}
          <PageButton $active={false} onClick={()=>page<totalPages&&setPage(page+1)} disabled={page===totalPages}>
            {t.next}
          </PageButton>
        </PageControls>
      </PaginationBar>
    </Page>
  );
}
