import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserShield } from 'react-icons/fa';

const Page = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
`;

const Left = styled.div`
  flex: 1;
  background: linear-gradient(to bottom right, #eef2ff, #f5f3ff);
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
`;

const SubText = styled.p`
  font-size: 1.1rem;
  color: #555;
  max-width: 500px;
`;

const Highlights = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const HighlightBox = styled.div`
  background: white;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  border: 1px solid #ddd6fe;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 150px;
`;

const TagTitle = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
`;

const Right = styled.div`
  flex: 1;
  background: white;
  padding: 4rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormCard = styled.form`
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const SubTitle = styled.p`
  margin-bottom: 1.5rem;
  color: #666;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(to right, #4f46e5, #9333ea);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      alert('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email');
      return false;
    }
    if (!password.trim()) {
      alert('Password is required');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await api.post('/auth/admin-login', {
        email: email.toLowerCase(),
        password
      });
      localStorage.setItem('admin', JSON.stringify(res.data));
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Page>
      <Left>
        <h2 style={{ color: '#6366f1', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          <FaUserShield style={{ marginRight: 8 }} />
          PayGate
        </h2>
        <Heading>Secure Payment Gateway for Modern Businesses</Heading>
        <SubText>
          Accept payments seamlessly with our robust, scalable, and secure platform designed for the digital economy.
        </SubText>

        <Highlights>
          <HighlightBox>
            <TagTitle>🔒 Secure</TagTitle>
            <div>Bank-grade encryption</div>
          </HighlightBox>
          <HighlightBox>
            <TagTitle>⚡ Fast</TagTitle>
            <div>Instant settlements</div>
          </HighlightBox>
          <HighlightBox>
            <TagTitle>✅ Trusted</TagTitle>
            <div>10M+ users</div>
          </HighlightBox>
        </Highlights>
      </Left>

      <Right>
        <FormCard onSubmit={handleLogin}>
          <Title>Welcome Back</Title>
          <SubTitle>Sign in to your PayGate admin account</SubTitle>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value.toLowerCase())}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button type="submit">Sign In</Button>
        </FormCard>
      </Right>
    </Page>
  );
}