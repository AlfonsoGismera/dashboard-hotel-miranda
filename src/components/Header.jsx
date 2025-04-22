import React, { useContext } from 'react';
import styled from 'styled-components';
import { Menu, Search, Heart, Mail, Bell, MessageSquare } from 'lucide-react';
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
const LeftGroup = styled.div` display: flex; align-items: center; gap: 1rem; `;
const Title = styled.h2`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;
const RightGroup = styled.div` display: flex; align-items: center; gap: 1rem; `;
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
  border-radius: 50%;
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
const Control = styled.div` display: flex; align-items: center; gap: 0.5rem; `;
const Select = styled.select`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

export default function Header() {
  const { t, lang, setLang } = useContext(LanguageContext);
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <Bar>
      <LeftGroup>
        <IconButton className="active"><Menu size={20} /></IconButton>
        <Title>{t.pageTitle}</Title>
      </LeftGroup>

      <RightGroup>
        <IconButton><Search size={20} /></IconButton>
        <IconButton className="active"><Heart size={20} /></IconButton>
        <IconButton>
          <Mail size={20} />
          <Badge bg="#FFA500">3</Badge>
        </IconButton>
        <IconButton>
          <Bell size={20} />
          <Badge bg="#FFA500">5</Badge>
        </IconButton>
        <IconButton>
          <MessageSquare size={20} />
          <Badge bg="#FFA500">!</Badge>
        </IconButton>
        <Avatar src="https://unsplash.com/es/fotos/una-ventana-con-un-marco-amarillo-pHwjuH2at-0" alt="User" />
        <Control>
          <button onClick={toggleTheme}>{mode === 'light' ? '🌙' : '☀️'}</button>
          <Select value={lang} onChange={e => setLang(e.target.value)}>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </Select>
        </Control>
      </RightGroup>
    </Bar>
  );
}