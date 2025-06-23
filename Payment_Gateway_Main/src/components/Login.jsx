// === src/components/Login.jsx ===
import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(to right, #f0f4ff, #f8f9fc);
`;

const LeftSection = styled.div`
  flex: 1;
  padding: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1.2rem;
  }

  p {
    color: #555;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .features {
    display: flex;
    gap: 1.5rem;
    margin-top: 2rem;

    div {
      background: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      text-align: center;

      span {
        font-weight: 600;
        display: block;
        margin-top: 0.5rem;
      }
    }
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginBox = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 400px;

  h3 {
    font-weight: 700;
    margin-bottom: 0.75rem;
  }
  p {
    color: #666;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
`;

const Button = styled.button`
  width: 100%;
  background: linear-gradient(to right, #4f46e5, #9333ea);
  color: white;
  font-weight: 600;
  padding: 0.75rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    opacity: 0.95;
  }
`;

const CheckboxContainer = styled.div`
  margin: 0.5rem 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const endpoint = isAdmin ? '/auth/admin-login' : '/auth/login';
    try {
      const res = await api.post(endpoint, { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Wrapper>
      <LeftSection>
        <h1><span style={{ color: '#4f46e5' }}>PayGate</span><br />Secure Payment Gateway for Modern Businesses</h1>
        <p>Accept payments seamlessly with our robust, scalable, and secure platform built for the digital economy.</p>
        <div className="features">
          <div>
            🔒<span>Secure</span>
          </div>
          <div>
            ⚡<span>Fast</span>
          </div>
          <div>
            ✅<span>Trusted</span>
          </div>
        </div>
      </LeftSection>

      <RightSection>
        <LoginBox>
          <h3>Welcome Back</h3>
          <p>Sign in to your PayGate account</p>
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" type="email" required />
          <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" type="password" required />
          <CheckboxContainer>
            <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} />
            <label>Login as Admin</label>
          </CheckboxContainer>
          <Button onClick={handleLogin}>Sign In →</Button>
        </LoginBox>
      </RightSection>
    </Wrapper>
  );
}