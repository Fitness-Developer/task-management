import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './reg.scss';

const Register = ({ setIsLoggedIn, setUsername }) => {
  const [username, setUsernameInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== password2) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/register/',
        {
          username,
          email,
          password,
          role,
          teams: [],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      // Сохраните токены в локальное хранилище или контекст
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);

      // Устанавливаем состояние
      setIsLoggedIn(true);
      setUsername(username);

      alert('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('There was an error!', error.response?.data);
      setError(error.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <form className="reglog-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsernameInput(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        required
      />

      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="user">User</option>
        <option value="admin">Administrator</option>
      </select>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
