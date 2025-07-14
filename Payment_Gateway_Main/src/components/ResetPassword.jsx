// src/components/ResetPassword.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const Error = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const { email } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (newPassword !== confirm) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await api.post('/auth/reset-password-final', { email, newPassword });
      alert('Password reset successful!');
      navigate('/user-login');
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
    }
  };

  return (
    <Container>
      <Card>
        <Title>Reset Password</Title>
        {error && <Error>{error}</Error>}
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm New Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <Button onClick={handleSubmit}>Reset Password</Button>
      </Card>
    </Container>
  );
}
