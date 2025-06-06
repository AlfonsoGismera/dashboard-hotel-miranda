import React, { useContext } from 'react';
import styled from 'styled-components';
import { Menu, Heart, Mail, Bell, MessageSquare, Search } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';

const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
const SearchIcon = styled.div`
  position: absolute;
  right: 0.75rem;
  color: ${({ theme }) => theme.subtitle};
`;

const SearchInput = styled.input`
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  width: 200px;
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  &::placeholder {
    color: ${({ theme }) => theme.subtitle};
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.iconActive};
  }
`;

const IconButton = styled.div`
  position: relative;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  &:hover { color: #FFFFFF; }
  &.active { color: ${({ theme }) => theme.iconActive}; }
`;

const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background: ${({ bg }) => bg || '#E23428'};
  color: #FFFFFF;
  border-radius: 30%;
  font-size: 0.6rem;
  padding: 0.15rem 0.35rem;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
  background: #555;
`;

const Control = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};  
  cursor: pointer;
  option {
    color: #000000;                    
  }
  & option:checked {
    color: #000000;
  }
`;

const ClearButton = styled.button`
  background: ${({ theme }) => theme.error || '#E23428'};
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover { opacity: 0.9; }
`;

export default function Header() {
  const { t, lang, setLang } = useContext(LanguageContext);
  const { mode, toggleTheme } = useContext(ThemeContext);

  function handleClearStorage() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <Bar>
      <LeftGroup>
        <IconButton className="active"><Menu size={25} /></IconButton>
        <Title>Dashboard</Title>
      </LeftGroup>

      <RightGroup>
        <SearchContainer>
          <SearchIcon><Search size={20} /></SearchIcon>
          <SearchInput type="text" placeholder={t.searchPlaceholder || 'Search...'} />
        </SearchContainer>

        <IconButton className="active"><Heart size={20} /></IconButton>

        <IconButton>
          <Mail size={20} />
          <Badge bg="#E23428">3</Badge>
        </IconButton>

        <IconButton>
          <Bell size={20} />
          <Badge bg="#E23428">5</Badge>
        </IconButton>

        <IconButton>
          <MessageSquare size={20} />
          <Badge bg="#212121">!</Badge>
        </IconButton>

        <Avatar
          src="https://plus.unsplash.com/premium_photo-1669077046750-bef49171b059?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGV0cmElMjBoJTIwbG9nb3xlbnwwfHwwfHx8MA%3D%3D"
          alt="User"
        />

        <Control>
          <button onClick={toggleTheme}>{mode === 'light' ? '🌙' : '☀️'}</button>
          <Select value={lang} onChange={e => setLang(e.target.value)}>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </Select>
          <ClearButton onClick={handleClearStorage}>{t.clearData || 'Clear Data'}</ClearButton>
        </Control>
      </RightGroup>
    </Bar>
  );
}
