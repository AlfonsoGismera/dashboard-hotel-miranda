import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';

const Container = styled.div`
  display: flex;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  height: 100vh;
  @media(max-width: 768px) {
    flex-direction: column;
  }
`;
const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const Content = styled.main`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

export default function Layout({ children }) {
  return (
    <Container>
      <Sidebar />
      <MainArea>
        <Header />
        <Content>{children}</Content>
      </MainArea>
    </Container>
  );
}
