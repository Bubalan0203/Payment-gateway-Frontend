import React from 'react';
import styled from 'styled-components';

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

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(to right, #7c3aed, #9333ea);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

export default function SignupStep1({ formData, setFormData, next }) {
  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = e => {
    e.preventDefault();
    const { name, email, password, confirmPassword, securityQuestion, securityAnswer } = formData;
    if (!name || !email || !password || !confirmPassword || !securityQuestion || !securityAnswer)
      return alert('All fields are required');
    if (password !== confirmPassword)
      return alert('Passwords do not match');
    next();
  };

  return (
    <Wrapper>
      <Card>
        <Title>Step 1: Personal Information</Title>
        <form onSubmit={handleNext}>
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
          <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" />
          <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />
          <Input name="securityQuestion" value={formData.securityQuestion} onChange={handleChange} placeholder="Security Question" />
          <Input name="securityAnswer" value={formData.securityAnswer} onChange={handleChange} placeholder="Answer" />
          <Button type="submit">Next</Button>
        </form>
      </Card>
    </Wrapper>
  );
}