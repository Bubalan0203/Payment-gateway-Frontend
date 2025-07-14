// src/components/ForgetPassword.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  font-weight: 700;
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
  background: #4f46e5;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const Error = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFetchQuestion = async () => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setQuestion(res.data.question);
      setStep(2);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'User not found');
    }
  };

  const handleAnswer = async () => {
    try {
      await api.post('/auth/verify-answer', { email, answer });
      navigate(`/reset-password/${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Incorrect answer');
    }
  };

  return (
    <Container>
      <Card>
        <Title>Forgot Password</Title>
        {error && <Error>{error}</Error>}

        {step === 1 && (
          <>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleFetchQuestion}>Next</Button>
          </>
        )}

        {step === 2 && (
          <>
            <p><strong>Security Question:</strong><br />{question}</p>
            <Input
              type="text"
              placeholder="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <Button onClick={handleAnswer}>Verify & Continue</Button>
          </>
        )}
      </Card>
    </Container>
  );
}
