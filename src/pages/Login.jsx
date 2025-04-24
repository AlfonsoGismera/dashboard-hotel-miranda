import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px); /* adjust for header height */
  background: ${({ theme }) => theme.background};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 360px;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}33;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background: ${({ theme }) => theme.primary};
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.iconActive};
  }
`;

const Error = styled.div`
  color: #d9534f;
  font-size: 0.875rem;
  text-align: center;
`;

export default function Login() {
  const { t } = useContext(LanguageContext);
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (login(user, pass)) {
      navigate('/');
    } else {
      setError(t.invalidCredentials);
    }
  }

  return (
    <Container>
      <Card>
        <Title>{t.login}</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder={t.username}
            value={user}
            onChange={e => setUser(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder={t.password}
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
          />
          {error && <Error>{error}</Error>}
          <Button type="submit">{t.signIn}</Button>
        </Form>
      </Card>
    </Container>
  );
}
