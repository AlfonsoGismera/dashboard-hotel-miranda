// src/components/QuickStats.jsx
import React, { useContext } from 'react';
import styled from 'styled-components';
import { ArrowRight } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

const Card = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.text};
  small { font-size: 0.8rem; }
  h2    { margin: 0; font-size: 1.5rem; }
`;

export default function QuickStats({ titleKey, value }) {
  const { t } = useContext(LanguageContext);
  return (
    <Card>
      <div>
        <small>{t[titleKey]}</small><br/>
        <h2>{value}</h2>
      </div>
      <ArrowRight />
    </Card>
  );
}
