import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;
const Main = styled.main`
  flex: 1;
  padding: 1rem;
`;

export default function Layout({ children }) {
  return (
    <Container>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Main>{children}</Main>
      </div>
    </Container>
  );
}