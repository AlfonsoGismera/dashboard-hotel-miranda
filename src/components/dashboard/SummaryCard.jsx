import React, { useContext } from 'react';
import styled from 'styled-components';
import { LanguageContext } from '../../context/LanguageContext';

const Card = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
`;

const Info = styled.div`
  margin-left: 1rem;
  color: ${({ theme }) => theme.text};
  small { display: block; font-size: 0.8rem; }
  h2    { margin: 0; font-size: 1.5rem; }
`;

export default function SummaryCard({ icon, labelKey, value }) {
  const { t } = useContext(LanguageContext);
  return (
    <Card>
      {icon}
      <Info>
        <small>{t[labelKey]}</small>
        <h2>{value}</h2>
      </Info>
    </Card>
  );
}
