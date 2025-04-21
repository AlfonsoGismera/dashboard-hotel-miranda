import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (login(user, pass)) navigate('/');
    else alert('Invalid credentials');
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '2rem auto' }}>
      <h1>Login</h1>
      <input placeholder="Username" value={user} onChange={e => setUser(e.target.value)} required />
      <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required />
      <button type="submit">Sign In</button>
    </form>
  );
}