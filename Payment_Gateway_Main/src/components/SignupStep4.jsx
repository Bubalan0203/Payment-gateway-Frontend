import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
  background: #f9f9fb;
  min-height: 100vh;
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: #4c1d95;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd6fe;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;

  &:focus {
    border-color: #8b5cf6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  color: white;
`;

const BackButton = styled(Button)`
  background: #6b7280;
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(to right, #7c3aed, #9333ea);
`;

export default function SignupStep4({ formData, setFormData, back }) {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const { panCard, aadhaarCard } = formData;
    if (!panCard || !aadhaarCard)
      return alert('Please enter both PAN and Aadhaar card numbers');

    setSubmitting(true);
    try {
      await api.post('/auth/signup', formData);
      alert('Signup successful. Admin will verify and activate your account.');
      navigate('/signup-success');
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <Title>Step 4: KYC Details</Title>
        <form onSubmit={handleSubmit}>
          <Input
            name="panCard"
            value={formData.panCard}
            onChange={handleChange}
            placeholder="PAN Card Number"
            required
          />
          <Input
            name="aadhaarCard"
            value={formData.aadhaarCard}
            onChange={handleChange}
            placeholder="Aadhaar Number"
            required
          />
          <ButtonGroup>
            <BackButton type="button" onClick={back}>Back</BackButton>
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </Card>
    </Wrapper>
  );
}