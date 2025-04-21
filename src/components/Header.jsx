import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';

const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.primary};
  color: #fff;
`;

export default function Header() {
  const { toggleTheme, mode } = useContext(ThemeContext);
  const { lang, setLang, t } = useContext(LanguageContext);

  return (
    <Bar>
      <div>{/* Icon button to collapse sidebar */}</div>
      <h2>{t.pageTitle}</h2>
      <div>
        <button onClick={toggleTheme}>{mode === 'light' ? '🌙' : '☀️'}</button>
        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
      </div>
    </Bar>
    );
}